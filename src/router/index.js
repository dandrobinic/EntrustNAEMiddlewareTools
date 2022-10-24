import { createRouter, createWebHistory } from 'vue-router'
// import EventList from '../views/EventList.vue'
import EventDetails from '../views/EventDetails.vue'
import EventList from '../views/EventList.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import ServiceMonitor from '../views/ServiceMonitor.vue'
import Reportes from '../views/Reportes.vue'
import ServiceTest from '../views/ServiceTest.vue'
import ServiceConfig from '../views/ServiceConfig.vue'
import ClientPrototype from '../views/ClientPrototype.vue'
import DeviceSeeding from '../views/DeviceSeeding.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
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
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/service-monitor',
    name: 'ServiceMonitor',
    component: ServiceMonitor
  },
  {
    path: '/service-test',
    name: 'ServiceTest',
    component: ServiceTest
  },
  {
    path: '/service-config',
    name: 'ServiceConfig',
    component: ServiceConfig
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: Reportes
  },
  {
    path: '/client-protoype',
    name: 'ClientPrototype',
    component: ClientPrototype
  },
  {
    path: '/device-seeding',
    name: 'DeviceSeeding',
    component: DeviceSeeding
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//Protecting routes based on authenticated users
// router.beforeEach(async (to, from) =>{
//   if(
//     !true && to.name !== 'Login'
//     ){
//       console.log(from)
//     return {name: 'Login'}
//   }
// })
export default router
