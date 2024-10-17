<script setup lang="ts">
import type { User } from '../types'
import DataView from 'primevue/dataview'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { deleteUser, getUsers, updateUser } from '@/requests/user'

const { users } = defineProps<{ users: User[] }>()
// TODO: sorting
</script>

<template>
  <div class="space-y-4">
    <Panel header="Employees">
      <DataView :value="users">
        <template #list="slotProps">
          <div v-if="users" in slotProps.items :key="user.id" class="my-4 p-2 space-y-2">
            <router-link :to="`/user/${user.id}`">
              <div class="space-y-2 flex justify-between items-center">
                <p v-for="user in users" :key="user.id" class="text-md">
                  <strong> {{ user.username }}</strong> -
                  <!-- {{ user.manager ? `Managed by ${manager.username}` : 'No manager' }} -->
                </p>
              </div>
            </router-link>
            <Divider />
          </div>
        </template>
      </DataView>
    </Panel>
  </div>
</template>
