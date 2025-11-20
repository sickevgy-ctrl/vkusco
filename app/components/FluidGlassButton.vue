<template>
  <button 
    :class="buttonClass"
    @click="$emit('click', $event)"
    :disabled="disabled"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    v-split="splitConfig"
    ref="buttonRef"
  >
    <!-- Background blur layer -->
    <div class="button-blur-layer"></div>
    
    <!-- Transmission layer for glass effect -->
    <div class="button-transmission-layer"></div>
    
    <!-- Content layer -->
    <span class="button-content">
      <slot />
    </span>
    
    <!-- Dynamic glow effect -->
    <div class="button-glow" :style="glowStyle"></div>
    
    <!-- Refraction highlights -->
    <div class="button-highlights">
      <div class="highlight highlight-1"></div>
      <div class="highlight highlight-2"></div>
      <div class="highlight highlight-3"></div>
    </div>
    
    <!-- Fluid distortion overlay -->
    <div class="button-distortion" :style="distortionStyle"></div>
  </button>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  splitConfig: {
    type: Object,
    default: () => ({ types: 'words, chars', delayStep: 0.015, threshold: 0 })
  },
  // New props for enhanced glass effects
  transmission: {
    type: Number,
    default: 0.8
  },
  thickness: {
    type: Number,
    default: 5
  },
  ior: {
    type: Number,
    default: 1.15
  }
})

const emit = defineEmits(['click'])

// Reactive state for interactive effects
const buttonRef = ref(null)
const mousePosition = reactive({ x: 0, y: 0 })
const isHovered = ref(false)
const isPressed = ref(false)

// Handle mouse interactions
const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  isPressed.value = false
}

const handleMouseMove = (event) => {
  if (!buttonRef.value) return
  
  const rect = buttonRef.value.getBoundingClientRect()
  mousePosition.x = ((event.clientX - rect.left) / rect.width) * 100
  mousePosition.y = ((event.clientY - rect.top) / rect.height) * 100
}

// Computed styles for dynamic effects
const glowStyle = computed(() => ({
  transform: `translate(${mousePosition.x - 50}%, ${mousePosition.y - 50}%)`,
  opacity: isHovered.value ? 0.8 : 0.4,
  scale: isPressed.value ? '1.2' : '1'
}))

const distortionStyle = computed(() => ({
  background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 30%, 
    transparent 70%)`,
  opacity: isHovered.value ? 1 : 0.3
}))

const buttonClass = computed(() => {
  const baseClasses = [
    'fluid-glass-button',
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'transition-all',
    'duration-300',
    'ease-out',
    'overflow-hidden',
    'group',
    'cursor-pointer',
    'select-none'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-4', 'py-2', 'text-sm', 'rounded-xl'],
    md: ['px-6', 'py-3', 'text-base', 'rounded-2xl'],
    lg: ['px-8', 'py-4', 'text-lg', 'rounded-3xl']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-gradient-to-br',
      'from-white/20',
      'to-white/5',
      'backdrop-blur-xl',
      'border',
      'border-white/20',
      'text-white',
      'shadow-2xl',
      'shadow-black/20',
      'hover:from-white/30',
      'hover:to-white/10',
      'hover:border-white/30',
      'hover:shadow-3xl',
      'hover:shadow-black/30',
      'active:scale-95',
      'active:shadow-lg'
    ],
    secondary: [
      'bg-gradient-to-br',
      'from-primary-500/20',
      'to-primary-600/10',
      'backdrop-blur-xl',
      'border',
      'border-primary-400/30',
      'text-primary-100',
      'shadow-2xl',
      'shadow-primary-900/20',
      'hover:from-primary-500/30',
      'hover:to-primary-600/20',
      'hover:border-primary-400/50',
      'hover:shadow-3xl',
      'hover:shadow-primary-900/30',
      'active:scale-95',
      'active:shadow-lg'
    ],
    ghost: [
      'bg-transparent',
      'backdrop-blur-xl',
      'border',
      'border-white/10',
      'text-white/90',
      'hover:bg-white/5',
      'hover:border-white/20',
      'hover:text-white',
      'active:scale-95'
    ]
  }

  // Disabled state
  const disabledClasses = props.disabled ? [
    'opacity-50',
    'cursor-not-allowed',
    'hover:scale-100',
    'hover:shadow-2xl',
    'hover:shadow-black/20'
  ] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...disabledClasses
  ]
})
</script>

<style scoped>
.fluid-glass-button {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%, 
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Blur layer for depth */
.button-blur-layer {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: inherit;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: inherit;
  z-index: -1;
}

/* Transmission layer for glass refraction */
.button-transmission-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border-radius: inherit;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fluid-glass-button:hover .button-transmission-layer {
  opacity: 1;
}

.fluid-glass-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.fluid-glass-button:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.button-content {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* Enhanced glow effect */
.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.4) 0%, 
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.1) 60%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
  z-index: 1;
  filter: blur(1px);
}

.fluid-glass-button:hover .button-glow {
  width: 240px;
  height: 240px;
  animation: fluidPulse 3s ease-in-out infinite;
}

@keyframes fluidPulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Refraction highlights */
.button-highlights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
}

.highlight {
  position: absolute;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    transparent 50%
  );
  border-radius: 50%;
  animation: highlightFloat 4s ease-in-out infinite;
}

.highlight-1 {
  width: 8px;
  height: 8px;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.highlight-2 {
  width: 6px;
  height: 6px;
  top: 60%;
  right: 20%;
  animation-delay: 1.5s;
}

.highlight-3 {
  width: 4px;
  height: 4px;
  bottom: 25%;
  left: 60%;
  animation-delay: 3s;
}

@keyframes highlightFloat {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-10px) scale(1.2);
  }
}

/* Fluid distortion overlay */
.button-distortion {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

/* Disabled state */
.fluid-glass-button:disabled {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border-color: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.fluid-glass-button:disabled:hover {
  transform: none;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.fluid-glass-button:disabled .button-glow,
.fluid-glass-button:disabled .button-highlights,
.fluid-glass-button:disabled .button-distortion {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .fluid-glass-button {
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
  }
  
  .button-glow {
    width: 80px;
    height: 80px;
  }
  
  .fluid-glass-button:hover .button-glow {
    width: 160px;
    height: 160px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .fluid-glass-button {
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.6);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .fluid-glass-button,
  .button-glow,
  .highlight,
  .button-distortion {
    animation: none;
    transition: none;
  }
}
</style>
