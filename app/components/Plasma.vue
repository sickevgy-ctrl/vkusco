<template>
  <div ref="containerRef" class="w-full h-full overflow-hidden relative" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  color?: string
  speed?: number
  direction?: 'forward' | 'reverse' | 'pingpong'
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: '#ffffff',
  speed: 1,
  direction: 'forward',
  scale: 1,
  opacity: 1,
  mouseInteractive: true
})

const containerRef = ref<HTMLElement | null>(null)
const mousePos = ref({ x: 0, y: 0 })

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 0.5, 0.2]
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ]
}

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`

let renderer: any = null
let program: any = null
let mesh: any = null
let raf: number = 0
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!containerRef.value) return

  // Import OGL dynamically
  import('ogl').then(({ Renderer, Program, Mesh, Triangle }) => {
    const useCustomColor = props.color ? 1.0 : 0.0
    const customColorRgb = props.color ? hexToRgb(props.color) : [1, 1, 1]
    const directionMultiplier = props.direction === 'reverse' ? -1.0 : 1.0

    renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    })
    const gl = renderer.gl
    const canvas = gl.canvas
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    containerRef.value!.appendChild(canvas)

    const geometry = new Triangle(gl)

    program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: props.speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: props.scale },
        uOpacity: { value: props.opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: props.mouseInteractive ? 1.0 : 0.0 }
      }
    })

    mesh = new Mesh(gl, { geometry, program })

    const handleMouseMove = (e: MouseEvent) => {
      if (!props.mouseInteractive) return
      const rect = containerRef.value!.getBoundingClientRect()
      mousePos.value.x = e.clientX - rect.left
      mousePos.value.y = e.clientY - rect.top
      const mouseUniform = program.uniforms.uMouse.value
      mouseUniform[0] = mousePos.value.x
      mouseUniform[1] = mousePos.value.y
    }

    if (props.mouseInteractive) {
      containerRef.value!.addEventListener('mousemove', handleMouseMove)
    }

    const setSize = () => {
      const rect = containerRef.value!.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))
      renderer.setSize(width, height)
      const res = program.uniforms.iResolution.value
      res[0] = gl.drawingBufferWidth
      res[1] = gl.drawingBufferHeight
    }

    resizeObserver = new ResizeObserver(setSize)
    resizeObserver.observe(containerRef.value!)
    setSize()

    const t0 = performance.now()
    const loop = (t: number) => {
      let timeValue = (t - t0) * 0.001

      if (props.direction === 'pingpong') {
        const cycle = Math.sin(timeValue * 0.5) * directionMultiplier
        program.uniforms.uDirection.value = cycle
      }

      program.uniforms.iTime.value = timeValue
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
  })
})

onUnmounted(() => {
  if (raf) {
    cancelAnimationFrame(raf)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (containerRef.value && props.mouseInteractive) {
    containerRef.value.removeEventListener('mousemove', () => {})
  }
  try {
    if (containerRef.value && renderer) {
      containerRef.value.removeChild(renderer.gl.canvas)
    }
  } catch {
    console.warn('Canvas already removed from container')
  }
})
</script>
