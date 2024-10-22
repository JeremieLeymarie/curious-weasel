<script setup lang="ts">
import type { SimpleUser, Team, User } from '@/types'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Panel from 'primevue/panel'
import Button from 'primevue/button'

import { onMounted, ref } from 'vue'
import UserDropdown from './UserDropdown.vue'
import { getUsers } from '@/requests/user'
import { createTeam } from '@/requests/teams'

const { onSubmit } = defineProps<{ onSubmit: () => void }>()
const formValues = ref<Partial<Team>>({})
const users = ref<User[]>()


onMounted(() => {
  getUsers().then(res => {
    users.value = res
  })
})

const onManagerChange = (users: SimpleUser[]) => {
  formValues.value.manager = users[0]
}

const onUserChange = (users: SimpleUser[]) => {
  formValues.value.users = users
}

const submit = async (e: Event) => {
  e.preventDefault()

  // TODO: handle errors in a cleaner way
  if (!formValues.value.name || !formValues.value.manager?.id)
    return alert("Team name and managers are required")

  await createTeam({
    name: formValues.value.name,
    user_ids: formValues.value.users?.map((user) => user.id) ?? [],
    manager_id: formValues.value.manager?.id
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
