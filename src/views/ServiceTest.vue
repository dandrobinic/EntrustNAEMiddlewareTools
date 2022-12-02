<template>
  <div class="">
    <h1>Pruebas del Servicio</h1>
  </div>
  <div class="test-services">
    <TestServiceCard v-for="service in services" :key="service.id" :service="service" />
  </div>
</template>

<script>
import TestServiceCard from '@/components/TestServiceCard.vue'

export default {
  name: 'ServiceTest',
  components: {
    TestServiceCard
  },
  data() {
    return {
      services: [
                    {
                        "id": 1,
                        "category": "",
                        "title": "Enviar OTP Via Entrust",
                        "description": "Crea & Envia OTP al usuario a traves de Entrust por el medio seleccionado",
                        "date": "October 01 2021",
                        "time": "12:00",
                    },
                    {
                        "id": 2,
                        "category": "",
                        "title": "Enviar OTP Via PCA",
                        "description": "Crea & Envia OTP al numero telefonico ingresado a traves del servicio de mensajeria de Claro PCA (SMPP Server)",
                        "date": "January 28, 2022",
                        "time": "12:00",                        
                    }
                ]
    }
  },
  //created() {
  
  //}
}
</script>

<style scoped>
.test-services {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
