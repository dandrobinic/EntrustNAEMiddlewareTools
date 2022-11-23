import { createStore } from 'vuex'
import firebase from "firebase/app";
import router from '../router';

export default createStore({
  state: {
    loggingIn: false, // to display the spinner
    loginError: null, // to display the Error Message
    // loginSuccessful: false, // to display the Success Message
    authenticated: false,
    accessToken: null, // it might be needed for storing accestoken from firebase auth or another auth token system
    lastTimeLaunched: null, // to store the last time and date a service tes was launched    
  },
  mutations: {
    loginStart: state => state.loggingIn = true,
    loginStop: (state, errorMessage) => { // for when the login request has finished
      state.loggingIn = false;
      state.loginError = errorMessage;
      // state.loginSuccessful = !errorMessage;
    },
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    updateAccessToken(state, accessToken) {
      state.accessToken = accessToken
    },
    logout: (state) => {
      state.accessToken = null;
      state.authenticated = false;
    }
  },
  getters: {
    getAccessToken: state => {
      return state.accessToken
    }
  },
  actions: {    
    logout({ commit }) {
      firebase.auth().signOut(); // signOut user from firbase auth
      localStorage.removeItem('accessToken'); // remove accessToken from LocaStorage     
      commit('logout'); // trigger logout method mutations to alter corresponding attributes
      router.push('/login');
    },
    // Action to send request to Firebase Authentication API
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
          console.log("user: ",user)    
          commit('loginStop', null);              
          commit("setAuthentication", true) // trigger setAuthentication method mutations to alter authenticated attribute            
          localStorage.setItem('accessToken', "kdjaflkajflkuh47h8o7hw8o4caehsldhjkahjdaskdjhakld7g35497834575hfwijkhkjdjhfsfjds"); // store accessToken in LocaStorage
          commit('updateAccessToken', "kdjaflkajflkuh47h8o7hw8o4caehsldhjkahjdaskdjhakld7g35497834575hfwijkhkjdjhfsfjds"); // trigger updateAccessToken method mutations to alter corresponding attributes
          router.push('/dashboard');
        },
        (err) => {          
            commit('updateAccessToken', null);
            commit('loginStop', err)            
        }
      ).catch((error) => {
        commit('loginStop', error)     
      })       
    },
    fetchAccessToken({ commit }) {
      commit('updateAccessToken', localStorage.getItem('accessToken'));
    }       
  },
  modules: {}
})
