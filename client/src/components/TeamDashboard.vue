<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ChartManager from './ChartManager.vue';
import { getTeamWorkingTimes } from '@/requests/workingTimes';
import { useRoute } from 'vue-router';
import type { Team, WorkingTime } from '@/types';
import { getTeam } from '@/requests/teams';

const workingTimes = ref<WorkingTime[]>()
const team = ref<Team>()
const route = useRoute()

onMounted(() => {
    getTeamWorkingTimes(route.params.teamId as string).then(res => {
        workingTimes.value = res
    })
    getTeam(route.params.teamId as string).then(res => {
        team.value = res
    })
})


</script>

<template>
    <ChartManager :working-times="workingTimes" v-if="workingTimes && team" :team="team" :name="team?.name" />
    <p v-else>Loading...</p>
</template>