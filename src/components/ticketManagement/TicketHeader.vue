<template>
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="p-3 rounded-xl" :class="iconBgClass">
            <el-icon class="text-2xl" :class="iconClass">
              <component :is="icon" />
            </el-icon>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ title }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ subtitle }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <slot name="actions">
            <el-button
              v-if="showDefaultAction"
              type="primary"
              size="large"
              class="!px-6 !py-3"
              @click="$emit('action-click')"
            >
              <el-icon class="mr-2">
                <component :is="actionIcon" />
              </el-icon>
              {{ actionText }}
            </el-button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Page Title'
  },
  subtitle: {
    type: String,
    default: 'Page description'
  },
  icon: {
    type: [String, Object],
    default: () => Plus
  },
  iconColor: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'gray'].includes(value)
  },
  actionText: {
    type: String,
    default: 'Add New'
  },
  actionIcon: {
    type: [String, Object],
    default: () => Plus
  },
  showDefaultAction: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['action-click']);

const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    pink: 'bg-pink-100',
    indigo: 'bg-indigo-100',
    gray: 'bg-gray-100'
  };
  return colorMap[props.iconColor] || 'bg-blue-100';
});

const iconClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600'
  };
  return colorMap[props.iconColor] || 'text-blue-600';
});
</script>