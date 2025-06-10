<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="700px"
    class="!rounded-2xl"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div v-if="callData" class="space-y-6">
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ callData.subject }}</h3>
          <el-tag   
            :type="getStatusType(callData.status || callData.hasTicket)" 
            class="!rounded-full !px-3 !py-1 font-medium"
          >
            {{ getStatusText(callData.status || callData.hasTicket) }}
          </el-tag>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <el-icon class="text-blue-500"><User /></el-icon>
              <span class="font-medium">Agent:</span>
              <span>{{ getAgentName(callData.agent) }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <el-icon class="text-green-500"><Clock /></el-icon>
              <span class="font-medium">Duration:</span>
              <span>{{ formatDuration(callData.duration) }}</span>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <el-icon class="text-purple-500"><Calendar /></el-icon>
              <span class="font-medium">Date:</span>
              <span>{{ formatDate(callData.time) }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <el-icon class="text-orange-500"><Timer /></el-icon>
              <span class="font-medium">Time:</span>
              <span>{{ formatTime(callData.time) }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="callData.callType" class="mt-4">
          <div class="flex items-center gap-2">
            <el-icon class="text-indigo-500"><Phone /></el-icon>
            <span class="font-medium">Call Type:</span>
            <span>{{ callData.callType }}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 class="font-semibold text-gray-900 mb-3">Call Description</h4>
        <p class="text-gray-700 bg-gray-50 rounded-lg p-4">
          {{ callData.description || 'No description provided.' }}
        </p>
      </div>
      
      <div v-if="showActions" class="flex gap-3">
        <el-button 
          v-if="showCreateTicket"
          type="primary" 
          class="!bg-gradient-to-r !from-green-500 !to-green-600 !border-0"
          @click="$emit('create-ticket', callData)"
        >
          <el-icon class="mr-2"><Ticket /></el-icon>
          {{ createTicketText }}
        </el-button>
        
        <el-button 
          v-if="showEdit"
          type="warning"
          @click="$emit('edit', callData)"
        >
          <el-icon class="mr-2"><Edit /></el-icon>
          {{ editText }}
        </el-button>
        
        <el-button 
          v-if="showDelete"
          type="danger"
          @click="$emit('delete', callData)"
        >
          <el-icon class="mr-2"><Delete /></el-icon>
          {{ deleteText }}
        </el-button>
        
        <!-- Custom action slots -->
        <slot name="actions" :call="callData" />
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p class="text-gray-500">No call data available</p>
    </div>
  </el-dialog>
</template>

<script setup>
import { User, Clock, Calendar, Timer, Phone, Ticket, Edit, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  callData: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Call Details'
  },
  
  showActions: {
    type: Boolean,
    default: true
  },
  showCreateTicket: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },

  createTicketText: {
    type: String,
    default: 'Create Ticket'
  },
  editText: {
    type: String,
    default: 'Edit Call'
  },
  deleteText: {
    type: String,
    default: 'Delete Call'
  },
  
  dateFormatter: {
    type: Function,
    default: null
  },
  timeFormatter: {
    type: Function,
    default: null
  },
  durationFormatter: {
    type: Function,
    default: null
  }
})

const emit = defineEmits([
  'update:visible',
  'create-ticket',
  'edit',
  'delete'
])

const getAgentName = (agent) => {
  if (typeof agent === 'string') return agent
  if (typeof agent === 'object' && agent?.name) return agent.name
  return 'Unknown Agent'
}

const getStatusType = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'warning' : 'success'
  }
  
  const statusMap = {
    'resolved': 'success',
    'pending': 'warning',
    'open': 'danger',
    'closed': 'info',
    'in_progress': 'warning'
  }
  
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'Has Ticket' : 'Resolved'
  }
  
  const statusTextMap = {
    'resolved': 'Resolved',
    'pending': 'Pending',
    'open': 'Open',
    'closed': 'Closed',
    'in_progress': 'In Progress'
  }
  
  return statusTextMap[status] || status
}

const formatDate = (dateTime) => {
  if (props.dateFormatter) return props.dateFormatter(dateTime)
  
  if (!dateTime) return 'N/A'
  return new Date(dateTime).toLocaleDateString()
}

const formatTime = (dateTime) => {
  if (props.timeFormatter) return props.timeFormatter(dateTime)
  
  if (!dateTime) return 'N/A'
  return new Date(dateTime).toLocaleTimeString()
}

const formatDuration = (duration) => {
  if (props.durationFormatter) return props.durationFormatter(duration)
  
  if (!duration) return 'N/A'
  
  if (typeof duration === 'string') return duration
  
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
</script>