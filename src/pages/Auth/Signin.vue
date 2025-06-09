<template>
  <main class="bg-white">

    <div class="relative flex">

      <!-- Content -->
      <div class="w-full md:w-1/2">
        <div class="flex flex-col h-full min-h-screen after:flex-1">

          <div class="flex-1">
            <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style="justify-content: center;">
              <!-- Logo -->
              <router-link class="block mt-6" to="/signin">
                Logo
              </router-link>
            </div>
          </div>          

          <div class="max-w-sm px-4 py-8 mx-auto">
            <h1 class="mb-6 text-3xl font-bold text-slate-800">Welcome back! ✨</h1>

            <Banner type="error" :open="bannerErrorOpen" class="mb-6">
              {{ alertbanner }}
            </Banner>

            <!-- Form -->
            <form @submit="loginForm" class="mt-2" method="POST">
              <div class="space-y-4">
                <div>
                  <label class="block mb-1 text-sm font-medium" for="email"  >Email Address</label>
                  <input id="email" class="w-full form-input" type="email" name="name" v-model="email"/>
                </div>
                <div>
                  <label class="block mb-1 text-sm font-medium" for="password">Password</label>
                  <input id="password" class="w-full form-input" type="password" autoComplete="on" name="password" v-model="password"/>
                </div>
              </div>
              <div class="flex items-center justify-between mt-6">
                <div class="mr-1">
                  <router-link class="text-sm underline hover:no-underline" to="/reset-password">Forgot Password?</router-link>
                </div>
                <!-- <router-link class="ml-3 text-white btn bg-lime-500 hover:bg-lime-600" to="/">Sign In</router-link> -->
                <button class="ml-3 text-white btn bg-lime-500 hover:bg-lime-600" type="submit">Sign In</button>
              </div>
            </form>
            <!-- Footer -->
            <div class="pt-5 mt-6 border-t border-slate-200">
              <div class="text-sm">
                Don’t you have an account? <router-link class="font-medium text-lime-500 hover:text-lime-600" to="/signup">Sign Up</router-link>
              </div>
              <!-- Warning -->
            </div>
          </div>

        </div>
      </div>

      <!-- Image -->
      <div class="absolute top-0 bottom-0 right-0 hidden md:block md:w-1/2" aria-hidden="true">
        <img class="object-cover object-center w-full h-full" src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?semt=ais_hybrid&w=740" width="760" height="980" alt="Authentication" />
      </div>

    </div>

  </main>
</template>

<script>
  import { ref } from 'vue'
  // Banner
  import Banner from './Banner.vue'
  import axios from 'axios'
  const bannerErrorOpen = ref(false)


  export default {  
    name: 'Signin',
    components: {
      Banner
    },
    data: () => ({
      email: null,
      password: null,
      alertbanner: null,
    }),
    methods:{
      loginForm: async function (e) {
        const email = this.email;
        const password = this.password;
        e.preventDefault();
        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (this.email == null) {bannerErrorOpen.value = true;this.alertbanner = "Please Enter Email.";} 
        else if (this.password == null) {bannerErrorOpen.value = true;this.alertbanner = "Please Enter Password."}
        else if (!filter.test(this.email)) {bannerErrorOpen.value = true; this.alertbanner = "Enter valid email id.";} 
        else {
          var data = {email: email,password: password}
          try {
            var res = await this.$server.login('users', data)
            localStorage.setItem('id_token', res.token)
            location.href = '/';
          } catch (error) {
            bannerErrorOpen.value = true;this.alertbanner = error?.response?.data;
          }
        }
      }
    },
    setup() {
      return {
        bannerErrorOpen           
      }  
    }
  }
</script>