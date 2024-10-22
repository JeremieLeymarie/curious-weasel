<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ChartManager from './ChartManager.vue';
import { getWorkingTimes } from '@/requests/workingTimes';
import { useRoute } from 'vue-router';
import type { User, WorkingTime } from '@/types';
import { getUser } from '@/requests/user';


const workingTimes = ref<WorkingTime[]>()
const user = ref<User>()
const route = useRoute()

onMounted(() => {
    getWorkingTimes(route.params.userId as string).then(res => {
        workingTimes.value = res
    })
    getUser(route.params.userId as string).then(res => {
        user.value = res
    })
})


</script>

<template>
    <ChartManager :working-times="workingTimes" v-if="workingTimes && user" :name="user.username" />
    <p v-else>Loading...</p>
</template>