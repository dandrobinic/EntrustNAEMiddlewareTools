<template>
  <div class="client-prototype">
      <h1>Client Prototype</h1>
        <p>Escribe el usuario y contraseña para ingresar</p>
        <button @click="checkFingerPrint()">Existe Fingerprint</button>
        <div id="login-container">
            <LoginV2 />
        </div>
        <!-- <div class="form-container">
          <input type="text" placeholder="User" v-model="user">
          <input type="password" placeholder="Contraseña">
          <button @click="login">Login</button>
        </div> -->
        <br>
        <small>Client prototype consuming MFA service with Device Recognition (Fingerprint Device) and Resource Rules(Location Applied)</small>        
    </div>
</template>

<script>
import LoginV2 from '@/components/LoginV2.vue'
// import machineSecret from '../scripts/machineSecret'

export default {
    name: "ClientPrototype",
    components: {
        LoginV2
    },
    data(){
        return {   
            machineSecret: null        
        }
    },
    mounted(){
        // To import Entrust SDK script use the following import method
        let fingerprintDeviceSDKScript = document.createElement('script')
        fingerprintDeviceSDKScript.setAttribute('src', 'https://firebasestorage.googleapis.com/v0/b/contactservicemfa.appspot.com/o/machineSecret.js?alt=media&token=086ad0c1-66e2-4914-88ab-d289066d99e1')
        document.head.appendChild(fingerprintDeviceSDKScript)              
    },
    created(){
    },
    methods: {
    }
}
</script>

<style scoped>
input{
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
    outline: none;
    background: #e2e2e2;
}
.form-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: auto;
}

.form-container > input{
    width: 25%;
}
.form-container > button{
    width: 15%;
    margin: 10px;
    padding: 10px;
    background: #EF3829;
    outline: none;
    border: none;
    color: white;
}

</style>
