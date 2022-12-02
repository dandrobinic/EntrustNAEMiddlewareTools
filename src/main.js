import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from "firebase/app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const firebaseConfig = {
  apiKey: "AIzaSyCInkrGwPG3QJ4lVjBW6XBGuQYtsIiWLzk",
  authDomain: "contactservicemfa.firebaseapp.com",
  projectId: "contactservicemfa",
  storageBucket: "contactservicemfa.appspot.com",
  messagingSenderId: "912090545250",
  appId: "1:912090545250:web:f6f5ecd67d927ceb3ca53b",
  measurementId: "G-K6VKZS0RFJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Configuration
library.add(fas);

createApp(App)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
