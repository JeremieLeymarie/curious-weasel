<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TeamForm from './TeamForm.vue'
import TeamList from './TeamList.vue'
import { getTeams } from '@/requests/teams'
import type { Team } from '@/types'

const teams = ref<Team[]>()

const getData = async () => {
  return getTeams().then((res) => {
    teams.value = res.reverse()
  })
}

onMounted(getData)
</script>

<template>
  <div class="space-y-4">
    <TeamForm :on-submit="getData" />
    <TeamList v-if="teams" :teams="teams" />
  </div>
</template>
