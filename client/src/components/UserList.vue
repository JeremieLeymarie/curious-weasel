<script lang="ts" setup>
import { getUsers } from '../requests/user'
import type { User } from '../types'
import { onMounted, ref } from 'vue'
import { capFL } from '../utils/string'

const users = ref<User[]>()

onMounted(() => {
  getUsers().then((res) => {
    users.value = res
  })
})

const headers = ['id', 'username', 'email', 'role']

const tdClass = 'border border-blue-900 p-2'
</script>

<template>
  <div class="mx-8 mt-4">
    <h3 class="text-2xl">Employees</h3>
    <hr class="h-1 mt-2 mb-6 bg-[#1D0455] border-0" />
    <div v-if="users" class="w-8">
      <table>
        <thead>
          <tr>
            <th :class="`${tdClass} font-bold bg-[#1D0455] text-white`" scope="col" v-for="header in headers" :key="header">
              {{ capFL(header) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <th :class="tdClass" scope="row">{{ user.id }}</th>
            <td :class="tdClass">{{ user.username }}</td>
            <td :class="tdClass">{{ user.email }}</td>
            <td :class="tdClass">{{ user.role }}</td>
            <td :class="tdClass">{{ user.average_daily }}</td>
            <td :class="tdClass">{{ user.average_weekly }}</td>
            <td :class="tdClass">
              <button name="action" type="button" class="">
                <select class="bg-[#1D0455] text-white p-1">
                  <option>Promote</option>
                  <option>Add to team</option>
                  <option>Delete</option>
                </select>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
