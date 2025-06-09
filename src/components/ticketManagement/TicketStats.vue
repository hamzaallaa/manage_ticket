<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Component -->
    <TicketHeader 
      @create-ticket="handleCreateTicket"
    />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Section -->
      <div class="mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Dashboard Overview</h2>
        <TicketStats 
          :stats="ticketStats"
          :show-additional-stats="true"
          @filter-by-status="handleFilterByStatus"
          @card-click="handleStatsCardClick"
        />
      </div>

      <!-- Filters Section - Will be component 3 -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-20 flex items-center justify-center">
          <span class="text-gray-500">TicketFilters Component</span>
        </div>
      </div>

      <!-- Table Section - Will be component 4 -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 flex items-center justify-center">
          <span class="text-gray-500">TicketList Component</span>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <el-message 
      v-if="showSuccessMessage"
      message="Ticket created successfully!" 
      type="success" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TicketHeader from '@/components/TicketManagement/TicketHeader.vue'
import TicketStats from '@/components/TicketManagement/TicketStats.vue'

// Reactive data
const showSuccessMessage = ref(false)

// Sample stats data
const ticketStats = ref({
  open: 24,
  inProgress: 12,
  resolved: 156,
  avgResponseTime: '2.5h',
  highPriority: 8,
  overdue: 3
})

// Methods
const handleCreateTicket = () => {
  console.log('Create ticket button clicked!')
  // TODO: Open create ticket modal/form
  
  // Temporary success message for testing
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const handleFilterByStatus = (status) => {
  console.log('Filter by status:', status)
  // TODO: Apply filter to ticket list
}

const handleStatsCardClick = (status) => {
  console.log('Stats card clicked:', status)
  // TODO: Navigate to filtered view or trigger action
}

// Lifecycle hooks
// TODO: Load initial ticket data
</script>