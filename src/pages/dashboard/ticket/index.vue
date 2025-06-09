<template>
  <div class="min-h-screen bg-gray-50">
    <TicketHeader
      title="Ticket Management"
      subtitle="Manage and track customer support tickets"
      :icon="Tickets"
      icon-color="blue"
      action-text="Create New Ticket"
      :action-icon="Plus"
      @action-click=" ticketDialogVisible = true"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <state :stats="ticketStats" :columns="3" :clickable="false" />
       <FilterBar
        v-model:search="searchQuery"
        v-model:date-range="dateRange"
        search-placeholder="Search tickets by issue or ID..."
        :select-filters="ticketFilters"
        :filter-values="filterValues"
        :actions="filterActions"
        @filter-change="handleFilterChange"
        @action-click="handleActionClick"
        @refresh="refreshData"
        @update:search="_fSearchQuery"
      />

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Recent Tickets</h2>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500"  >Showing 1-20 of 1,247 tickets</span >
              <el-button-group>
                <el-button size="small" class="!rounded-l-lg">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <el-button size="small" class="!rounded-r-lg">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <div >
          <el-table :data="ticketsData"  class="w-full"  :header-cell-style="{    background: '#f8fafc',    color: '#374151',    fontWeight: '600',    fontSize: '14px',    padding: '10px',  }"  :cell-style="{ padding: '8px' }" stripe  >
            <el-table-column type="selection" width="55" />
            <el-table-column label="Ticket ID" width="120">
              <template #default="scope">
                <span  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">  #{{ scope.row.ticketId }}  </span>
              </template>
            </el-table-column>
  
            <el-table-column label="Issue" min-width="250">
              <template #default="scope">
                <div class="max-w-xs">
                  <p class="font-medium text-gray-900 truncate">  {{ scope.row.issue }}  </p>
                  <p class="text-sm text-gray-500 truncate mt-1">   Call #{{ scope.row.callId.callId }} • {{ scope.row?.callId?.duration }}min  </p>
                </div>
              </template>
            </el-table-column>
  
            <el-table-column label="Status" width="130">
              <template #default="scope">
                <el-tag   :type="     scope.row.status === 'open'       ? 'danger'       : scope.row.status === 'in_progress'       ? 'warning'       : 'success'   "   class="!rounded-full !px-3 !py-1 font-medium" >
                  {{
                    scope.row.status === "in_progress"
                      ? "In Progress"
                      : scope.row.status.charAt(0).toUpperCase() +
                        scope.row.status.slice(1)
                  }}
                </el-tag>
              </template>
            </el-table-column>
  
            <el-table-column label="Created By" width="180">
              <template #default="scope">
                <div class="flex items-center gap-3">
                  <div     class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center"  >
                    <span class="text-xs font-medium text-gray-700">
                      {{ scope.row.createdBy?.name?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ scope.row.createdBy?.name }}
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
  
            <el-table-column label="Priority" width="120">
              <template #default="scope">
                <el-tag  :type="    scope.row.priority === 'High'      ? 'danger'      : scope.row.priority === 'Medium'      ? 'warning'      : 'success'  "  class="!rounded-full !px-3 !py-1 font-medium"  >
                  {{ scope.row.priority }}
                </el-tag>
              </template>
            </el-table-column>
  
            <el-table-column label="Created" width="180">
              <template #default="scope">
                <div class="flex items-center gap-2">
                  <p class="font-medium text-gray-900">
                    {{ formatDate(scope.row.createdAt) }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatTime(scope.row.createdAt) }}
                  </p>
                </div>
              </template>
            </el-table-column>
  
            <el-table-column label="Comments" width="100" align="center">
              <template #default="scope">
                <el-tag type="info" class="!rounded-full !px-3 !py-1 font-medium">
                  {{ scope.row.comments?.length||0 }}
                </el-tag>
              </template>
            </el-table-column>
  
            <el-table-column label="Actions" width="190" fixed="right">
              <template #default="scope">
                <div class="flex items-center gap-2">
                  <el-tooltip content="View Details" placement="top">
                    <el-button  size="small"  type="primary"  :icon="View"  circle  class="!w-8 !h-8"  @click="viewTicket(scope.row)"  />
                  </el-tooltip>
  
                  <el-tooltip content="Edit Ticket" placement="top">
                    <el-button   size="small"   type="warning"   :icon="Edit"   circle   class="!w-8 !h-8"   @click="editTicket(scope.row)"   />
                  </el-tooltip>
  
                  <el-tooltip content="Add Comment" placement="top">
                    <el-button  size="small"  type="success"  :icon="ChatDotRound"  circle  class="!w-8 !h-8"  @click="addComment(scope.row)"/>
                  </el-tooltip>
  
                  <el-tooltip content="Delete Ticket" placement="top">
                    <el-button   size="small"   type="danger"   :icon="Delete"   circle   class="!w-8 !h-8"   @click="deleteTicket(scope.row)" />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="p-6 border-t border-gray-100 flex justify-center">
          <el-pagination  v-model:current-page="currentPage"  v-model:page-size="pageSize"  :page-sizes="[10, 20, 50, 100]"  layout="total, sizes, prev, pager, next, jumper"  class="!flex !flex-wrap !justify-center !gap-2" />
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to
          <span class="font-medium">10</span> of{' '}
          <span class="font-medium">97</span> results
        </div>
        <el-pagination  v-model:current-page="currentPage"  :page-size="pageSize"  :total="totalItems"  layout="prev, pager, next, jumper"  class="!justify-end"  />
      </div>
    </div>

    <el-dialog  v-model="ticketDialogVisible"  title="Create New Ticket"  width="600px"  class="!rounded-lg" >
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"  >Issue Title</label >
          <el-input   v-model="ticketForm.issue"   placeholder="Enter issue title..."   size="large" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"  >Priority</label >
          <el-select  v-model="ticketForm.priority"  placeholder="Select priority"  size="large"  class="w-full"   >
            <el-option label="Low" value="Low" />
            <el-option label="Medium" value="Medium" />
            <el-option label="High" value="High" />
          </el-select>
        </div>
        <div> 
          <label class="block text-sm font-medium text-gray-700 mb-2"  >Related Call</label  >
          <el-select   v-model="ticketForm.callId"   placeholder="Select related call"   size="large"   class="w-full" >
            <el-option v-for="el in callLogs" :key="el._id" :label="'Call #'+el.callId +'-' + el.callType" :value="el._id" />
          </el-select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"  >Description</label  >
          <el-input   v-model="ticketForm.description"   type="textarea"   placeholder="Describe the issue in detail..."   :rows="4"   size="large"  />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <el-button @click="ticketDialogVisible = false" size="large"  >Cancel</el-button >
          <el-button @click="createTicket()" type="primary" size="large">Create Ticket</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog   v-model="viewDialogVisible"   title="Ticket Details"   width="700px"   class="!rounded-lg" >
      <div v-if="selectedTicket" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"   >Ticket ID</label  >
            <div class="text-lg font-semibold text-gray-900">
              #{{ selectedTicket.ticketId }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"  >Status</label  >
            <el-tag  :type="getStatusColor(selectedTicket.status)"  class="!rounded-full !px-3 !py-1 font-medium"  >
              {{
                selectedTicket.status === "in_progress"
                  ? "In Progress"
                  : selectedTicket.status.charAt(0).toUpperCase() +
                    selectedTicket.status.slice(1)
              }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"  >Priority</label  >
            <el-tag   :type="getPriorityColor(selectedTicket.priority)"   class="!rounded-full !px-3 !py-1 font-medium" >
              {{ selectedTicket.priority }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" >Created By</label >
            <div class="text-gray-900">{{ selectedTicket.createdBy.name }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"  >Created Date</label >
            <div class="text-gray-900">
              {{ formatDate(selectedTicket.createdAt) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"   >Comments</label >
            <div class="text-gray-900">
              {{ selectedTicket.comments.length||0 }} comments
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"   >Issue Title</label  >
          <div class="text-gray-900 font-medium">
            {{ selectedTicket.issue }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Related Call</label
          >
          <div class="text-gray-900">
            Call #{{ selectedTicket.callId.callId }} • {{ selectedTicket.callId.duration }}min
          </div>
        </div>

        <div v-if="selectedTicket.description">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <div class="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {{ selectedTicket.description }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <div class="flex space-x-3">
            <el-button type="warning" @click="editTicket(selectedTicket)">
              <el-icon class="mr-1"><Edit /></el-icon>
              Edit
            </el-button>
            <el-button type="success" @click="addComment(selectedTicket)">
              <el-icon class="mr-1"><ChatDotRound /></el-icon>
              Add Comment
            </el-button>
          </div>
          <el-button @click="viewDialogVisible = false">Close</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog  v-model="editDialogVisible"  title="Edit Ticket"  width="600px"  class="!rounded-lg"  > 
     <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"  >Issue Title</label  >
          <el-input   v-model="editForm.issue"   placeholder="Enter issue title..."   size="large" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"  >Priority</label   >
            <el-select  v-model="editForm.priority"  placeholder="Select priority"  size="large"  class="w-full" >
              <el-option label="Low" value="Low" />
              <el-option label="Medium" value="Medium" />
              <el-option label="High" value="High" />
            </el-select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"  >Status</label  >
            <el-select  v-model="editForm.status"  placeholder="Select status"  size="large"  class="w-full" >
              <el-option label="Open" value="open" />
              <el-option label="In Progress" value="in_progress" />
              <el-option label="Resolved" value="resolved" />
            </el-select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"   >Related Call</label  >
          <el-select     v-model="editForm.callId"     placeholder="Select related call"     size="large"     class="w-full"   >
            <el-option label="Call #1234 - Technical Support" value="1234" />
            <el-option label="Call #1235 - Billing Issue" value="1235" />
            <el-option label="Call #1236 - Product Inquiry" value="1236" />
          </el-select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"  >Description</label  >
          <el-input v-model="editForm.description" type="textarea" placeholder="Describe the issue in detail..." :rows="4" size="large" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <el-button @click="editDialogVisible = false" size="large" >Cancel</el-button  >
          <el-button type="primary" @click="updateTicket" size="large"  >Update Ticket</el-button  >
        </div>
      </template>
    </el-dialog>

    <el-dialog   v-model="commentDialogVisible"   title="Add Comment"   width="500px"   class="!rounded-lg" >
      <div v-if="selectedTicket" class="space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">Adding comment to:</div>
          <div class="font-medium text-gray-900">
            #{{ selectedTicket.id }} - {{ selectedTicket.issue }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"   >Comment</label >
          <el-input   v-model="commentForm.message"   type="textarea"   placeholder="Enter your comment..."   :rows="5"   size="large"   maxlength="500"   show-word-limit />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <el-button @click="commentDialogVisible = false" size="large"  >Cancel</el-button  >
          <el-button type="primary" @click="submitComment" size="large" >Add Comment</el-button  >
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted,getCurrentInstance ,markRaw} from "vue";
import TicketHeader from "@/components/ticketManagement/TicketHeader.vue";
import State from "@/components/ticketManagement/State.vue";
import FilterBar from "@/components/ticketManagement/FilterBar.vue";
const { proxy } = getCurrentInstance();

import {
  Plus,
  Search,
  Refresh,
  Download,
  Filter ,
  Clock,
  Loading,
  CircleCheck,
  View,
  Edit,
  Delete,
  ChatDotRound,
  Tickets,
  ArrowLeft,
  ArrowRight, 
} from "@element-plus/icons-vue";
const searchQuery = ref("");
const statusFilter = ref("");
const dateRange = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const agentOptions = ref([]);
const totalItems = ref(97);
const ticketDialogVisible = ref(false);
const viewDialogVisible = ref(false);
const editDialogVisible = ref(false);
const commentDialogVisible = ref(false);
const selectedTicket = ref(null);
const ticketsData = ref([
]);
const tickets = ref(null);
const callLogs = ref([]);

const editForm = reactive({
  _id: "",
  id: "",
  issue: "",
  priority: "",
  agent: "",
  createdBy: "",
  status: "",
  callId: "",
  description: "",
});
const filterValues = reactive({
  status: '',
  priority: '',
  assignee: ''
});

const ticketFilters = ref([
  {
    key: 'status',
    placeholder: 'Filter by Status',
    width: 'w-40',
    options: [
      { label: 'Open', value: 'open' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Resolved', value: 'resolved' }
    ]
  },
  {
    key: 'priority',
    placeholder: 'Filter by Priority',
    width: 'w-40',
    options: [
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' }
    ]
  },
  {
    key: 'assignee',
    placeholder: 'Filter by Assignee',
    width: 'w-48',
    options: [
      { label: 'John Smith', value: 'john' },
      { label: 'Sarah Johnson', value: 'sarah' },
      { label: 'Mike Davis', value: 'mike' }
    ]
  }
]);

const filterActions = [
  {
    key: 'export',
    icon: Download,
    text: 'Export',
    type: 'success',
    tooltip: 'Export filtered results'
  },
  {
    key: 'advanced',
    icon: Filter,
    text: 'Advanced',
    type: 'primary',
    tooltip: 'Advanced filtering options'
  }
];

const _fSearchQuery = () => {
  if (searchQuery.value.trim() === "") {
    ticketsData.value = tickets.value;
  } else {
    ticketsData.value = tickets.value.filter(ticket =>
      ticket.issue.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.ticketId.toString().includes(searchQuery.value)
    );
  }
};

// Event handlers
const handleFilterChange = ({ key, value }) => {
  filterValues[key] = value;
  console.log(`Filter changed: ${key} = ${value}`);
  if(!value) {
    ticketsData.value = tickets.value; 
    return;
  }
  switch (key) {
    case 'status':
      ticketsData.value = tickets.value.filter(ticket => ticket.status?.toLowerCase() === value?.toLowerCase());
      break;
    case 'priority':
      ticketsData.value = tickets.value.filter(ticket => ticket.priority?.toLowerCase() === value?.toLowerCase());
      break;
    case 'assignee':
      ticketsData.value = tickets.value.filter(ticket => ticket.assignee?.toLowerCase() === value?.toLowerCase());
      break;
  }
};

const handleActionClick = (actionKey) => {
  switch (actionKey) {
    case 'export':
      exportData();
      break;
    case 'advanced':
      openAdvancedFilters();
      break;
  }
};

const refreshData = () => {
  console.log('Refreshing data...');
};

const exportData = () => {
  console.log('Exporting data...');
};

const openAdvancedFilters = () => {
  console.log('Opening advanced filters...');
};

const ticketStats = reactive([
  {
    icon: markRaw(Clock),
    color: 'orange',
    value: 24,
    label: 'Open Tickets',
    change: 12 
  },
  {
    icon:markRaw(Loading) ,
    color: 'blue',
    value: 12,
    label: 'In Progress',
    change: -5 
  },
  {
    icon:markRaw(CircleCheck) ,
    color: 'green',
    value: 156,
    label: 'Resolved',
    change: 8 
  }
]);

const commentForm = reactive({
  ticketId: "",
  message: "",
  author: "",
});

const viewTicket = (ticket) => {
  selectedTicket.value = { ...ticket };
  viewDialogVisible.value = true;
};

const editTicket = (ticket) => {
  // Populate edit form with current ticket data
  console.log("Editing ticket:", ticket);
  editForm._id = ticket._id;
  editForm.id = ticket._id;
  editForm.issue = ticket.issue;
  editForm.priority = ticket.priority;
  editForm.createdBy = ticket.createdBy._id;
  editForm.status = ticket.status;
  editForm.callId = ticket.callId;
  editForm.agent = ticket.callId.agent._id;
  editForm.description = ticket.description || "";

  selectedTicket.value = { ...ticket };
  editDialogVisible.value = true;
  console.log("Editing ticketssssssss:", editForm);
};
const updateTicket = async () => {
  try {
    console.log("Updating ticket:", editForm);
    const sanitizededitForm = Object.fromEntries(
      Object.entries(editForm).filter(([_, value]) => value !== undefined)
    );
    sanitizededitForm.callId= sanitizededitForm.callId._id ;
    await proxy.$server.update("Tickets",sanitizededitForm);
    editDialogVisible.value = false;
    Object.keys(editForm).forEach((key) => {
      editForm[key] = "";
    });
    await fetchTickets(); 
  } catch (error) {
    ElMessage.error("Failed to update ticket");
    console.error("Update error:", error);
  }
};

const addComment = (ticket) => {
  commentForm.ticketId = ticket.id;
  commentForm.message = "";
  commentForm.author = "Current User"; 
  selectedTicket.value = { ...ticket };
  commentDialogVisible.value = true;
};

const submitComment = async () => {
  try {
    commentDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("Failed to add comment");
    console.error("Comment error:", error);
  }
};

const deleteTicket = (ticket) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete ticket #${ticket.id}? This action cannot be undone.`,
    "Delete Ticket",
    {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
      confirmButtonClass: "el-button--danger",
    }
  )
    .then(async () => {
      try {
     
      } catch (error) {
        ElMessage.error("Failed to delete ticket");
        console.error("Delete error:", error);
      }
    })
    .catch(() => {
    });
};

const createTicket = async () => {
  try {
    if (!ticketForm.issue.trim()) {
      ElMessage.warning("Please enter an issue title");
      return;
    }
    if (!ticketForm.description.trim()) {
      ElMessage.warning("Please enter an description");
      return;
    }
    const newTicket = {
      issue: ticketForm.issue,
      status: "open",
      callId: ticketForm.callId || "",
      priority: ticketForm.priority || "Medium",
      description: ticketForm.description,
    };

    ElMessage.success("Ticket created successfully");
    ticketDialogVisible.value = false;
    await proxy.$server.create("Tickets", newTicket);
    // Reset form
    Object.keys(ticketForm).forEach((key) => {
      ticketForm[key] = "";
    });
    await fetchTickets(); 
  } catch (error) {
    ElMessage.error("Failed to create ticket");
    console.error("Create error:", error);
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "danger";
    case "in_progress":
      return "warning";
    case "resolved":
      return "success";
    default:
      return "info";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "info";
  }
};

const ticketForm = reactive({
  issue: "",
  priority: "",
  callId: "",
  description: "",
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};


onMounted(async () => {
  console.log("Ticket Management component mounted");
 await fetchTickets();
 await getCalls();
   let agents = (await getAgents());

   console.log("Agents fetched:", ticketFilters.value);
   ticketFilters.value[2].options = agents.map(agent => ({
     label: agent.name,
     value: agent._id
   }));
   

});

const getAgents=async()=>{
  try {
    return( await proxy.$server.search("users", {
      role: "agent",
      only:["name","email","_id"]
    }))?.results || [];
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
}


const fetchTickets = async () => {
  try {
     tickets.value = await getTicketData();
     console.log("Fetched tickets:", tickets);
    if (tickets && Array.isArray(tickets.value)) {
      ticketsData.value = tickets.value.map(ticket => ({
        ...ticket,
        createdAt: new Date(ticket.createdAt).toISOString(),
      }));
    } else {
      console.warn("No tickets found or data format is incorrect");
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    
  }
};
const getTicketData=async()=>{
  try {
    return (await proxy.$server.search("Tickets"))?.results || [];
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    
  }
}

const getCalls = async () => {
  try {
    const calls = (await proxy.$server.search("CallLog"))?.results;
    if (calls && Array.isArray(calls)) {
      callLogs.value = calls;
    } else {
      console.warn("No call logs found or data format is incorrect");
    }
  } catch (error) {
    console.error("Error fetching call logs:", error);
  }
};
</script>
