<template>
  <el-dialog
    :model-value="visible" 
    :title="isEditing ? 'Edit Call Log' : 'Create New Call Log'"
    width="600px"
    :before-close="handleClose"
    class="!rounded-2xl"
    @update:model-value="$emit('update:visible', $event)"
  > 
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Agent * </label>
          <el-select
            v-model="form.agent"
            placeholder="Select an agent"
            size="large"
            class="!w-full"
            :disabled="isEditing"
          >
            <el-option 
              v-for="agent in agents"
              :key="agent._id"
              :label="agent.name" 
              :value="agent._id" 
            />
          </el-select>
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Call Date & Time *</label>
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="Select call time"
            size="large"
            class="!w-full"
            format="YYYY/MM/DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes) *</label>
          <el-input-number
            v-model="form.duration"
            :min="1"
            :max="999"
            size="large"
            class="!w-full"
            placeholder="Enter duration"
          />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Call Type</label>
          <el-select
            v-model="form.callType"
            placeholder="Select call type"
            size="large"
            class="!w-full"
          >
            <el-option 
              v-for="type in callTypes"
              :key="type.value"
              :label="type.label" 
              :value="type.value" 
            />
          </el-select>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
        <el-input
          v-model="form.subject"
          placeholder="Enter call subject"
          size="large"
          maxlength="100"
          show-word-limit
        />
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="Enter detailed description of the call..."
          maxlength="500"
          show-word-limit
        />
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <el-icon class="text-blue-500 mt-1">
            <InfoFilled />
          </el-icon>
          <div>
            <p class="text-sm font-medium text-blue-900">Need to create a ticket?</p>
            <p class="text-sm text-blue-700 mt-1">If this call requires follow-up, you can create a ticket after saving the call log.</p>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex gap-3">
        <el-button 
          size="large" 
          class="!px-6" 
          @click="handleCancel"
        >
          Cancel
        </el-button>
        <el-button 
          type="primary" 
          size="large" 
          class="!bg-gradient-to-r !from-blue-500 !to-indigo-600 !border-0 !px-8" 
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEditing ? 'Update Call' : 'Create Call' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  agents: {
    type: Array,
    default: () => []
  },
  callTypes: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'create', 'update', 'cancel'])

const form = ref({
  agent: '',
  time: '',
  duration: null,
  callType: '',
  subject: '',
  description: ''
})

watch(() => props.data, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    form.value = { ...newData }
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

watch(() => props.visible, (visible) => {
  if (!visible && !props.isEditing) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    agent: '',
    time: '',
    duration: null,
    callType: '',
    subject: '',
    description: ''
  }
}

const handleSubmit = () => {
  if (props.isEditing) {
    emit('update', { ...form.value })
  } else {
    emit('create', { ...form.value })
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleClose = (done) => {
  emit('cancel')
  done()
}
</script>