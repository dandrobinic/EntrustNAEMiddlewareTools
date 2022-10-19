<template>
  <div class="client-prototype">
      <h1>Client Prototype</h1>
        <p>Escribe el usuario y contraseña para ingresar</p>
        <div class="form-container">
          <input type="text" placeholder="User" v-model="user">
          <input type="password" placeholder="Contraseña">
          <button @click="login">Login</button>
        </div>
        <br>
        <small>Client prototype consuming MFA service with Device Recognition (Fingerprint Device) and Resource Rules(Location Applied)</small>        
    </div>
</template>

<script>
export default {
    name: "ClientPrototype",
    data(){
        return {           
        }
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
    background: rgb(125, 125, 252);
    outline: none;
    border: none;
    color: white;
}

</style>
