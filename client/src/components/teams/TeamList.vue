<script setup lang="ts">
import DataView from 'primevue/dataview'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import type { Team } from '@/types'

const { teams } = defineProps<{ teams: Team[] }>()
// TODO: sorting
</script>

<template>
  <div class="space-y-4">
    <Panel header="Teams">
      <DataView :value="teams">
        <template #list="slotProps">
          <div v-for="(team, index) in slotProps.items" :key="index" class="my-4 p-2 space-y-2">
            <router-link :to="`/teams/${team.id}`">
              <div class="space-y-2 flex justify-between items-center">
                <p class="text-md">
                  <strong> {{ team.name }}</strong> -
                  {{ team.manager ? `Managed by ${team.manager.username}` : 'No manager' }}
                </p>

                <p>{{ team.users.length }} member(s)</p>
              </div>
            </router-link>
            <Divider />
          </div>
        </template>
      </DataView>
    </Panel>
  </div>
</template>
