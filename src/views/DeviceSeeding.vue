<template>
    <!-- <div class="device-seeding">
        <h1>Device Seeding Store</h1>
          <div class="form-container">
            <input type="text" placeholder="User" v-model="user">
            <input type="password" placeholder="Contraseña">
            <button @click="login">Login</button>
          </div>
          <br>
    </div> -->

    <div class="device-seeding">
        <div class="header card-header col-lg-4 col-md-11 col-xs-11">
        </div>
        <div class="custom-card" >
          <div class="custom-card-title">
            <h1 style="font-size: 32px;">Validación de Identidad</h1>
            <span class="card-title">Este proceso te permitirá habilitar la autenticación multifactor mejorando la seguridad en el acceso a los sitemas agregando la validación de tu identidad.</span><br/>
          </div>
          <div class="card-message">
            <span class="bold-font">Completa este registro para habilitar tu dispositivo.</span>
          </div>
          <div class="custom-card-title">
            <h5 class="card-title">Nombre usuario</h5>
          </div>
          <div class="mb-3 input-field">
            <!-- <input id="userId" class="input" autocomplete="none" /> -->
            <input id="userId" class="input" type="text" placeholder="User" v-model="user" autocomplete="none">
            <div class="form-check">
              <input id="userMainDevice" class="form-check-input error" v-model="userMainDevice" type="checkbox" value="">
              <label class="form-check-label" for="userMainDevice">
                Está usando su dispositivo principal
              </label>
            </div>
          </div>
          <div id="html_element"></div>
          <div class="btn-container">
            <button onclick="onSubmit()" id="submit" class="btn-custom">Enviar</button>
          </div>
          <img style="display: none;" id="loading" class="mt-2 mb-2" src="../../public/loading.gif" height="50px" />
          <div id="errorMessageContainer" style="display: none!important;" class="col-8 mt-3">
            <div class="error-container">
              <span class="error-text" id="errorMessage"> Mensaje error </span>
            </div>
          </div>
          <div id="successMessageContainer" class="" style="display: none!important;">
            <div class="success-container">
              <span class="error-text" id="successMessage"> Mensaje correcto </span>
            </div>
          </div>
          <div class="separator"></div>
        </div>
      <input style="display: none!important;" id="machineNonce"  />
      <input style="display: none!important;" id="sequenceNonce"  />
    </div>
</template>

<script>
// import firebase from 'firebase/app'

export default{
  data(){
    return {
        user: '',
        userMainDevice: false
    }
  },
  mounted() {
    
  },
  computed:{
 
  },
  methods:{
    
  }
}

</script>

<style scoped>
.device-seeding{
    display: flex;
    width: 80%;
    margin: auto;
    flex-direction: column;
    min-height: 550px;
    align-items: center;
    justify-content: center;
}

.device-seeding .card-title{
    text-align: left;
    display: block;
}

.device-seeding .custom-card{
    width: 100%;
    max-width: 520px;
    padding: 32px;
    border: 2px solid #c1c1c1;
    border-radius: 5px;
}

</style>