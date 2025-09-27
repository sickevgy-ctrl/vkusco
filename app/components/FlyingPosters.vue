<template>
  <div ref="containerRef" class="posters-container" :class="className">
    <canvas ref="canvasRef" class="posters-canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  items: string[]
  planeWidth?: number
  planeHeight?: number
  distortion?: number
  scrollEase?: number
  cameraFov?: number
  cameraZ?: number
  className?: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// OGL runtime bindings (assigned on client)
let Renderer: any, Camera: any, Transform: any, Plane: any, Program: any, Mesh: any, Texture: any
let renderer: any = null
let gl: any = null
let camera: any = null
let scene: any = null
let planeGeometry: any = null
let medias: any[] = []
let viewport = { width: 1, height: 1 }
let screen = { width: 1, height: 1 }
let rafId: number | null = null

// Utils
function lerp(p1: number, p2: number, t: number) { return p1 + (p2 - p1) * t }
function map(num: number, min1: number, max1: number, min2: number, max2: number) {
  const num1 = (num - min1) / (max1 - min1)
  return num1 * (max2 - min2) + min2
}

const vertexShader = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;
varying vec2 vUv;
varying vec3 vNormal;
float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(
    oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                              0.0,                                0.0,                                1.0
  );
}
vec3 rotate(vec3 v, vec3 axis, float angle) { mat4 m = rotationMatrix(axis, angle); return (m * vec4(v, 1.0)).xyz; }
float qinticInOut(float t) { return t < 0.5 ? 16.0 * pow(t, 5.0) : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0; }
void main() {
  vUv = uv;
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;
varying vec2 vUv;
void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;
  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);
  if (planeAspect > imageAspect) { scale.x = imageAspect / planeAspect; } else { scale.y = planeAspect / imageAspect; }
  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;
  gl_FragColor = texture2D(tMap, uv);
}
`

class Media {
  gl: WebGLRenderingContext
  geometry: any
  scene: any
  screen: { width: number; height: number }
  viewport: { width: number; height: number }
  image: string
  length: number
  index: number
  planeWidth: number
  planeHeight: number
  distortion: number
  plane!: any
  program!: any
  extra = 0
  padding = 5
  height = 0
  heightTotal = 0
  y = 0

  constructor({ gl, geometry, scene, screen, viewport, image, length, index, planeWidth, planeHeight, distortion }: any) {
    this.gl = gl
    this.geometry = geometry
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.image = image
    this.length = length
    this.index = index
    this.planeWidth = planeWidth
    this.planeHeight = planeHeight
    this.distortion = distortion
    this.createShader()
    this.createMesh()
    this.onResize()
  }

  createShader() {
  const texture = new Texture(this.gl as any, { generateMipmaps: false })
  this.program = new Program(this.gl as any, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 0 }
      },
      cullFace: false
    })

    const img = new Image()
    img.crossOrigin = 'anonymous'
    const trySrcs = [
      this.image,
      'https://picsum.photos/seed/oglfallback/1024/768'
    ]
    let idx = 0
    const applyImage = (im: HTMLImageElement) => {
      ;(texture as any).image = im
      ;(this.program as any).uniforms.uImageSize.value = [im.naturalWidth || 1024, im.naturalHeight || 768]
    }
    const loadNext = () => {
      if (idx >= trySrcs.length) {
        // финальный резерв — прозрачный 1x1 пиксель
        const tiny = new Image()
        tiny.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAkMBQ0o8nxUAAAAASUVORK5CYII='
        tiny.onload = () => applyImage(tiny)
        return
      }
      img.src = trySrcs[idx++]
    }
    img.onload = () => applyImage(img)
    img.onerror = () => loadNext()
    loadNext()
  }

  createMesh() {
  this.plane = new Mesh(this.gl as any, { geometry: this.geometry as any, program: this.program as any })
    this.plane.setParent(this.scene)
  }

  setScale() {
    this.plane.scale.x = (this.viewport.width * this.planeWidth) / this.screen.width
    this.plane.scale.y = (this.viewport.height * this.planeHeight) / this.screen.height
    this.plane.position.x = 0
    ;(this.plane.program as any).uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y]
  }

  onResize({ screen, viewport }: any = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      ;(this.plane.program as any).uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height]
    }
    this.setScale()
    this.padding = 5
    this.height = (this.plane.scale.y as number) + this.padding
    this.heightTotal = this.height * this.length
    this.y = -this.heightTotal / 2 + (this.index + 0.5) * this.height
  }

  update(scroll: { current: number }, controlled: boolean) {
    this.plane.position.y = this.y - scroll.current - this.extra
    const position = map(this.plane.position.y as number, -this.viewport.height, this.viewport.height, 5, 15)
    ;(this.program as any).uniforms.uPosition.value = position
    ;(this.program as any).uniforms.uTime.value += 0.04
    ;(this.program as any).uniforms.uSpeed.value = scroll.current

    const planeHeight = this.plane.scale.y as number
    const viewportHeight = this.viewport.height
    const topEdge = (this.plane.position.y as number) + planeHeight / 2
    const bottomEdge = (this.plane.position.y as number) - planeHeight / 2

    // Сохраняем непрерывную ленту без разрывов (wrap-around всегда активен)
    if (topEdge < -viewportHeight / 2) {
      this.extra -= this.heightTotal
    } else if (bottomEdge > viewportHeight / 2) {
      this.extra += this.heightTotal
    }
  }
}

class CanvasImpl {
  container: HTMLDivElement
  canvas: HTMLCanvasElement
  items: string[]
  planeWidth: number
  planeHeight: number
  distortion: number
  scroll: { ease: number; current: number; target: number; last: number; position: number } = { ease: 0.01, current: 0, target: 0, last: 0, position: 0 }
  cameraFov: number
  cameraZ: number
  isDown = false
  start = 0
  controlled = false
  maxScroll = 0

  constructor({ container, canvas, items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ }: any) {
    this.container = container
    this.canvas = canvas
    this.items = items
    this.planeWidth = planeWidth
    this.planeHeight = planeHeight
    this.distortion = distortion
    this.scroll.ease = scrollEase
    this.cameraFov = cameraFov
    this.cameraZ = cameraZ

    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias()
    this.update = this.update.bind(this)
    this.update()
    this.addEventListeners()
    this.createPreloader()
  }

  createRenderer() {
    renderer = new Renderer({ canvas: this.canvas, alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) })
    gl = renderer.gl
  }

  createCamera() {
    camera = new Camera(gl as any)
    ;(camera as any).fov = this.cameraFov
    ;(camera as any).position.z = this.cameraZ
  }

  createScene() { scene = new Transform() }

  createGeometry() { planeGeometry = new Plane(gl as any, { heightSegments: 1, widthSegments: 240 }) }

  createMedias() {
    medias = this.items.map((image, index) => new Media({
      gl,
      geometry: planeGeometry,
      scene,
      screen,
      viewport,
      image,
      length: this.items.length,
      index,
      planeWidth: this.planeWidth,
      planeHeight: this.planeHeight,
      distortion: this.distortion
    }))
    // Вычислим максимальный путь скролла по высоте контента (без зацикливания)
    if (medias.length) {
      const m0 = medias[0]
      this.maxScroll = Math.max(0, (m0.heightTotal || 0) - (m0.height || 0))
    }
  }

  createPreloader() {
    let loaded = 0
    if (!this.items.length) return
    this.items.forEach((src) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = src
      image.onload = () => {
        loaded += 1
        if (loaded === this.items.length) {
          document.documentElement.classList.remove('loading')
          document.documentElement.classList.add('loaded')
        }
      }
    })
  }

  onResize = () => {
    const rect = this.container.getBoundingClientRect()
    screen = { width: rect.width, height: rect.height }
    ;(renderer as any).setSize(screen.width, screen.height)

    ;(camera as any).perspective({ aspect: (gl as any).canvas.width / (gl as any).canvas.height })
    const fov = ((camera as any).fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * (camera as any).position.z
    const width = height * (camera as any).aspect
    viewport = { height, width }
    if (medias) medias.forEach((m) => m.onResize({ screen, viewport }))
  }

  onTouchDown = (e: any) => { this.isDown = true; this.scroll.position = this.scroll.current; this.start = e.touches ? e.touches[0].clientY : e.clientY }
  onTouchMove = (e: any) => { if (!this.isDown) return; const y = e.touches ? e.touches[0].clientY : e.clientY; const distance = (this.start - y) * 0.1; this.scroll.target = this.scroll.position + distance }
  onTouchUp = () => { this.isDown = false }
  onWheel = (e: WheelEvent) => {
    if (this.controlled) return
    this.scroll.target += e.deltaY * 0.0025
    this.scroll.target = Math.max(-1e6, Math.min(1e6, this.scroll.target))
  }

  update() {
    // В управляемом режиме синхронизируемся напрямую, чтобы избежать рывков; иначе используем плавный lerp
    this.scroll.current = this.controlled ? this.scroll.target : lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    if (medias) medias.forEach((m) => m.update(this.scroll, this.controlled))
  ;(renderer as any).render({ scene, camera })
    this.scroll.last = this.scroll.current
    rafId = requestAnimationFrame(this.update)
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('wheel', this.onWheel as any)
    window.addEventListener('mousewheel', this.onWheel as any)
    window.addEventListener('mousedown', this.onTouchDown as any)
    window.addEventListener('mousemove', this.onTouchMove as any)
    window.addEventListener('mouseup', this.onTouchUp as any)
    window.addEventListener('touchstart', this.onTouchDown as any)
    window.addEventListener('touchmove', this.onTouchMove as any)
    window.addEventListener('touchend', this.onTouchUp as any)
  }

  destroy() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('wheel', this.onWheel as any)
    window.removeEventListener('mousewheel', this.onWheel as any)
    window.removeEventListener('mousedown', this.onTouchDown as any)
    window.removeEventListener('mousemove', this.onTouchMove as any)
    window.removeEventListener('mouseup', this.onTouchUp as any)
    window.removeEventListener('touchstart', this.onTouchDown as any)
    window.removeEventListener('touchmove', this.onTouchMove as any)
    window.removeEventListener('touchend', this.onTouchUp as any)
  }

  // Управляемый скролл от родителя (ScrollTrigger)
  setProgress(t: number) {
    this.controlled = true
    const clamped = Math.max(0, Math.min(1, t))
    const target = clamped * (this.maxScroll || 0)
    this.scroll.target = target
  }

  releaseControl() {
    this.controlled = false
  }
}

let instance: CanvasImpl | null = null

onMounted(() => {
  if (!containerRef.value || !canvasRef.value) return
  // Lazy-load OGL only on client to avoid SSR issues
  import('ogl').then((mod) => {
    Renderer = mod.Renderer; Camera = mod.Camera; Transform = mod.Transform; Plane = mod.Plane; Program = mod.Program; Mesh = mod.Mesh; Texture = mod.Texture
    instance = new CanvasImpl({
      container: containerRef.value as HTMLDivElement,
      canvas: canvasRef.value as HTMLCanvasElement,
      items: props.items,
      planeWidth: props.planeWidth ?? 320,
      planeHeight: props.planeHeight ?? 320,
      distortion: props.distortion ?? 3,
      scrollEase: props.scrollEase ?? 0.01,
      cameraFov: props.cameraFov ?? 45,
      cameraZ: props.cameraZ ?? 20
    })
  })
})

onBeforeUnmount(() => {
  if (instance) instance.destroy()
  if (rafId) cancelAnimationFrame(rafId)
})

// Экспортируем методы для управления из родителя
defineExpose({
  setProgress: (t: number) => instance?.setProgress(t),
  releaseControl: () => instance?.releaseControl()
})
</script>

<style scoped>
.posters-container { width: 100%; height: 100%; overflow: hidden; position: relative; z-index: 2; }
.posters-canvas { display: block; width: 100%; height: 100%; }
</style>
