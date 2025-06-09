<template>
  <div :class="!sidebarOpen?'hidden lg:visible':''" >
    {{ watchRoute }}
    <div  id="sidebar" ref="sidebar" class="flex flex-col static h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64  shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-64'"  >
      <div class="flex justify-between pr-3 mb-10 sm:px-2">
        <router-link class="block" to="/">
          <img src="https://c8.alamy.com/comp/HYCG36/demo-icon-demo-website-button-on-white-background-HYCG36.jpg" alt="Logo-png" style="width: 100%;height: 60px;">
        </router-link>
      </div>
      <div class="space-y-8">
        <div>
          <h3 class="pl-3 text-xs font-semibold uppercase text-slate-500">
            <span class="hidden w-6 text-center lg:block lg:sidebar-expanded:hidden" aria-hidden="true">•••</span>
            <span class="lg:hidden lg:sidebar-expanded:block ">Dashboard</span>
          </h3>
          <ul class="mt-3">
            <div v-for="(el, index) in $store.state.sideMenu.menu" :key="el.path">
              <div v-if="getAccess(el.role,el.access)">
                <router-link :to="el.path" custom v-slot="{ href, navigate, isExactActive, isActive }">
                  <li class="px-3 py-2 rounded-sm mb-0.5 last:mb-0" :class="(el.children?.length ? isActive : isActive) && 'bg-slate-900'">
                    <a class="block truncate transition duration-150 text-slate-200 hover:text-white" :class="isActive && 'hover:text-slate-200'" :href="href" @click="e => el.children?.length ? toggleAccordion(e, index) : navigate(e)">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center grow">
                          <span v-html="icons[el.icon]" ></span>
                          <span class="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">{{ el.title }}</span>
                        </div>
                        <svg v-if="el.children?.length" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 duration-150 ease-in-out" :class="index === activeIndex ? 'rotate-0' : '-rotate-90'">
                          <path fill="#ffffff" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
                        </svg>
                      </div>
                    </a>
                  </li>
                </router-link>
                <!-- <ul v-if="el.children?.length" class="mt-2 overflow-hidden duration-150 ease-in-out" :class="index === activeIndex ? `h-[${el.children.length * 30}px]` : 'h-0'" > -->
                <ul v-if="el.children?.length" class="mt-2 overflow-hidden duration-150 ease-in-out backdrop-opacity-50" :style="index === activeIndex ? `height: ${el.children.filter(subEl => getAccess(subEl.role, subEl.access)).length * 34}px` : 'height: 0'" >
                  <div v-for="(subEl) in el.children" :key="subEl.path">
                    <div v-if="getAccess(subEl.role, subEl.access)">
                      <router-link :to="subEl.path" custom v-slot="{ href, navigate, isExactActive }">
                        <li class="px-4 py-1 rounded-sm mb-0.5 last:mb-0" :class="isExactActive &&'bg-slate-900'">
                          <a class="block truncate transition duration-150 text-slate-200 hover:text-white" :class="isExactActive && 'hover:text-slate-200'" :href="href" @click="navigate">
                            <div class="flex items-center justify-between">
                              <div class="flex items-center grow">
                                <span class="ml-2" v-html="icons[subEl.icon]"></span>
                                <span class="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">{{ subEl.title }}</span>
                              </div>
                            </div>
                          </a>
                        </li>
                      </router-link>
                    </div>
                  </div>
                </ul>       
              </div>
            </div>
          </ul>
        </div>
      </div>
      <div class="justify-end hidden pt-3 mt-auto lg:inline-flex">
        <div class="px-3 py-2">
          <button @click.prevent="sidebarExpanded = !sidebarExpanded">
            <span class="sr-only">Expand / collapse sidebar</span>
            <svg class="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
              <path class="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
              <path class="text-slate-600" d="M3 23H1V1h2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Sidebar',
  props: ['sidebarOpen'],
  components: {
  },  
  setup(props, { emit }) {

    const trigger = ref(null)
    const sidebar = ref(null)

    // const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
    const sidebarExpanded = ref('true')

    const currentRoute = useRouter().currentRoute.value

    // close on click outside
    const clickHandler = ({ target }) => {
      if (!sidebar.value || !trigger.value) return
      if (
        !props.sidebarOpen ||
        sidebar.value.contains(target) ||
        trigger.value.contains(target)
      ) return
      emit('close-sidebar')
    }

    // close if the esc key is pressed
    const keyHandler = ({ keyCode }) => {
      if (!props.sidebarOpen || keyCode !== 27) return
      emit('close-sidebar')
    } 

    onMounted(() => {
      document.addEventListener('click', clickHandler)
      document.addEventListener('keydown', keyHandler)
    })

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('keydown', keyHandler)
    })

    watch(sidebarExpanded, () => {
      localStorage.setItem('sidebar-expanded', sidebarExpanded.value)
      if (sidebarExpanded.value) {
        document.querySelector('body').classList.add('sidebar-expanded')
      } else {
        document.querySelector('body').classList.remove('sidebar-expanded')
      }
    })

    return {
      trigger,
      sidebar,
      sidebarExpanded,
      currentRoute,
    }
  },
  data() {
    return {
      icons:{
          
        },
        user:this.$store?.state?.global?.me,
        activeIndex: null,
    }
  },
  mounted() {
    // console.log(this.$store.state.global.me)
    // this.watchRoute
  },
  computed: {
    watchRoute(){
      if(this.user.role!="read"&&this.user.permission=="feedCl"&&!["feedClApp","feedClApi"].includes(this.$route.name))return this.$router.push('feedClApp')
      if((this.user.role=="read"||!this.user.permission) && this.$route.name!="empty") this.$router.push('empty')
      else if(this.$route.name=="empty"&&this.user.permission &&this.user.role!="read")this.$router.push('/')
      // console.log("watchRoute=======>", this.$route.name, this.$route.path)

      const routes = []
      for (const route of this.$store.state.sideMenu.menu) {
        const { hidden_children, children, ...rest } = route
        routes.push(rest)
        // if (hidden_children && hidden_children.length) {
        //   routes.push(...hidden_children)
        // }
        if (children && children.length) {
          routes.push(...children)
        }
      }

      const route_parts = this.$route.path.split('/')
      route_parts.shift()
      do {
        const current_path = routes.find(item => item.path === `/${route_parts.join('/')}`)
        if (current_path) {
          if(!this.getAccess(current_path.role, current_path.access)) {
            this.$router.replace('/')
          }
        } else {
          route_parts.pop()
          if (route_parts.length) {
            continue
          } else {
            this.$router.replace('/')
          }
        }
        break
      } while (!route_parts.length)
    }
  },
  methods: {
    getAccess(role,access) {
      if(role=="read"||!this.user.permission) return false
      else {
        if(role.includes(this.user.role))return true
        else return false
      }
    },
    toggleAccordion(e, index) {
      e.preventDefault()
      this.activeIndex = index === this.activeIndex ? null : index
    },
  },
}
</script>

<style>

.color_g{
  color: rgb(255, 255, 255);
}

</style>