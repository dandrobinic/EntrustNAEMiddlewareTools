import { createRouter, createWebHistory } from 'vue-router'
// import EventList from '../views/EventList.vue'
import EventDetails from '../views/EventDetails.vue'
import EventList from '../views/EventList.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import EntrustMonitor from '../views/EntrustMonitor.vue'
import Reportes from '../views/Reportes.vue'
import ServiceTest from '../views/ServiceTest.vue'
import ClientPrototype from '../views/ClientPrototype.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/login',
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
    path: '/entrust-monitor',
    name: 'EntrustMonitor',
    component: EntrustMonitor
  },
  {
    path: '/service-test',
    name: 'ServiceTest',
    component: ServiceTest
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//Protecting routes based on authenticated users
router.beforeEach(async (to, from) =>{
  if(
    !true && to.name !== 'Login'
    ){
      console.log(from)
    return {name: 'Login'}
  }
})
export default router
