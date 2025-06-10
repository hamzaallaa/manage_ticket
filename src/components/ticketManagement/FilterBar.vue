<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="flex-1 max-w-md">
        <el-input
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          :placeholder="searchPlaceholder"
          size="large"
          clearable
          class="w-full"
        >
          <template #prefix>
            <el-icon>
              <component :is="searchIcon" />
            </el-icon>
          </template>
        </el-input>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <template v-for="filter in selectFilters" :key="filter.key">
          <el-select
            :model-value="filterValues[filter.key]"
            @update:model-value="handleFilterChange(filter.key, $event)"
            :placeholder="filter.placeholder"
            size="large"
            clearable
            :class="filter.width || 'w-40'"
          >
            <el-option
              v-for="option in filter.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </template>

        <el-date-picker
          v-if="showDateRange"
          :model-value="dateRangeValue"
          @update:model-value="$emit('update:dateRange', $event)"
          type="daterange"
          range-separator="To"
          :start-placeholder="dateStartPlaceholder"
          :end-placeholder="dateEndPlaceholder"
          size="large"
          class="w-64"
        />

        <slot name="custom-filters"></slot>
        <template v-for="action in actions" :key="action.key">
          <el-tooltip v-if="action.tooltip" :content="action.tooltip" placement="top">
            <el-button
              :type="action.type || 'default'"
              :size="action.size || 'large'"
              :class="action.class || '!px-4'"
              @click="$emit('action-click', action.key)"
            >
              <el-icon v-if="action.icon">
                <component :is="action.icon" />
              </el-icon>
              <span v-if="action.text" :class="action.icon ? 'ml-2' : ''">
                {{ action.text }}
              </span>
            </el-button>
          </el-tooltip>
          <el-button
            v-else
            :type="action.type || 'default'"
            :size="action.size || 'large'"
            :class="action.class || '!px-4'"
            @click="$emit('action-click', action.key)"
          >
            <el-icon v-if="action.icon">
              <component :is="action.icon" />
            </el-icon>
            <span v-if="action.text" :class="action.icon ? 'ml-2' : ''">
              {{ action.text }}
            </span>
          </el-button>
        </template>
        <el-tooltip v-if="showRefresh" content="Refresh" placement="top">
          <el-button
            size="large"
            class="!px-4"
            @click="$emit('refresh')"
          >
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
const props = defineProps({
  search: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  searchIcon: {
    type: [String, Object],
    default: () => Search
  },
  selectFilters: {
    type: Array,
    default: () => []
  },
  filterValues: {
    type: Object,
    default: () => ({})
  },
  
  showDateRange: {
    type: Boolean,
    default: true
  },
  dateRangeValue: {
    type: Array,
    default: () => []
  },
  dateStartPlaceholder: {
    type: String,
    default: 'Start date'
  },
  dateEndPlaceholder: {
    type: String,
    default: 'End date'
  },
  
  actions: {
    type: Array,
    default: () => []
  },
  showRefresh: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  'update:search',
  'update:dateRange',
  'filter-change',
  'action-click',
  'refresh'
]);

const handleFilterChange = (key, value) => {
  emit('filter-change', { key, value });
};
</script>