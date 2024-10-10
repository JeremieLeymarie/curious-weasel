<script setup lang="ts">
import { deleteUser, getUser, updateUser } from '@/requests/user'
import type { User } from '@/types'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  <div v-if="user">
    <div class="mb-2 flex gap-2 items-center">
      <p class="text-3xl">Account</p>
      <button
        class="text-sm text-red-800 block rounded-lg px-3 py-1 hover:underline"
        @click="handleDelete"
      >
        Delete
      </button>
    </div>
    <hr />

    <div class="mt-4">
      <p class="text-xl text-blue-900">My information</p>
      <form class="space-y-2" @submit="handleUpdate">
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
          <input id="email" name="email" placeholder="bob@mail.com" v-model="formValues.email" />
        </div>
        <button
          type="submit"
          class="bg-blue-900 text-white rounded-lg px-3 py-1 shadow-md hover:shadow-xl"
        >
          Update
        </button>
      </form>
    </div>
  </div>
  <div v-else>User not found</div>
</template>
