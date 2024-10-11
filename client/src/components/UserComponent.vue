<script setup lang="ts">
import { deleteUser, getUser, updateUser } from '@/requests/user'
import type { User } from '@/types'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppInput from './ui/AppInput.vue'
import AppButton from './ui/AppButton.vue'

const user = ref<User>()

const formValues = ref<Partial<User>>({})

const route = useRoute()
const router = useRouter()

watch(
  () => route.params.id,
  (id) => {
    getUser(id as string).then((res) => {
      user.value = res
      formValues.value = res
    })
  }
)

onMounted(() => {
  getUser(route.params.id as string).then((res) => {
    user.value = res
    formValues.value = res
  })
})

const handleUpdate = (event: Event) => {
  event.preventDefault()

  if (!user.value?.id) return
  // TODO: use zod for validation?
  updateUser({
    id: user.value.id,
    username: formValues.value.username ?? user.value.username,
    email: formValues.value.email ?? user.value.username
  })
}

const handleDelete = () => {
  if (!user.value?.id) return
  deleteUser(user.value?.id)

  router.push('/')
}
</script>

<template>
  <div v-if="user" class="ml-8 mt-3">
    <div class="mb-2 flex gap-2 items-center">
      <h2 class="text-2xl">Account</h2>
      <AppButton variant="danger" @click="handleDelete"> Delete </AppButton>
    </div>
    <hr class="h-1 mr-16 bg-[#1D0455] border-0" />
    <div class="mt-4">
      <div class="flex">
        <h3 class="text-xl mr-4 mb-2">My information</h3>
        <AppButton type="submit" class="ml-4 mb-2"> Edit </AppButton>
      </div>
      <form class="" @submit="handleUpdate">
        <div class="flex mt-4">
          <label for="name" class="w-[150px] inline-block">Name</label>
          <AppInput id="name" name="name" placeholder="James Gordon" v-model="formValues.username"
            class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px]" />
        </div>
        <div class="flex mt-4">
          <label for="email" class="w-[150px] inline-block">Email address</label>
          <AppInput id="email" name="email" placeholder="example@gotham-city.com" v-model="formValues.email"
            class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px]" />
        </div>
        <div class="flex mt-4">
          <label for="number" class="w-[150px] inline-block">Phone number</label>
          <AppInput id="number" name="number" placeholder="+1 223 4984" v-model="formValues.number"
            class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px]" />
        </div>
      </form>
    </div>
    <div class="mt-10">
      <h3 class="text-xl mr-4 mb-2">Job information</h3>
      <div class="flex mt-4">
        <h4 class="w-[165px] inline-block">Job title</h4>
        <span class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px]">Police Commissionner</span>
      </div>
      <div class="flex mt-4">
          <h4 class="w-[165px] inline-block">Manager</h4>
          <span class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px]">Mayor Hilton Hill</span>
        </div>
      <div class="flex mt-4">
          <h4 class="w-[165px] inline-block">Team(s)</h4>
          <span class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px] mr-2">Police Dpt</span>
          <span class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px] mr-2">Crime Unit</span>
          <span class="bg-[#1D0455] rounded text-white p-1 text-center w-[250px] mr-2">Batman Lover</span>
      </div>
    </div>
  </div>
  <div v-else>User not found</div>
</template>
