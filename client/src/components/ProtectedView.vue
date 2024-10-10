<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import type { UserRole } from '@/types'

const { authorizedRoles = ['manager', 'general_manager'], resourceId } = defineProps<{
  authorizedRoles?: UserRole[]
  resourceId?: string
}>()
const { user } = useUserStore()

const isAuthorized = authorizedRoles.includes(user.role) || user.id === resourceId
console.log({ userId: user.id, resourceId })
</script>

<template>
  <slot v-if="isAuthorized"></slot>
  <p v-else>You don't have authorization on this page.</p>
</template>
