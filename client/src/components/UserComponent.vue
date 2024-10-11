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
    <hr class="h-1 mr-16 bg-[#1D0455] border-0"/>
    <div class="mt-4">
      <div class="flex">
        <h3 class="text-xl mr-4 mb-2">My information</h3>
        <AppButton type="submit" class="ml-4 mb-2"> Edit </AppButton>
      </div>
      <form class="space-y-2" @submit="handleUpdate">
        <div class="space-x-4 mt-4">
          <label for="username" class="w-[150px] inline-block">Username</label>
          <AppInput id="username" name="username" placeholder="bob_bidou" v-model="formValues.username"
            class="bg-[#1D0455] rounded text-white p-1 text-center" />
        </div>
        <div class="space-x-4">
          <label for="email" class="w-[150px] inline-block">Email address</label>
          <AppInput id="email" name="email" placeholder="bob@mail.com" v-model="formValues.email"
            class="bg-[#1D0455] rounded text-white p-1 text-center" />
        </div>
      </form>
    </div>
  </div>
  <div v-else>User not found</div>
</template>
