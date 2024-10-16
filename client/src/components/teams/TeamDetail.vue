<script lang="ts" setup>
import { getTeam, updateTeam } from '@/requests/teams'
import type { SimpleUser, Team } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Chip from 'primevue/chip'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import UserDropdown from './UserDropdown.vue'

const route = useRoute()
const team = ref<Team>()

const isModalOpen = ref(false)
const updatedMembers = ref<SimpleUser[]>()

const getData = () => {
  getTeam(route.params.teamId as string).then((res) => {
    team.value = res
  })
}

onMounted(getData)
watch(() => route.params.teamId, getData)

const onChangeMembers = (users: SimpleUser[]) => {
  updatedMembers.value = users
}

const submitChangeMembers = async () => {
  if (!team.value) return
  isModalOpen.value = false
  await updateTeam({ id: team.value.id, user_ids: updatedMembers.value?.map(({ id }) => id) })
  getData()
}
</script>

<template>
  <Panel v-if="team" :header="`Team ${team.name}`">
    <div v-if="team.manager" class="flex gap-2">
      <p class="my-2 font-semibold">Managed by:</p>
      <router-link :to="`/user/${team.manager.id}`">
        <Chip :label="team.manager.username"
      /></router-link>
    </div>
    <Divider />
    <div class="space-y-2">
      <p>Members:</p>
      <div class="flex gap-2 flex-wrap">
        <router-link :to="`/user/${user.id}`" v-for="user in team.users" :key="user.id"
          ><Chip :label="user.username"
        /></router-link>
        <Button outlined size="small" icon="pi pi-pencil" @click="isModalOpen = true"></Button>
      </div>
    </div>
  </Panel>
  <p v-else>Loading...</p>

  <Dialog
    v-model:visible="isModalOpen"
    modal
    header="Add member to team"
    :style="{ width: '40vw', minWidth: '400px' }"
    :dismissable-mask="true"
  >
    <span class="text-surface-500 dark:text-surface-400 block my-2"
      >Add or remove team members.</span
    >

    <UserDropdown
      :on-change="onChangeMembers"
      :default-values="team?.users ?? []"
      :multiple="true"
    />
    <div class="flex justify-end gap-2 mt-4">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="isModalOpen = false"
      ></Button>
      <Button type="button" label="Save" @click="submitChangeMembers"></Button>
    </div>
  </Dialog>
</template>
