<template>
  <h1>Estado del Servicio</h1>
  <div class="service-monitor">
    <StatusServiceCard />
  </div>
</template>

<script>
import StatusServiceCard from '@/components/StatusServiceCard.vue'

export default {
  name: 'ServiceMonitor',
  components: {
    StatusServiceCard
  },
  data() {
    return {}
  },
  //created() {
  
  //}
}
</script>

<style scoped>
.service-monitor {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
