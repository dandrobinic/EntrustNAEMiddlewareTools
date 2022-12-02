<template>
    <div class="login">
      <h1>Login</h1>
      <div v-if="loggingIn" class="container-loading">
        <img src="/loading.gif" alt="Loading Icon">
      </div>
      
      <p v-if="loginError">{{ loginError }}</p>
      <p v-if="accessToken">Login Successful</p>
      <form @submit.prevent="loginSubmit">
        <input type="email" placeholder="E-Mail" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <button type="submit">Ingresar</button>
      </form>
      <div class="alternate-ops">
        <a href="#">olvide la constraseña</a>
      </div>
    </div>
  </template>

<script>
import { mapState, mapActions } from 'vuex';
import firebase from 'firebase/app'
import "firebase/auth";

export default{
  data(){
    return {
      email: '',
      password: ''
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
          console.log('user is logged in');
          // user.getIdToken().then((idToken)=>{
          //   localStorage.setItem('accessToken', idToken);
          //   this.$store.commit('loginStop', null);
          //   this.$store.commit('updateAccessToken', idToken)
          //   console.log("idToken: ",idToken)
          //   console.log("getAccessToken (GETTERS): ",this.$store.getters.getAccessToken)  
          //   // return idToken
          // }).catch((error) => {
          //   this.$store.commit('loginStop', error);
          //   this.$store.commit('updateAccessToken', null);
          // });

          // Autologging out the user after 10 seconds after being logged in succcesfully
          setTimeout(() => {  
              //firebase.auth().signOut();
              //this.logout();
              console.log("pasaron 10 segs despues de que el estado de autenticacion del usuario paso a loggeado");
          }, 10000);
      } else {
          console.log('user is logged out now')
      }      
    })
    console.log(`the component is now mounted.`)
  },
  computed:{
    ...mapState([
      'loggingIn',
      'loginError',
      //'loginSuccessful'
      'accessToken',
      'authenticated'

    ]) 
  },
  methods:{
    ...mapActions([
      'doFirebaseLogin',
      'logout'
    ]),
    loginSubmit() {
      return this.doFirebaseLogin({
        email: this.email,
        password: this.password
      })
    }    
  }
}

</script>

<style scoped>
    .login {
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 0.1px solid rgb(0,-2,-2,0.18);
      padding: 1.5rem;
      width: 300px;
      min-height: 320px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      overflow: hidden;   
      box-shadow: 2px 2px 2px 1px rgb(0 0 0 / 20%); 
      border-top: 5px solid #EF3829;
    } 
    .container-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,.3);
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    form {
      height: 100%;
      justify-content: flex-start;
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }
    form input{
      margin-bottom: 15px;
      border: 0.1px solid rgba(0,0,0,.18);
      outline: none;
    }
    input {
      padding: .5rem;
    }
    button {
      padding: .5rem;
      background-color: #EF3829;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      width: 50%;
      min-width: 50%;
      margin: 0 auto;      
    }
    button:hover {
      background-color: lightslategray;
    }
    .alternate-ops > a{
      font-size: 0.8rem;
    }
</style>