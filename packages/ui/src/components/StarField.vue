<template>
  <div class="star-field">
    <!-- 小星星们 -->
    <span
      v-for="star in stars"
      :key="star.id"
      class="star"
      :style="{
        left: star.x + '%',
        top: star.y + '%',
        width: star.size + 'px',
        height: star.size + 'px',
        '--duration': star.duration + 's',
        animationDelay: star.delay + 's',
        background: star.color,
        boxShadow: star.glow ? `0 0 ${star.size * 2}px ${star.color}` : 'none'
      }"
    />
    <!-- 流星 -->
    <span
      v-for="(m, i) in 3"
      :key="'m-' + i"
      class="shooting-star"
      :style="{
        top: 5 + i * 25 + '%',
        left: 70 + i * 10 + '%',
        animationDelay: i * 4 + 's',
        animationDuration: (3 + i * 0.5) + 's'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Star {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
  glow: boolean
}

const starColors = ['#ffffff', '#fde68a', '#2dd4bf', '#60a5fa', '#fbbf24']

const stars = computed<Star[]>(() => {
  const result: Star[] = []
  for (let i = 0; i < 120; i++) {
    result.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 1.5 + Math.random() * 3,
      delay: Math.random() * 5,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      glow: Math.random() > 0.8
    })
  }
  return result
})
</script>

<style scoped>
.star-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  border-radius: 50%;
  animation: twinkle var(--duration) ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% {
    opacity: 0.15;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.shooting-star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.6);
  animation: shoot 3s linear infinite;
}

.shooting-star::after {
  content: '';
  position: absolute;
  top: 1px;
  right: 1px;
  width: 80px;
  height: 1px;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
  transform-origin: right center;
}

@keyframes shoot {
  0% {
    transform: translate(0, 0) rotate(-35deg);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(-600px, 400px) rotate(-35deg);
    opacity: 0;
  }
}
</style>