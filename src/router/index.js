import { createRouter, createWebHistory } from 'vue-router'
// import EventList from '../views/EventList.vue'
import EventDetails from '../views/EventDetails.vue'
import EventList from '../views/EventList.vue'
import SignUp from '../views/SignUp.vue'
// import Dashboard from '../views/Dashboard.vue'
// import Login from '../views/Login.vue'
// import ServiceMonitor from '../views/ServiceMonitor.vue'
// import Reportes from '../views/Reportes.vue'
// import ServiceTest from '../views/ServiceTest.vue'
// import ServiceConfig from '../views/ServiceConfig.vue'
// import ClientPrototype from '../views/ClientPrototype.vue'
// import DeviceSeeding from '../views/DeviceSeeding.vue'
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ './../views/Login.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "Dashboard" */ './../views/Dashboard.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/events',
    name: 'EventList',
    props: true,
    component: EventList
  },
  {
    path: '/event/:id',
    name: 'EventDetails',
    props: true,
    component: EventDetails
  },
  {
    path: '/service-monitor',
    name: 'ServiceMonitor',
    component: () => import(/* webpackChunkName: "ServiceMonitor" */ './../views/ServiceMonitor.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/service-test',
    name: 'ServiceTest',
    component: () => import(/* webpackChunkName: "ServiceTest" */ './../views/ServiceTest.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/service-config',
    name: 'ServiceConfig',
    
    component: () => import(/* webpackChunkName: "ServiceConfig" */ './../views/ServiceConfig.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: () => import(/* webpackChunkName: "Reportes" */ './../views/Reportes.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/client-protoype',
    name: 'ClientPrototype',
    component: () => import(/* webpackChunkName: "ClientPrototype" */ './../views/ClientPrototype.vue') // this way of routing is faster as every component is Lazy Loaded
  },
  {
    path: '/device-seeding',
    name: 'DeviceSeeding',
    component: () => import(/* webpackChunkName: "DeviceSeeding" */ './../views/DeviceSeeding.vue') // this way of routing is faster as every component is Lazy Loaded
  },{
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Protecting routes based on authenticated users
router.beforeEach((to, from, next) => {
  // store.dispatch('fetchAccessToken');
  if (to.fullPath !== '/login' && !store.state.accessToken) next('/login')
  else next()
  
  // if (to.fullPath !== '/login') {    
  //   if (!store.state.authenticated) {
  //     console.log("pase al slot 1");
  //     next('/login');
  //   }
  // }
  // if (to.fullPath === '/login') {
  //   if (store.state.authenticated) {
  //     console.log("pase al slot 2");
  //     next('/dashboard');
  //   }
  // }
  // console.log("pase al slot 3");
  // next();
})

export default router
