import { createStore } from 'vuex'
import firebase from "firebase/app";

export default createStore({
  state: {
    loggingIn: false, // to display the spinner
    loginError: null, // to display the Error Message
    loginSuccessful: false, // to display the Success Message
    accessToken: '', // it might be needed for storing accestoken on firebase auth
    lastTimeLaunched: null // to store the last time and date a service tes was launched
  },
  mutations: {
    loginStart: state => state.loggingIn = true,
    loginStop: (state, errorMessage) => { // for when the login request has finished
      state.loggingIn = false;
      state.loginError = errorMessage;
      state.loginSuccessful = !errorMessage;
    },
    setStoreToken(state, accessToken) {
      state.accessToken = accessToken
    }
  },
  getters: {
    getAccessToken: state => {
      return state.accessToken
    }
  },
  actions: {
  //action to send request to Firebase Authentication API
    doFirebaseLogin({ commit }, loginData) { 
      commit('loginStart');        
      // axios.post('https://reqres.in/api/login', {
      //   ...loginData
      // })
      // .then(() => {
      //   commit('loginStop', null)
      // })
      // .catch(error => {
      //   commit('loginStop', error.response.data.error)
      // })
      
      firebase.auth().signInWithEmailAndPassword(loginData.email,loginData.password)
      .then(
        (user) => {
            commit('loginStop', null)
            console.log(user);
        },
        (err) => {
            commit('loginStop', err)
        }
      ).catch((error) => {
        commit('loginStop', error.response.data.error)
        // const errorCode = error.code;
        // const errorMessage = error.message;        
      })       
    }       
  },
  modules: {}
})
