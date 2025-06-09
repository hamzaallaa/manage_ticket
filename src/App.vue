<template>
  <div v-if="$route.name">
    <div v-if="!['signin','signup','apps'].includes($route.name)" class="flex h-screen overflow-hidden">
      <Sidebar  :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = true" />
      <div class="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header  :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        <main class="px-5">
            <router-view />
        </main>
      </div> 
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>


<script>
import Sidebar from './partials/Sidebar.vue'
import Header from './partials/Header.vue'
import 'ckeditor5/ckeditor5.css';
import 'element-plus/dist/index.css';

export default {
components: {Sidebar,Header},
data() {
  return {
    sidebarOpen:true,
    underDrop:false
  }
},
computed: {
},
methods:{
}
}
</script>


