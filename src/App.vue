<template>
  <!-- <div class="Main">
    <navigation></navigation>
    <v-header></v-header>
    <v-content></v-content>
    <v-footer></v-footer>
  </div> -->
  <div id="app">
    <div id="top-bar" class="admin-ops">
      <!-- <router-link v-if="!accessToken" :to="{ name: 'Login' }">Login</router-link> -->
      <!-- <router-link :to="{ name: 'SignUp' }">Register</router-link> -->
      <!-- <router-link :to="{ name: 'ClientPrototype' }">Prototipo Cliente MFA</router-link> -->
      <!-- <router-link :to="{ name: 'DeviceSeeding' }">Device Seeding</router-link> -->
      <button class="logoutBtn" v-if="accessToken" @click=logout()>Cerrar Sesión<font-awesome-icon icon="right-from-bracket" /></button>
      <p v-if="accessToken"><span>Menu</span></p>
    </div>
    <div v-if="accessToken" id="nav">
      <div class="general-ops">
        <!-- <router-link :to="{ name: 'EventList' }">Events</router-link> -->
        <!-- <router-link :to="{ name: 'About' }">Acerca</router-link> -->
        <router-link :to="{ name: 'ServiceMonitor' }">Estado del Servicio</router-link>
        <router-link :to="{ name: 'ServiceTest' }">Pruebas del Servicio</router-link>
        <router-link :to="{ name: 'Reportes' }">Reportes</router-link>
        <router-link :to="{ name: 'ServiceConfig' }">Configuración</router-link>
      </div>
    </div>
    <router-view />
    <div id="footer">
      
    </div>
  </div>
</template>

<script>
import { mapState , mapActions } from 'vuex';

export default {
  name: 'app',
  computed:{
    ...mapState([    
      'accessToken'
    ]) 
  },
  methods: {
    ...mapActions([
      'fetchAccessToken',
      'logout'
    ]),
  },
  created() {
    this.fetchAccessToken();
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
body{
  margin: 0;
}
#app {
  font-family: Roboto,Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#top-bar {
    min-height: 50px;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #EF3829;
}

#top-bar > a,#top-bar > p{
  margin-right: 22px;
  margin-left: 22px;
  color:#fff;
  text-decoration: none;
}

#top-bar .logoutBtn{
  height: 28px;
  background: #fdfdfd;
  outline: none;
  border: none;
  color: #0c0c0c;
  text-align: center;
  line-height: 0px;
  border-radius: 5px;
}

#top-bar .logoutBtn > svg{
  padding: 0 5px 0 12px;
}

#nav {
  display: flex;
  flex-direction: row;
  width: 80%;
  padding: 30px;
  margin: auto;
  border-bottom: 1px #9b9b9b solid;
}

#nav .general-ops{
  display: flex;
  flex-direction: row;
  width: 75%;
}

#nav .general-ops a{
  text-decoration: none;
  padding: 10px;
}

#nav .admin-ops{
  display: flex;
  flex-direction: row-reverse;
  width: 25%;
}

#nav a {
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  font-weight: 600;
  border-bottom:2px solid red;
}

h1{
  font-size: 1.5rem;
}

h4 {
  font-size: 20px;
}
</style>
