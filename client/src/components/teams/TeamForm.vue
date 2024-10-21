<script setup lang="ts">
import type { SimpleUser, Team, User } from '@/types'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import { BASE_API_URL } from '@/constants'

import { onMounted, ref } from 'vue'
import UserDropdown from './UserDropdown.vue'
import { getUsers } from '@/requests/user'
import { adapter } from '@/adapters'
import { appFetch } from '@/requests/fetch'

const { onSubmit } = defineProps<{ onSubmit: () => void }>()
const formValues = ref<Partial<Team>>({})
const users = ref<User[]>()


onMounted(() => {
  getUsers().then(res => {
    users.value = res
  })
})

const onManagerChange = (user: User) => {
  formValues.value.manager = user
}

const onUserChange = (users: SimpleUser[]) => {
  formValues.value.users = users
}

const submit = async (e: Event) => {
  e.preventDefault()

  await appFetch(`${BASE_API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      team: {
        name: formValues.value.name,
        user_ids: formValues.value.users?.map((user) => user.id) ?? [],
        manager_id: formValues.value.manager?.id
      }
    })
  })
  onSubmit()
}
</script>

<template>
  <Panel header="Add a team" v-if="users">
    <form class="my-4 space-y-4" @submit="submit">
      <FloatLabel>
        <InputText v-model="formValues.name" id="name" />
        <label for="name">Name</label>
      </FloatLabel>

      <FloatLabel class="!mt-8">
        <UserDropdown :onChange="onManagerChange" :multiple="false"
          :users="users.filter(user => user.role !== 'employee')" />
        <label>Manager</label>
      </FloatLabel>

      <FloatLabel class="!mt-8">
        <UserDropdown :onChange="onUserChange" multiple :users="users" />
        <label>Team members</label>
      </FloatLabel>

      <div>
        <Button label="Submit" type="submit" />
      </div>
    </form>
  </Panel>
</template>
