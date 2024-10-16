<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ChartManager from './ChartManager.vue';
import { getWorkingTimes } from '@/requests/workingTimes';
import { useRoute } from 'vue-router';
import type { WorkingTime } from '@/types';
import { adapter } from '@/adapters';


const workingTimes = ref<WorkingTime[]>()
const route = useRoute()

onMounted(() => getWorkingTimes(route.params.userId as string).then(res => {
    workingTimes.value = res.map(adapter.from.api.workingTime)
}))


</script>

<template>
    <ChartManager :working-times="workingTimes" v-if="workingTimes" />
    <p v-else>Loading...</p>
</template>