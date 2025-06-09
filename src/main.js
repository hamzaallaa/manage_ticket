import { createApp } from 'vue'
import router from './router'
// import VueMoment from 'vue-moment'
import moment from 'moment'
// import store from './store'
import App from './App.vue'
import './css/style.css'

import jwtService from './api/jwt.service'
import server from './api/server'
import axios from './api/axios'
// import { useStore } from 'vuex'
import store from './store'
import VueApexCharts from "vue3-apexcharts";
import globalComponents from './utils/global.compents';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import 'element-plus/dist/index.css'

import Toaster from '@meforma/vue-toaster';

const run=async()=>{
    const app = createApp(App)
    var me = null;
    if (!jwtService.verifyToken()) {
        if(window.location.pathname.toLowerCase() != "/apps"){
            if (window.location.pathname.toLowerCase() != "/signin"&&window.location.pathname.toLowerCase() != "/signup") {
                window.location.href=window.location.origin+"/signin"
            }
        }
        
    } else {
        try {
            me = await server.me("users");
            if (me.data.error) router.push("/signin");
            store.dispatch('global/updateMe', me.data);
        } catch (error) {
            router.push('/signin');
            jwtService.destroyToken();
            console.log(error);
            store.dispatch('global/updateMe', {});
        }
    }
    app.config.globalProperties.$jwtService= jwtService
    app.config.globalProperties.$server = server
    app.config.globalProperties.$http = axios;
    app.config.globalProperties.$me = me
    app.config.globalProperties.$moment = moment
    
    app.use(router).use(store).use(Toaster).use(VueApexCharts);
    app.mount('#app')

    app.use(globalComponents);
    app.use(CkeditorPlugin)

}
run()


