import { createRouter, createWebHistory, RouterView } from 'vue-router'
const routerHistory = createWebHistory()
async function isAuthenticated(to, from,next) {
  const id_token = localStorage.getItem("id_token");
  if (id_token === null) return next({path: 'Signin',replace: true})
  next()
};

function GoToMain(to, from,next) {
  const id_token = localStorage.getItem("id_token");
  // if (id_token != null) {next({path: '/',replace: true})}
  // else {next()}
  next()
};


const routes = [
  {
    path: '/', name: 'Dashbord',
    component: () => import('./pages/dashboard/index.vue'),
    meta: {authRequired: 'true'}, beforeEnter: [isAuthenticated]
  },{
     path: '/signin', name: 'signin',
    component: () => import('./pages/Auth/Signin.vue'),
    meta: {authRequired: 'false'},
    beforeEnter: [GoToMain]
  },
    {
    path: '/signup', name: 'signup',
    component: () => import('./pages/Auth/Signup.vue'),
    meta: {authRequired: 'false'}, beforeEnter: [GoToMain]
  },
    {
    path: '/tickets', name: 'tickets',
    component: () => import('./pages/dashboard/ticket/index.vue'),
    meta: {authRequired: 'false'}, beforeEnter: []
  },
    {
    path: '/calllog', name: 'calllog',
    component: () => import('./pages/dashboard/callLog/index.vue'),
    meta: {authRequired: 'false'}, beforeEnter: []
  },
]

const router = new createRouter({
  history: routerHistory,
  routes
})


router.beforeEach(async (to, from, next) => {
  next()
});











export default router
