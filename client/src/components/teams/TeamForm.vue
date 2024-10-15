<script setup lang="ts">
import type { SimpleUser, Team, User } from '@/types'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import { BASE_API_URL } from '@/constants'

import { ref } from 'vue'
import UserDropdown from './UserDropdown.vue'

const { onSubmit } = defineProps<{ onSubmit: () => void }>()
const formValues = ref<Partial<Team>>({})

const onUserChange = (users: SimpleUser[]) => {
  formValues.value.users = users
}

console.log(onSubmit)

const submit = async (e: Event) => {
  e.preventDefault()

  await fetch(`${BASE_API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      team: {
        name: formValues.value.name,
        user_ids: formValues.value.users?.map((user) => user.id) ?? []
      }
    })
  })
  onSubmit()
}
</script>

<template>
  <Panel header="Add a team">
    <form class="my-4 space-y-4" @submit="submit">
      <FloatLabel>
        <InputText v-model="formValues.name" id="name" />
        <label for="name">Name</label>
      </FloatLabel>

      <UserDropdown :onChange="onUserChange" />
      <div>
        <Button label="Submit" type="submit" />
      </div>
    </form>
  </Panel>
</template>
