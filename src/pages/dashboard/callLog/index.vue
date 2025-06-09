<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6" >
          <div class="flex items-center gap-4">
            <div  class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <el-icon class="text-white text-2xl">  <Phone />  </el-icon>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">  Call Logs Management  </h1>
              <p class="text-gray-600 mt-1"> Track and manage all customer calls </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <el-button  type="primary"  size="large"  class="!bg-gradient-to-r !from-blue-500 !to-indigo-600 !border-0 !px-8 !py-3 !rounded-xl hover:!shadow-lg transition-all duration-300" @click="showCreateDialog = true"> <el-icon class="mr-2">  <Plus />  </el-icon>  Log New Call  </el-button>
            <el-button size="large" class="!border-2 !border-gray-300 !text-gray-700 !px-6 !py-3 !rounded-xl hover:!border-blue-500 hover:!text-blue-500 transition-all duration-300" @click="exportData" >   <el-icon class="mr-2"> <Download /> </el-icon>  Export  </el-button>
          </div>
        </div>
      </div>


      <StatsCard v-if="statsData" :stats="statsData" />

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"  >Search Calls</label >
            <el-input   v-model="searchQuery"   placeholder="Search by subject or agent..."   size="large"   class="!rounded-xl"   clearable @change="_fsearchQuery()" >
              <template #prefix>
                <el-icon class="text-gray-400">  <Search /> </el-icon>
              </template>
            </el-input>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2" >Date Range</label  >
            <el-date-picker   v-model="dateRange"   type="daterange"   size="large"   class="!w-full !rounded-xl"   range-separator="To"   start-placeholder="Start date"   end-placeholder="End date"   format="YYYY/MM/DD"   value-format="YYYY-MM-DD" @change="_fsearchQueryDate"  />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"  >Agent</label>
            <el-select v-model="selectedAgent" placeholder="Select Agent" size="large" class="!w-full !rounded-xl" clearable  @change="_fsearchQueryByAgent"  >
              <el-option v-for="el in  agentOptions" :key="el._id" :label="el.name" :value="el._id" />
            </el-select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"  >Duration</label  >
            <el-select  v-model="durationFilter"  placeholder="Filter by duration"  size="large"  class="!w-full !rounded-xl"  clearable @change="_fsearchQueryByDuration">
              <el-option label="< 5 minutes" value="short"  />
              <el-option label="5-15 minutes" value="medium" />
              <el-option label="> 15 minutes" value="long" />
            </el-select>
          </div>
        </div>
      </div>


      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Recent Call Logs</h2>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500" >Showing 1-20 of 1,247 calls</span >
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

        <el-table  :data="callLogs"  class="w-full"  :header-cell-style="{    background: '#f8fafc',    color: '#374151',    fontWeight: '600',    fontSize: '14px',    padding: '16px',  }" :cell-style="{ padding: '8px' }" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column label="call ID" width="120">
              <template #default="scope">
                <span  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">  #{{ scope.row.callId }}  </span>
              </template>
            </el-table-column>
          <el-table-column label="Agent" width="180">
            <template #default="scope">
              <div class="flex items-center gap-3">
                <div>
                  <p class="font-semibold text-gray-900"> {{ scope.row.agent.name }} </p>
                  <p class="text-sm text-gray-500">  {{ scope.row.agent.email }} </p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Call Time" width="180">
            <template #default="scope">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-900">  {{ formatDate(scope.row.time) }}  </p>
                <p class="text-sm text-gray-500">   {{ formatTime(scope.row.time) }} </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Duration" width="120">
            <template #default="scope">
              <el-tag :type="getDurationTagType(scope.row.duration)" class="!rounded-full !px-3 !py-1 font-medium" >   {{ formatDuration(scope.row.duration) }} </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="Subject" min-width="200">
            <template #default="scope">
              <div class="max-w-xs">
                <p class="font-medium text-gray-900 truncate">  {{ scope.row.subject }}   </p>
                <p class="text-sm text-gray-500 truncate mt-1">   {{ scope.row.description }}   </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="120">
            <template #default="scope">
              <el-tag  :type="scope.row.hasTicket ? 'warning' : 'success'" class="!rounded-full !px-3 !py-1 font-medium"  >
                {{ scope.row.hasTicket ? "Has Ticket" : "Resolved" }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="Actions" width="140" fixed="right">
            <template #default="scope">
              <div class="flex items-center gap-2">
                <el-tooltip content="View Details" placement="top">
                  <el-button  size="small"  type="primary"  :icon="View"  circle  class="!w-8 !h-8"  @click="viewCall(scope.row)"  />
                </el-tooltip>

                <el-tooltip content="Edit Call" placement="top">
                  <el-button size="small" type="warning" :icon="Edit" circle class="!w-8 !h-8"  @click="editCall(scope.row)" />
                </el-tooltip>

                <el-tooltip content="Delete Call" placement="top">
                  <el-button size="small" type="danger" :icon="Delete" circle class="!w-8 !h-8"  @click="deleteCall(scope.row)" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="p-6 border-t border-gray-100 flex justify-center">
          <el-pagination  v-model:current-page="currentPage"  v-model:page-size="pageSize"  :page-sizes="[10, 20, 50, 100]"  :total="totalCalls"  layout="total, sizes, prev, pager, next, jumper"  class="!flex !flex-wrap !justify-center !gap-2"  />
        </div>
      </div>

    </div>


    <CallFormDialog
      v-model:visible="showCreateDialog"
      :data="callForm"
      :isEditing="isEditing"
      :agents="agentOptions"
      :call-types="callTypeOptions"
      @create="saveCall"
      @update="editCallFromView"
      @cancel="handleDialogClose"
    />
    <CallViewDialog
      v-model:visible="showViewDialog"
      :call-data="selectedCall"
      title="Call Details"
      :show-create-ticket="true"
      :show-edit="true"
      :show-delete="false"
      @create-ticket="createTicketFromCall"
      @edit="editCall"
      @delete="deleteCall"
    />
  </div>
</template>

<script setup>
import StatsCard from "@/components/callLogsManagement/state.vue";
import CallFormDialog from "@/components/callLogsManagement/CallFormDialog.vue";
import CallViewDialog from "@/components/callLogsManagement/CallViewDialog.vue";

import { ref, reactive, onMounted, getCurrentInstance ,} from "vue";
import {
  Phone,
  Plus,
  Download,
  Search,
  Calendar,
  Timer,
  User,
  Clock,
  ArrowLeft,
  ArrowRight,
  View,
  Edit,
  Delete,
  InfoFilled,
  Ticket,
} from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();
const searchQuery = ref("");
const dateRange = ref([]);
const selectedAgent = ref("");
const durationFilter = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const totalCalls = ref(1247);

const agentOptions = ref([]);

const callTypeOptions = ref([
  {
    label: "Inbound",
    value: "inbound",
    icon: "phone-incoming",
  },
  {
    label: "Outbound",
    value: "outbound",
    icon: "phone-outgoing",
  },
  {
    label: "Follow-up",
    value: "followup",
    icon: "phone-callback",
  },
  {
    label: "Cold Call",
    value: "cold_call",
    icon: "phone-cold",
  },
  {
    label: "Support",
    value: "support",
    icon: "headset",
  },
  {
    label: "Sales",
    value: "sales",
    icon: "trending-up",
  },
  {
    label: "Complaint",
    value: "complaint",
    icon: "alert-triangle",
  },
  {
    label: "Emergency",
    value: "emergency",
    icon: "alert-circle",
  },
  {
    label: "Conference",
    value: "conference",
    icon: "users",
  },
  {
    label: "Training",
    value: "training",
    icon: "book-open",
  },
]);
const showCreateDialog = ref(false);
const showViewDialog = ref(false);
const isEditing = ref(null);
const selectedCall = ref(null);

const callForm = reactive({
  agent: "",
  time: "",
  duration: null,
  callType: "",
  subject: "",
  description: "",
});

let callLogs = ref([
]);

let callLogsData = ref({});

const viewCall = (call) => {
  selectedCall.value = call;
  showViewDialog.value = true;
};

const editCall = async(call) => {
  isEditing.value = true;
  showViewDialog.value = false;
  console.log("Editing call:", call);
  Object.assign(callForm, {
    agent: call?.agent?._id,
    time: call.time,
    duration: Math.floor(call.duration / 60),
    callType: call.callType,
    subject: call.subject,
    _id: call._id,
    id: call._id,
    description: call.description,
  });
  showCreateDialog.value = true;
};

const updateCall = async (callInfo) => {
  try {
    const sanitizedCallInfo = Object.fromEntries(
      Object.entries(callInfo).filter(([_, value]) => value !== undefined)
    );

    console.log("Updating call:", sanitizedCallInfo);
    await proxy.$server.update("CallLog",sanitizedCallInfo);
    resetForm();
  } catch (error) {
    console.error("Error updating call:", error);
  }
};

const deleteCall = (call) => {
  console.log("Deleting call:", call.id);
};

const _fsearchQuery = () => {
  if (searchQuery.value.trim() === "") {
    callLogs.value = callLogsData.value.results;
  } else {
    callLogs.value = callLogsData.value.results.filter((call) =>
      call.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      call.agent.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
};
const _fsearchQueryByAgent = () => {
try {
    console.log("Selected agent changed:", selectedAgent.value);
  if (!selectedAgent.value) {
    callLogs.value = callLogsData.value.results;
    return;
  }

  callLogs.value = callLogsData.value.results.filter(
    (call) => call.agent._id === selectedAgent.value
  );
} catch (error) {
  console.error("Error filtering by agent:", error);
  callLogs.value = callLogsData.value.results; 
}
};
const _fsearchQueryDate = () => {
try {
    const [start, end] = dateRange.value || [];

  console.log("Date range changed:", start, end);

  if (!start || !end) {
    callLogs.value = callLogsData.value.results;
    return;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  callLogs.value = callLogsData.value.results.filter((call) => {
    const callDate = new Date(call.time);
    return callDate >= startDate && callDate <= endDate;
  });
} catch (error) {
  console.error("Error filtering by date:", error);
  callLogs.value = callLogsData.value.results; 
}
};

const _fsearchQueryByDuration=()=>{
  try {
    if (!durationFilter.value) {
      callLogs.value = callLogsData.value.results;
      return;
    }

    let filteredCalls = [];
    switch (durationFilter.value) {
      case "short":
        filteredCalls = callLogsData.value.results.filter(
          (call) => call.duration < 5 * 60
        );
        break;
      case "medium":
        filteredCalls = callLogsData.value.results.filter(
          (call) => call.duration >= 5 * 60 && call.duration <= 15 * 60
        );
        break;
      case "long":
        filteredCalls = callLogsData.value.results.filter(
          (call) => call.duration > 15 * 60
        );
        break;
      default:
        filteredCalls = callLogsData.value.results;
    }
    callLogs.value = filteredCalls;
  } catch (error) {
    console.error("Error filtering by duration:", error);
    callLogs.value = callLogsData.value.results; // Reset to original data on error

    
  }
}

const saveCall = async (callInfo) => {
  try {
    console.log("Saving call:", callInfo);
    await proxy.$server.create("CallLog", {
      agent: callInfo.agent,
      time: callInfo.time,
      duration: callInfo.duration * 60, 
      callType: callInfo.callType,
      subject: callInfo.subject,
      description: callInfo.description,
    });
    callLogsData.value = await getDataCallLog();
    callLogs.value =callLogsData?.value?.results|| [];
    resetForm();

    showCreateDialog.value = false;
    calculateStats()
  } catch (error) {}
};

const resetForm = () => {
  Object.assign(callForm, {
    agent: "",
    time: "",
    duration: null,
    callType: "",
    subject: "",
    description: "",
  });
  isEditing.value = false;
};


const handleDialogClose = () => {
  resetForm();
  showCreateDialog.value = false;
};

const exportData = () => {
  console.log("Exporting data...");
};

const createTicketFromCall = () => {
  showViewDialog.value = false;
};

const editCallFromView = async(call) => {
  console.log("Editing call from view:",call );
  let data={
    agent: call?.agent,
    time: call.time,
    duration: Math.floor(call.duration / 60),
    callType: call.callType,
    subject: call.subject,
    _id: call._id,
    id: call._id,
    description: call.description,
  }
  await updateCall(data)
  showCreateDialog.value = false;
  callLogsData.value = await getDataCallLog();
  callLogs.value =callLogsData?.value?.results|| [];
  console.log("Updated call logs data:", callLogsData.value);
  resetForm();


};

const getCallToday = () => {
  const today = new Date().toISOString().split("T")[0];
  return callLogs.value.filter((call) => call.time.startsWith(today)).length;
};
const AveDuration = () => {
  if (callLogs.value.length === 0) return "0:00";
  const totalSeconds = callLogs.value.reduce(
    (sum, call) => sum + call.duration,
    0
  );
  const averageSeconds = Math.floor(totalSeconds / callLogs.value.length);
  return formatDuration(averageSeconds);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getDurationTagType = (seconds) => {
  const minutes = seconds / 60;
  if (minutes < 5) return "success";
  if (minutes < 15) return "warning";
  return "danger";
};
const statsData = ref([
  { name: "Total Calls", value: 0 },
  { name: "Today's Calls", value: 0 },
  { name: "Avg Duration", value: "" },
  { name: "Active Agents", value: 0 },
]);
onMounted(async () => {
  agentOptions.value = await getAgents();
  callLogsData.value = await getDataCallLog();
  callLogs.value = callLogsData.value.results;
  calculateStats();
});
const calculateStats = () => {
  if (!callLogs.value || callLogs.value.length === 0) {
    console.warn("No call logs available to calculate stats");
    return;
  }
  statsData.value[0].value = callLogs?.value?.length;
  statsData.value[1].value = getCallToday();
  statsData.value[2].value = AveDuration();
  statsData.value[3].value = activeAgent();
};
const getDataCallLog = async () => {
  try {
    return await proxy.$server.search("CallLog");
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return [];
  }
};

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

const activeAgent = () => {
  const agents = new Set(callLogs.value.map((call) => call.agent.name));
  return agents.size;
};
</script>

<style scoped>
.el-table {
  border-radius: 0 0 1rem 1rem;
}

.el-dialog {
  border-radius: 1rem !important;
}

.el-pagination {
  --el-pagination-bg-color: transparent;
}

.el-button.is-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}
.el-dialog__body::-webkit-scrollbar {
  width: 6px;
}

.el-dialog__body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.el-dialog__body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.el-dialog__body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
