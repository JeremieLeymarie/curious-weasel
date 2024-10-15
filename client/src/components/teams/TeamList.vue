<script setup lang="ts">
import DataView from 'primevue/dataview'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
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
            <div class="flex gap-4 items-center">
              <p class="px-2 text-md font-semibold">{{ team.name }}</p>
              <div class="flex gap-2 flex-wrap">
                <router-link :to="`/user/${user.id}`" v-for="user in team.users" :key="user.id"
                  ><Chip :label="user.username"
                /></router-link>
              </div>
            </div>
            <Divider />
          </div>
        </template>
      </DataView>
    </Panel>
  </div>
</template>
