<template>
  <div class="grid gap-6 mb-8" :class="gridClass">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow " :class="clickable ? 'cursor-pointer' : ''"
      @click="handleCardClick(stat, index)"
    >
      <div class="flex items-center">
        <div class="p-3 rounded-lg" :class="getIconBgClass(stat.color)">
          <el-icon class="text-xl" :class="getIconClass(stat.color)">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="ml-4">
          <p class="text-2xl font-bold text-gray-900">
            {{ formatValue(stat.value) }}
          </p>
          <p class="text-sm text-gray-600">
            {{ stat.label }}
          </p>
          <p v-if="stat.change" class="text-xs mt-1" :class="getChangeClass(stat.change)">
            {{ formatChange(stat.change) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => []
  },
  columns: {
    type: [Number, Object],
    default: () => ({
      default: 1,
      md: 3,
      lg: 3,
      xl: 3
    })
  },
  showChange: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['card-click']);
const gridClass = computed(() => {
  if (typeof props.columns === 'number') {
    const colMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    return colMap[props.columns] || 'grid-cols-1 md:grid-cols-3';
  }
  
  const { default: def = 1, md = 3, lg = 3, xl = 3 } = props.columns;
  return `grid-cols-${def} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`;
});

const getIconBgClass = (color) => {
  const colorMap = {
    orange: 'bg-orange-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    pink: 'bg-pink-100',
    indigo: 'bg-indigo-100',
    gray: 'bg-gray-100'
  };
  return colorMap[color] || 'bg-blue-100';
};

const getIconClass = (color) => {
  const colorMap = {
    orange: 'text-orange-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600'
  };
  return colorMap[color] || 'text-blue-600';
};

const getChangeClass = (change) => {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
};

const formatValue = (value) => {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  }
  return value;
};

const formatChange = (change) => {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}%`;
};
const handleCardClick = (stat, index) => {
  if (props.clickable) {
    emit('card-click', { stat, index });
  }
};
</script>