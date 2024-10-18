<script setup lang="ts">
import type { User, UserWithoutId } from '@/types'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const formValues = ref<Partial<UserWithoutId>>({})
const BASE_URL = `${import.meta.env.VITE_HOST}:4000/api/users`
const route = useRoute()
const router = useRouter()

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

const handleCreate = async (e: Event) => {
  e.preventDefault()

  if (!formValues.value.email || !formValues.value.username) {
    // TODO: handle validation
    return
  }

  await createUser(formValues.value as User)
  show();
  router.push('/');
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
        <InputText
          id="username"
          name="username"
          placeholder="Enter your name"
          v-model="formValues.username"
          class="border-2 w-2/12"
          required
        />
      </div>
      <div class="flex flex-col items-center m-3">
        <label for="email">Email address</label>
        <InputText
          id="email"
          name="email"
          placeholder="example@gotham-city.com"
          class="border-2 w-2/12"
          v-model="formValues.email"
          required
        />
      </div>
      <div class="flex flex-col items-center m-3">
        <label for="password">Password</label>
        <InputText
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          class="border-2 w-2/12"
          v-model="formValues.hash_password" required
        />
      </div>
      <div class="flex flex-col items-center m-3">
        <label for="role">Role</label>
        <Select id="role-select" v-model="selectedRole" :options="roles" placeholder="Select a role" class="border-2 w-2/12" required></Select>
      </div>
      <Toast />
      <Button type="submit" label="Error" class="w-20 mt-4"> Create </Button>
    </form>
  </div>
</template>
