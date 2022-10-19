<template>
  <!-- <div class="Main">
    <navigation></navigation>
    <v-header></v-header>
    <v-content></v-content>
    <v-footer></v-footer>
  </div> -->
  <div id="app">
    <div id="top-bar" class="admin-ops">
      <router-link :to="{ name: 'Login' }">Login</router-link>
      <router-link :to="{ name: 'SignUp' }">Register</router-link>
      <router-link :to="{ name: 'Login' }">Configuración</router-link>
      <p>Menu</p>
    </div>
    <div id="nav">
      <div class="general-ops">
        <!-- <router-link :to="{ name: 'EventList' }">Events</router-link> -->
        <router-link :to="{ name: 'About' }">Acerca</router-link>
        <router-link :to="{ name: 'ServiceTest' }">Pruebas del Servicio</router-link>
        <router-link :to="{ name: 'EntrustMonitor' }">Estado del Servicio</router-link>
        <router-link :to="{ name: 'Reportes' }">Reportes</router-link>
        <router-link :to="{ name: 'ClientPrototype' }">Prototipo Cliente MFA</router-link>
      </div>
    </div>
    <router-view />
    <div id="footer">
      
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#top-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #dadada;
}

#top-bar > a,#top-bar > p{
  margin-right: 22px;
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
  padding: 10px;
}

#nav .admin-ops{
  display: flex;
  flex-direction: row-reverse;
  width: 25%;
}


#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #1a6198;
}

h4 {
  font-size: 20px;
}
</style>
