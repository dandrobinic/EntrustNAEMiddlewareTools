<template>
  <h1>Estado del Servicio</h1>
  <div class="test-services">
    <TestServiceCard v-for="service in services" :key="service.id" :service="service" />
  </div>
</template>

<script>
import TestServiceCard from '@/components/TestServiceCard.vue'

export default {
  name: 'EntrustMonitor',
  components: {
    TestServiceCard
  },
  data() {
    return {
      services: [
                    {
                        "id": 1,
                        "category": "",
                        "title": "Creates & send OTP",
                        "description": "Creates & send OTP",
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
