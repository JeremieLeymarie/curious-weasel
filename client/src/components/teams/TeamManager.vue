<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TeamForm from './TeamForm.vue'
import TeamList from './TeamList.vue'
import { getTeams } from '@/requests/teams'
import type { Team } from '@/types'

const teams = ref<Team[]>()

onMounted(() => {
  getTeams().then((res) => {
    teams.value = res
  })
})
</script>

<template>
  <div class="space-y-4">
    <TeamForm />
    <TeamList v-if="teams" :teams="teams" />
  </div>
</template>
