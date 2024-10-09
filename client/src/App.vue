<template>
  <div class="min-h-screen h-full w-full bg-gray-100 flex items-center justify-center">
    <WorkingTimes :userId="2" />
  </div>
</template>

<script>
import WorkingTimes from './components/WorkingTimes.vue';

export default {
  components: {
    WorkingTimes,
  },
};
</script>

<style>
/* Ajoutez des styles globaux si nécessaire */
</style>
