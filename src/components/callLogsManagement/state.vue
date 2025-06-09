<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div 
      v-for="(stat, index) in stats" 
      :key="index"
      :class="getCardClass(index)"
      class="rounded-2xl p-6 text-white"
    >
      <div class="flex items-center justify-between">
        <div>
          <p :class="getTextClass(index)" class="text-sm font-medium">{{ stat.name }}</p>
          <p class="text-3xl font-bold">{{ stat.value }}</p>
        </div>
        <el-icon class="text-4xl opacity-80">
          <component :is="getIcon(index)" />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Phone, Calendar, Timer, User } from '@element-plus/icons-vue'

const props = defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => []
  }
})

const cardColors = [
  'bg-gradient-to-r from-blue-500 to-blue-600',
  'bg-gradient-to-r from-green-500 to-green-600', 
  'bg-gradient-to-r from-purple-500 to-purple-600',
  'bg-gradient-to-r from-orange-500 to-orange-600'
]

const textColors = [
  'text-blue-100',
  'text-green-100',
  'text-purple-100', 
  'text-orange-100'
]

const icons = [Phone, Calendar, Timer, User]

const getCardClass = (index) => {
  return cardColors[index % cardColors.length]
}

const getTextClass = (index) => {
  return textColors[index % textColors.length]
}

const getIcon = (index) => {
  return icons[index % icons.length]
}
</script>