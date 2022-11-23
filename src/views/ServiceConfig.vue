<template>
    <div class="service-config">
      <h1>Configuración</h1>
      <div class="datacenter-info">
        <h3>Datacenter Claro</h3>
          <input :disabled="switchingDatacenter" type="radio" id="triara" value=1 v-model="selectedDatacenter">
          <label for="triara">Triara</label>
          <br>
          <input :disabled="switchingDatacenter" type="radio" id="venecia" value=2 v-model="selectedDatacenter">
          <label for="venecia">Venecia</label>
          <br>
          <br>
          <span v-if="currentDatacenter == 1"><strong>Datacenter Actual:</strong> Triara </span>
          <span v-if="currentDatacenter == 2"><strong>Datacenter Actual:</strong> Venecia </span>
      </div>
      <div class="loadingContainer" style="min-height: 50px;">
        <img style="display: none;" id="loading" class="" src="@/assets/loading.gif" height="50px" />
      </div>
      <div id="errorMessageContainer" style="display: none!important;" class="">
        <div class="error-container">
          <span class="error-text " id="errorMessage"> Mensaje error </span>
        </div>
      </div>
      <div id="successMessageContainer" class="" style="display: none!important;">
        <div class="success-container">
          <span class="success-text" id="successMessage"> Mensaje correcto </span>
        </div>
      </div>
      <v-button :disabled="switchingDatacenter" :class="{ disableBtn: switchingDatacenter }" @click="switchDatacenter()">Guardar</v-button>
    </div>
</template>
  
<script>
import Button from '@/components/Button.vue'
import MiddlewareNaeService from '@/services/MiddlewareNaeService.js'

export default {
  name: 'ServiceConfig',
  data() {
    return {
      switchingDatacenter: '',
      selectedDatacenter: '',
      currentDatacenter: '',
      mensajeError: '',
      mensajeExito: ''
    }
  },
  components:{
    'v-button': Button
  },
  mounted(){      
      this.switchingDatacenter = false;
  },
  created() {
    MiddlewareNaeService.getPcaInfo()
      .then(response => {
        console.log(response.data.pcaDatacenter)        
        this.currentDatacenter = response.data.pcaDatacenter.id;
        this.selectedDatacenter = this.currentDatacenter;
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods:{
    switchDatacenter(){
      if(confirm("¿Esta seguro de guardar los cambios realizados?")){
        this.switchingDatacenter = true;                
        console.log("this.selectedDatacenter: ",this.selectedDatacenter)
        var datacenterId = this.selectedDatacenter;
        if(datacenterId == 1){
          datacenterId = 1
        }else if(datacenterId == 2){
          datacenterId = 2
        }
        document.getElementById("loading").style.display = "block";
        console.log("datacenterId: ",datacenterId);
        MiddlewareNaeService.switchDatacenter(datacenterId)
        .then(response => {
          console.log(response)
          document.getElementById("loading").style.display = "none";
          this.switchingDatacenter = false;
          this.currentDatacenter = datacenterId;
        })
        .catch(error => {
          console.log(error)
          document.getElementById("loading").style.display = "none";
          this.switchingDatacenter = false;
        })  
        // setTimeout(() => {
        //   document.getElementById("loading").style.display = "none";
        //   this.switchingDatacenter = false;
        // }, 5000);
      }else{
        console.log("No se realizara ninguna acción")        
      }
    },    
  }
}
</script>

<style scoped>
.disableBtn{
  opacity:0.5;
}
.service-config{
  width:80%;
  margin: auto;
  text-align: left;
}
.datacenter-info{
  margin: 50px 0px 15px 0px;
}
.service-config h1{
  text-align: center;
}

button{
  margin: 15px 0px 15px 0px;
}

</style>
  