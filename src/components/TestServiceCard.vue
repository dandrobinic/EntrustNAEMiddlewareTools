<template>
    <div class="test-serv-card">
      <div class="l-col">
        <h4>{{ service.title }} (PRODUCTION TEST) </h4> 
        <div class="form-container">
            <input id="user" type="text" placeholder="User" v-model="user">
        </div>
        <div class="summarize-info">
          <h3>TIempo promedio <small>(ultimas 50 transacciones)</small></h3>
          <p>744ms</p>
          <h3>Total OTP solicitados</h3>
          <p>1.8 mill</p>
        </div>
      </div>
      <div class="r-col">
        <div class="resultBox">
          <span v-if="responseStatus">Last Time Launched:{{ getCurrentDate() }}</span>
          <p v-if="responseStatus" class="service-status-response">Resultado: <span>exitoso</span></p>
          <p v-if="responseStatus" class="service-status-response">Mensaje de Respuesta: OTP Succesfully Created - Service is Active</p>
          <p v-if="responseStatus" class="service-status-response">Time Response: {{responseDuration}} ms</p>
        </div>
        <v-button :disabled="!user" :class="{ disableBtn: !user }" @click="sendMiddlewareNaeServiceTest">Test</v-button>
      </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue'
import MiddlewareNaeService from '@/services/MiddlewareNaeService.js'
import EntrustService from '@/services/EntrustService.js'

export default {
data() {
    return {
      user: null,
      message: '',
      responseData: null,
      responseStatus: null,
      responseDuration: null
    }
  },
  props: {
    service: {
      type: Object,
      required: true
    }    
  },
  components:{
   'v-button': Button
  },
  methods:{
    //Trigger an event in child click when this method is fired. By sing $emit(eventName) and listen to an event in parent using $on(eventName)
    sendMiddlewareNaeServiceTest(){
      if(this.user !== '') { //check if `user` is empty or not
        console.log("Hola Sending Test To Middleware Nae Cloud Functions")
        MiddlewareNaeService.otp(this.user)
        .then(response => {
          console.log(response)
          this.responseData = response.data
          this.responseStatus = response.status
          this.responseDuration = response.duration
        })
        .catch(error => {
          console.log(error)
        })  
        this.user = '';
      }
      else {
        alert("Por favor introduzca un usuario valido Entrust.");
      }
           
    },
    sendEntrustServiceTest(){
      console.log("Hola Sending Test To Entrust Admin API")
      EntrustService.authenticate()
      .then(response => {
        console.log(response.data)
        this.responseData = response.data
      })
      .catch(error => {
        console.log(error)
      })     
    },
    getCurrentDate() {
      const current = new Date();
      const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
      return date;
    }
  }
}
</script>

<style scoped>

.disableBtn{
  opacity:0.5;
}
.form-container{
    margin: 12px 0;
}
.test-serv-card {
  display: flex;
  flex-direction: row;
  width: 80%;
  text-align: left;
  border: 1px solid #9b9b9b;
  margin: 20px 30px 20px 20px;
  border-radius: 5px;
}

.test-serv-card > .l-col{
  display: flex;
  flex-direction: column;
  width: 50%;
  padding:20px;
}

.test-serv-card .l-col h4{
  margin-bottom:5px;
}

.test-serv-card > .r-col{
  position:relative;
  display: flex;
  flex-direction: column;
  width: 50%;
  padding:20px;
  align-items: center;
  justify-content: space-between;
  border-left: 2px solid #ccc;
}

.test-serv-card .resultBox{
    width: 100%;
    height: 100%;
    border: 1px solid #9b9b9b;
    margin-bottom: 25px;
    box-sizing: border-box;
}

/* .test-serv-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
} */

.event-link {
  color: #2c3e50;
  text-decoration: none;
}
</style>
