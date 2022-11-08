<template>
    <div class="login">
      <div v-if="loggingIn" class="container-loading">
        <img src="/loading.gif" alt="Loading Icon">
      </div>
      <p v-if="loginError">{{ loginError }}</p>
      <p v-if="loginSuccessful">Login Successful</p>
      <form @submit.prevent="loginSubmit">
        <input type="email" placeholder="E-Mail" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <button type="submit">Login</button>
      </form>
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
          user.getIdToken().then((idToken)=>{
            this.$store.commit('setStoreToken', idToken)
            console.log(idToken)
            console.log(this.$store.getters.getAccessToken)  
            // return idToken
          });
      } else {
          console.log('user is logged out now')
      }
      // setTimeout(function(){  
      //     firebase.auth().signOut();
      // }, 10000);
    })
    console.log(`the component is now mounted.`)
  },
  created(){
    
  },
  computed:{
    ...mapState([
      'loggingIn',
      'loginError',
      'loginSuccessful'
    ]) 
  },
  methods:{
    ...mapActions([
      'doFirebaseLogin'
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
      border: 1px solid black;
      border-radius: 5px;
      padding: 1.5rem;
      width: 300px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      overflow: hidden;    
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
      display: flex;
      flex-flow: column;
    }
    input {
      padding: .5rem;
    }
    button {
      padding: .5rem;
      background-color: lightgray;
      border: 1px solid gray;
      border-radius: 3px;
      cursor: pointer;      
    }
    button:hover {
      background-color: lightslategray;
    }
</style>