<script setup lang="ts">
import type { User, UserWithoutId } from '@/types'
import { ref } from 'vue'

const formValues = ref<Partial<UserWithoutId>>({})
const BASE_URL = 'http://localhost:4000/api/users'

const createUser = async (user: UserWithoutId) => {
  const response: { data: UserWithoutId } = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

const handleCreate = (e: Event) => {
  e.preventDefault()

  if (!formValues.value.email || !formValues.value.username) {
    // TODO: handle validation
    return
  }

  createUser(formValues.value as User)
}
</script>

<template>
  <div>
    <form class="space-y-2" @submit="handleCreate">
      <div class="space-x-4 mt-2">
        <label for="username" class="w-[150px] inline-block">Username</label>
        <input
          class="px-2"
          id="username"
          name="username"
          placeholder="bob_bidou"
          v-model="formValues.username"
        />
      </div>
      <div class="space-x-4">
        <label for="email" class="w-[150px] inline-block">Email address</label>
        <input
          class="px-2"
          id="email"
          name="email"
          placeholder="bob@mail.com"
          v-model="formValues.email"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-900 text-white rounded-lg px-3 py-1 shadow-md hover:shadow-xl"
      >
        Create
      </button>
    </form>
  </div>
</template>
