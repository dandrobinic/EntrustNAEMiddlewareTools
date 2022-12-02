<template>
    <div class="test-serv-card">
      <div class="l-col">
        <h3>{{ service.title }} </h3> 
        <div class="form-container">
            <div v-if="service.id == 1" class="form-row">
              <input id="user" type="text" placeholder="Introduzca el Usuario Entrust" v-model="user">           
              <div class="btnContainer">
                <v-button :disabled="!user" :class="{ disableBtn: !user }" @click="sendOtpViaEntrust('SMS')">Enviar Via SMS</v-button>
                <v-button :disabled="!user" :class="{ disableBtn: !user }" @click="sendOtpViaEntrust('EMAIL')">Enviar Via Email</v-button>  
              </div>
              <!-- <v-button :disabled="!user" :class="{ disableBtn: !user }">Enviar Via PUSH</v-button>                -->
            </div>
            <div v-else  class="form-row">              
              <input id="phone" type="text" placeholder="Introduzca el Num. de celular" v-model="phone">
              <div class="btnContainer">
                <v-button :disabled="!phone" :class="{ disableBtn: !phone }" @click="sendOtpViaPca"><span>Enviar Via PCA</span></v-button>
              </div>
            </div>
            <!-- <div class="form-row">
              <input id="extra" type="text" placeholder="Introduzca el Usuario Entrust"> 
              <v-button :disabled="!user" :class="{ disableBtn: !user }">Enviar</v-button>               
            </div> -->
        </div>        
      </div>
      <div class="r-col">
        <h3>Consola de Resultado</h3>
        <div class="resultBox">
          <p v-if="successResponse" class="service-status-response">Resultado: <span>exitoso <font-awesome-icon icon="check" style="color: green;" /></span></p>
          <p v-if="errorResponse" class="service-status-response">Resultado: <span>fallido <font-awesome-icon icon="xmark" style="color: red;" /></span></p>
          <p v-if="successResponse" class="service-status-response">Mensaje de Respuesta: Su solicitud fue procesada con exito</p>
          <p v-if="errorResponse" class="service-status-response">Mensaje de Respuesta: {{errorResponse}}</p>
          <p v-if="successResponse" class="service-status-response">Tiempo de Respuesta: {{responseDuration}} ms</p>
          <p v-if="successResponse" class="service-status-response">Usuario/Num. Telefonico: {{otpSentTo}} </p>
        </div>
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
      phone: null,
      message: '',
      otpSentTo: null,
      authToken: null,
      token: null,
      responseData: null,      
      successResponse: null,
      responseDuration: null,
      errorResponse: null
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
    async sendOtpViaEntrust(deliveryType){
      console.log("Create and send OTP just using Entrust endpoints API");
      this.resetData();
      if(this.user !== '') { //check if `user` is empty or not
        this.otpSentTo = this.user
        this.authToken = await EntrustService.authenticate()
        .then(response => {
          return `Bearer ${response.data.authToken}`;
        })
        .catch(error => {
          console.log("Error: ",error)
        })
        
        // Validate AuthToken
        if(this.authToken == null || this.authToken == ''){
          alert("Hubo un error al autenticarse");
          return false 
        }

        console.log("this.authToken: ",this.authToken)
        this.token = await EntrustService.createAndSendOtp(this.authToken,this.user,deliveryType)
        .then(response => { 
          console.log("Response Data: ",response.data.token)
          this.responseData = response.data
          this.successResponse = response.status
          this.responseDuration = response.duration
          return response.data.token
        })
        .catch(error => {
          this.errorResponse = error.message
          console.log("Error: ",error.message)
        });

        // Validate token
        if(this.token == null || this.token == ''){
          alert("Hubo un error al autenticarse");
          return false 
        }
        console.log("OTP enviado");
      }else{
        alert("Por favor introduzca un usuario valido.");
      }
      this.user = null; 
    },
    async sendOtpViaPca(){
      if(this.phone !== '') { //check if `phone` is empty or not
        console.log("Sending Test To Cloud Functions for sending SMS directly via PCA")
        this.resetData();
        this.otpSentTo = this.phone
        await MiddlewareNaeService.sendOtpViaPca("Su OTP de prueba es el siguiente: 38923434",this.phone)
        .then(response => {
          console.log(response)
          if(response.data.pcaResponseStatus != 0){
            console.log("command_status from PDU Response is not zero")
            if(response.data.pcaResponseStatus === 11)
              this.errorResponse = 'Numero Destino Invalido';
            if(response.data.pcaResponseStatus === 80)
              this.errorResponse = 'Codigo de Pais Invalido';
          }else{
            this.responseData = response.data
            this.successResponse = response.status
            this.responseDuration = response.duration
          }
        })
        .catch(error => {
          this.errorResponse = error
          console.log("error: ",error)
        })          
      }
      else {
        alert("Por favor introduzca un numero movil valido.");
      }
      this.phone = null;   
    },
    //Trigger an event in child click when this method is fired. By sing $emit(eventName) and listen to an event in parent using $on(eventName)
    async sendMiddlewareNaeServiceTest(){
      if(this.user !== '') { //check if `user` is empty or not
        console.log("Hola Sending Test To Middleware Nae Cloud Functions")
        this.otpSentTo = this.user
        await MiddlewareNaeService.otp(this.user)
        .then(response => {
          console.log(response)
          this.responseData = response.data
          this.successResponse = response.status
          this.responseDuration = response.duration
        })
        .catch(error => {
          this.errorResponse = error.message
          console.log(error)
        })          
      }
      else {
        alert("Por favor introduzca un usuario valido Entrust.");
      }
      this.user = null;   
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
    },
    resetData(){
      this.otpSentTo = null,
      this.responseData = null,      
      this.successResponse = null,
      this.responseDuration = null,
      this.errorResponse = null
    }
  }
}
</script>

<style scoped>

.disableBtn{
  opacity:0.5;
}
.form-container{
    display: flex;
    flex-direction: column;
    margin: 12px 0;
}
.form-container .form-row{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.form-container button{
  height: 40px;
  margin: 5px 0px;
}
.form-container input{
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  margin-right: 15px;
  outline: none;
  box-sizing: border-box;
}
.form-container .btnContainer button{
  margin-right: 5px;
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
  width: 40%;
  padding:20px;
}

.test-serv-card .l-col h4{
  margin-bottom:5px;
}

.test-serv-card > .r-col{
  position:relative;
  display: flex;
  flex-direction: column;
  width: 60%;
  padding:20px;
  align-items: center;
  justify-content: space-between;
  border-left: 2px solid #ccc;
}

.test-serv-card .resultBox{
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 22px;
    width: 100%;
    height: 100%;
    border: 1px solid #9b9b9b;
    box-sizing: border-box;
}

.test-serv-card .resultBox .service-status-response{
  margin: 5px 0px;
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
