<script setup lang="ts">
import type { User } from '@/types'
import { ref } from 'vue'
import AppInput from './ui/AppInput.vue'
import AppButton from './ui/AppButton.vue'

const formValues = ref<Partial<User>>({})
const BASE_URL = 'http://localhost:4000/api/users'

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
</script>

<template>
    <h3 class="text-2xl text-center mt-8">Login</h3>
    <p class="text-center text-xs m-2">Login to continue</p>
    <form class="text-center mt-6">
        <div class="flex flex-col items-center m-2">
            <label for="username" class="w-[150px] inline-block">Email</label>
            <AppInput class="border-2 w-2/12" placeholder="example@gotham-city.com" />
        </div>
        <div class="flex flex-col items-center m-2">
            <label for="password" class="">Password</label>
            <AppInput class="border-2 w-2/12" placeholder="Enter your password" />
            <a class="text-xs mt-1 hover:text-[#1D0455] hover:font-bold" href="#">Forgot password?</a>
        </div>
        <div class="mt-3">
            <AppButton type="submit" class="w-20 mt-4"> Login </AppButton>
        </div>
    </form>
</template>