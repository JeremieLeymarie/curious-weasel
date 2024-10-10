<script lang="ts" setup>
import { getUsers } from '@/requests/user'
import type { User } from '@/types'
import { onMounted, ref } from 'vue'
import { capFL } from '../utils/string'

const users = ref<User[]>()

onMounted(() => {
  getUsers().then((res) => {
    users.value = res
  })
})

const headers = ['id', 'username', 'email']

const tdClass = 'border border-blue-900 p-2'
</script>

<template>
  <p class="text-3xl">Employees</p>
  <hr class="h-1 mt-2 mb-6 bg-[#1343ad] border-0" />
  <div v-if="users">
    <table>
      <thead>
        <tr>
          <th
            :class="`${tdClass} font-bold text-blue-900`"
            scope="col"
            v-for="header in headers"
            :key="header"
          >
            {{ capFL(header) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th :class="tdClass" scope="row">{{ user.id }}</th>
          <td :class="tdClass">{{ user.username }}</td>
          <td :class="tdClass">{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>Loading...</div>
</template>
