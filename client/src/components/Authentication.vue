<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const router = useRouter()
const route = useRoute()

const email = ref(null)
const password = ref(null)
async function login() {
  let data = JSON.stringify({
    working_time: {
      email: email.value,
      password: password.value
    }
  })
  if (password.value != null && email.value != null) {
    let res = await fetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${route.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 200) {
      router.push(`/`)
    }
  } else {
    console.log('no email or password')
  }
}
</script>

<template>
  <div class="ml-8">
    <p class="text-2xl my-4">Connections</p>
    <hr class="h-1 mb-4 ml-1 mr-16 bg-[#1343ad] border-0" />
    <div class="flex space-x-10">
      <div class="p-2">
        <p>Email</p>
        <InputText v-model="email" type="text" name="" id="" class="border-2" />
      </div>
      <div class="p-2">
        <p>Password</p>
        <InputText v-model="password" type="password" name="" id="" class="border-2" />
      </div>
    </div>
    <Button @click="login"> Submit </Button>
  </div>
</template>
