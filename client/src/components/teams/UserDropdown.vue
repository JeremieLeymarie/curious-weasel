<script lang="ts" setup>
import type { SimpleUser } from '@/types'
import AutoComplete from 'primevue/autocomplete'
import { ref, watch } from 'vue'

const { onChange, defaultValues, multiple, users } = defineProps<{
  onChange: ((users: SimpleUser[]) => void) | ((user: SimpleUser) => void)
  defaultValues?: SimpleUser[]
  users: SimpleUser[]
  multiple: boolean
}>()

const filteredUsers = ref<SimpleUser[]>(users)
const values = ref<SimpleUser[] | SimpleUser>(defaultValues ?? [])


watch(values, () => {
  onChange(values.value)
})

const search = (e: any) => {
  filteredUsers.value = users.filter((user) => user.username.includes(e.query))
}
</script>

<template>
  <AutoComplete v-bind="$attrs" dropdown :suggestions="filteredUsers" option-label="username" @complete="search"
    :multiple="multiple" v-model="values" />
</template>
