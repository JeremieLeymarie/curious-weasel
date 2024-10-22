<script setup lang="ts">
import type { User, UserWithoutId } from '@/types'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const formValues = ref<Partial<UserWithoutId>>({})
const router = useRouter()


const handleCreate = async (e: Event) => {
  e.preventDefault()
  if (formValues.value.email || formValues.value.username || formValues.value.hash_password) {
    let data = JSON.stringify({
      user: {
        email: formValues.value.email,
        hash_password: formValues.value.hash_password,
        username: formValues.value.username
      }
    })
    let res = await fetch(`${import.meta.env.VITE_HOST}:4000/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 201) {
      router.push(`/users`)
      show();
    } else {
      console.log("bad credential")
    }
  } else {
    console.log('no email or password')
  }
}
const selectedRole = ref();
const roles = ref([
  'Employee',
  'Manager'
]);

const toast = useToast()
const show = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Your account has been created.', life: 3000 });
};

</script>

<template>
  <h3 class="text-2xl text-center mt-8">Create a new account</h3>
  <div>
    <form class="text-center mt-6" @submit="handleCreate">
      <div class="flex flex-col items-center m-3">
        <label for="name">Name</label>
        <InputText id="username" name="username" placeholder="Enter your name" v-model="formValues.username"
          class="border-2 w-2/12 min-w-[200px]" required />
      </div>
      <div class="flex flex-col items-center m-3">
        <label for="email">Email address</label>
        <InputText id="email" name="email" placeholder="example@gotham-city.com" class="border-2 w-2/12 min-w-[200px]"
          v-model="formValues.email" required />
      </div>
      <div class="flex flex-col items-center m-3">
        <label for="password">Password</label>
        <InputText id="password" name="password" type="password" placeholder="Create a password"
          class="border-2 w-2/12 min-w-[200px]" v-model="formValues.hash_password" required />
      </div>
      <Toast />
      <Button type="submit" label="Error" class="w-20 mt-4"> Create </Button>
    </form>
  </div>
</template>
