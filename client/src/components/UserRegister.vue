<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

const router = useRouter()

const email = ref(null)
const password = ref(null)
const username = ref(null)
const userStore = useUserStore();
async function Register() {
  let data = JSON.stringify({
    user: {
      email: email.value,
      hash_password: password.value,
      username: username.value
    }
  })
  if (password.value != null && email.value != null && username.value) {
    let res = await fetch(`${import.meta.env.VITE_HOST}:4000/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 201) {
      localStorage.clear();
      let user: User = await res.json()
      userStore.setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      router.push(`/`)
    } else {
      console.log("bad credential")
    }
  } else {
    console.log('no email or password')
  }
}
</script>

<template>
  <h3 class="text-2xl text-center mt-8">Register to your app</h3>
  <div>
    <div class="text-center mt-6">
      <div class="flex flex-col items-center m-2">
        <label for="email">Email address</label>
        <InputText id="email" name="email" placeholder="example@gotham-city.com" class="border-2 w-3/12 min-w-[200px]"
          v-model="email" />
      </div>
      <div class="flex flex-col items-center m-2">
        <label for="username">username address</label>
        <InputText id="username" name="username" placeholder="example@gotham-city.com"
          class="border-2 w-3/12 min-w-[200px]" v-model="username" />
      </div>
      <div class="flex flex-col items-center m-2">
        <label for="password">Password</label>
        <InputText id="password" type="password" placeholder="Create a password" class="border-2 w-3/12 min-w-[200px]"
          v-model="password" />
      </div>
      <Button @click="Register" type="button" class="w-20 mt-4"> Register </Button>
      <p>Or</p>
      <router-link to="/login">
        Login
      </router-link>
    </div>
  </div>
</template>
