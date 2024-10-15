<script setup lang="ts">
import type { User, UserWithoutId } from '@/types'
import { ref } from 'vue'
import AppInput from './ui/AppInput.vue'
import AppButton from './ui/AppButton.vue'

const formValues = ref<Partial<UserWithoutId>>({})
const BASE_URL = `${import.meta.env.VITE_HOST}:4000/api/users`

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
  <h3 class="text-2xl text-center mt-8">Create a new account</h3>
  <div>
    <form class="text-center mt-6" @submit="handleCreate">
      <div class="flex flex-col items-center m-2">
        <label for="name">Name</label>
        <AppInput
          id="username"
          name="username"
          placeholder="Enter your name"
          v-model="formValues.username"
          class="border-2 w-2/12"
        />
      </div>
      <div class="flex flex-col items-center m-2">
        <label for="email">Email address</label>
        <AppInput
          id="email"
          name="email"
          placeholder="example@gotham-city.com"
          class="border-2 w-2/12"
          v-model="formValues.email"
        />
      </div>
      <div class="flex flex-col items-center m-2">
        <label for="password">Password</label>
        <AppInput
          id="password"
          name="password"
          placeholder="Create a password"
          class="border-2 w-2/12"
          v-model="formValues.password"
        />
      </div>
      <div class="flex flex-col items-center m-2">
        <label for="role">Role</label>
        <select id="role-select" v-model="selectedRole" class="border-2 w-2/12">
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      <AppButton type="submit" class="w-20 mt-4"> Create </AppButton>
    </form>
  </div>
</template>
