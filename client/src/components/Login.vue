<script setup lang="ts">
import type { User } from '@/types'
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const formValues = ref<Partial<User>>({})
const BASE_URL = `${import.meta.env.VITE_HOST}:4000/api/users`

const getUser = async (user: User) => {
  const response: { data: User } = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}
const test = async () => {
  console.log(formValues)
}
</script>

<template>
  <h3 class="text-2xl text-center mt-8">Login</h3>
  <p class="text-center text-xs m-2">Login to continue</p>
  <div class="text-center mt-6">
    <div class="flex flex-col items-center m-2">
      <label for="username">Email address</label>
      <InputText
        v-model="formValues.email"
        class="border-2 w-2/12"
        placeholder="example@gotham-city.com"
      />
    </div>
    <div class="flex flex-col items-center m-2">
      <label for="password" class="">Password</label>
      <InputText
        v-model="formValues.password"
        type="password"
        class="border-2 w-2/12"
        placeholder="Enter your password"
      />
      <a class="text-xs mt-1 hover:text-[#1D0455] hover:font-bold" href="#">Forgot password?</a>
    </div>
    <div class="mt-3">
      <Button @click="test" class="w-20 mt-4"> Login </Button>
    </div>
  </div>
</template>
