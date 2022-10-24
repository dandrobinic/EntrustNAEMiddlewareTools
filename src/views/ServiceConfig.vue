<template>
    <div class="service-config">
      <h1>Configuración</h1>
      <div class="datacenter-info">
        <h3>Datacenter Claro</h3>
          <input type="radio" id="triara" value="Triara" v-model="selectedDatacenter">
          <label for="triara">Triara</label>
          <br>
          <input type="radio" id="venecia" value="Venecia" v-model="selectedDatacenter">
          <label for="venecia">Venecia</label>
          <br>
          <br>
          <span><strong>Datacenter Actual:</strong> {{ currentDatacenter }}</span>
      </div>
      
      <v-button :disabled="false" :class="{ disableBtn: false }" @click="confirm('¿Esta seguro de guardar los cambios realizados?')">Guardar</v-button>
    </div>
</template>
  
<script>
import Button from '@/components/Button.vue'

export default {
  name: 'ServiceConfig',
  data() {
    return {
      selectedDatacenter: '',
      currentDatacenter: ''
    }
  },
  components:{
    'v-button': Button
  },
  mounted(){    
    // this.sendMiddlewareNaeServiceTest();      
    this.currentDatacenter = 'Venecia';  
    this.selectedDatacenter = this.currentDatacenter;      
  }
  //created() {
  
  //},
  ,methods:{

  }
}
</script>

<style scoped>

.service-config{
  width:80%;
  margin: auto;
  text-align: left;
}
.datacenter-info{
  margin: 50px 0px 50px 0px;
}
.service-config h1{
  text-align: center;
}

button{
  margin: 15px 0px 15px 0px;
}

</style>
  