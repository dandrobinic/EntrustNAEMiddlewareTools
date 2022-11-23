<template>
    <div class="status-serv-card">     
      <!-- <div class="form-container">
          <input id="user" type="text" placeholder="User" v-model="user">
      </div> -->
      <div class="datacenter-info">
        <h3>Información del Servicio</h3>
        <!-- <input type="radio" id="triara" value="Triara" v-model="selectedDatacenter" :disabled="disableSelector">
        <label for="triara">Triara</label>
        <br>
        <input type="radio" id="venecia" value="Venecia" v-model="selectedDatacenter" :disabled="disableSelector">
        <label for="venecia">Venecia</label>
        <br>           -->
        <div class="summarize-info">
          <p>Datacenter Actual: {{ selectedDatacenter }}</p>
          <p>Tiempo de conexión:<span> 75445 hs</span></p>
          <p>Tiempo promedio <small>(ultimas 50 transacciones)</small>:<span> 744ms</span></p>
          <p>Total OTP solicitados:<span> 1.8 mill</span></p>
        </div>
      </div>
    
    
      <div class="resultBox">
        <span >Date:{{ getCurrentDate() }}</span>
        <div class="chart-container">
          <v-bar-chart>chart-container</v-bar-chart>
        </div>
      </div>
      <!-- <v-button :disabled="!user" :class="{ disableBtn: !user }" @click="sendMiddlewareNaeServiceTest">Test</v-button>
       -->
  </div>
</template>

<script>
// import Button from '@/components/Button.vue'
import MiddlewareNaeService from '@/services/MiddlewareNaeService.js'
import BarChart from '@/components/BarChart.vue'

export default {
data() {
    return {      
      message: '',
      responseData: null,
      responseStatus: null,
      responseDuration: null,
      selectedDatacenter: '',
      disableSelector: true 
    }
  },
  components:{
   'v-bar-chart': BarChart
  },
  mounted(){    
    // this.sendMiddlewareNaeServiceTest();
    this.selectedDatacenter = 'Venecia';
  },
  props: {
    service: {
      type: Object,
      required: true
    }    
  },
  // components:{
  //  'v-button': Button
  // },
  methods:{
    //Trigger an event in child click when this method is fired. By sing $emit(eventName) and listen to an event in parent using $on(eventName)
    sendMiddlewareNaeServiceTest(){
    console.log("Sending Test using dgard as a user To the Middleware Nae Cloud Functions")
    MiddlewareNaeService.otp('dgard')
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
    getCurrentDate() {
      const current = new Date();
      const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
      return date;
    }
  }
}
</script>

<style scoped>
.form-container{
    margin: 12px 0;
}
.status-serv-card {
  display: flex;
  flex-direction: row;
  width: 80%;
  text-align: center;
  border: 1px solid #9b9b9b;
  margin: 20px 30px 20px 20px;
  border-radius: 5px;
  align-items: center;
}

.status-serv-card .datacenter-info{
    width: 50%;
    height: 100%;
    text-align: left;
    padding: 25px 25px;
}

.status-serv-card .resultBox{
    width: 50%;
    height: 100%;
    border-left: 1px solid #9b9b9b;
    padding: 25px 25px;
    margin: 0px 15px 0px 0px;
}

.summarize-info p{
  font-size: 12px;
}

/* .status-serv-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
} */

</style>
