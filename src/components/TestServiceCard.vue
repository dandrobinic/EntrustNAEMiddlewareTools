<template>
    <div class="test-serv-card">
      <div class="l-col">
        <h4>{{ service.title }}</h4>
        <span>Last Time Launched:{{ service.time }} on {{ service.date }}</span>
        <div v-if="responseStatus == 201" class="service-status-response">OTP Succesfully Created - Service is Active</div>
        <div v-if="responseStatus == 201" class="service-status-response">Time Response: {{responseDuration}} ms</div>
      </div>
      <div class="r-col">
        <v-button @click="sendMiddlewareNaeServiceTest">Test</v-button>
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
      console.log("Hola Sending Test To Middleware Nae Cloud Functions")
      MiddlewareNaeService.otp()
      .then(response => {
        console.log(response)
        this.responseData = response.data
        this.responseStatus = response.status
        this.responseDuration = response.duration
      })
      .catch(error => {
        console.log(error)
      })     
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
    }
  }
}
</script>

<style scoped>
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
  width: 75%;
  padding:20px;
}
.test-serv-card > .r-col{
  display: flex;
  flex-direction: column-reverse;
  width: 25%;
  padding:20px;
  align-items: flex-end;
}

.test-serv-card:hover {
  /* transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2); */
}

.event-link {
  color: #2c3e50;
  text-decoration: none;
}
</style>
