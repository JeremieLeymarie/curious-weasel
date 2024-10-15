<script lang="ts" setup>
import { getUsers } from '@/requests/user'
import type { SimpleUser } from '@/types'
import AutoComplete from 'primevue/autocomplete'
import { onMounted, ref, watch } from 'vue'

const { onChange, defaultValues } = defineProps<{
  onChange: (users: SimpleUser[]) => void
  defaultValues?: SimpleUser[]
}>()

const users = ref<SimpleUser[]>([])
const filteredUsers = ref<SimpleUser[]>([])
const values = ref<SimpleUser[]>(defaultValues ?? [])

onMounted(() => {
  getUsers().then((res) => {
    users.value = res
    filteredUsers.value = res
  })
})

watch(values, () => {
  onChange(values.value)
})

const search = (e: any) => {
  filteredUsers.value = users.value.filter((user) => user.username.includes(e.query))
}
</script>

<template>
  <AutoComplete
    v-bind="$attrs"
    dropdown
    :suggestions="filteredUsers"
    option-label="username"
    @complete="search"
    multiple
    v-model="values"
  />
</template>
