<script lang="ts" setup>
import type { User } from '../types'
import { onMounted, ref } from 'vue'
import { capFL } from '../utils/string'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { deleteUser, getUsers, updateUser } from '@/requests/user'

let users = ref<User[]>()
onMounted(() => {
  getUsers().then((res) => {
    users.value = getModifyUsers(res)
  })
})

const headers = ['id', 'username', 'email', 'role', 'daily', 'weekly']

const tdClass = 'border border-blue-900 p-2'
const getModifyUsers = (res: any) => {
  let newUsers = res
  for (let i = 0; i < newUsers.length; i++) {
    if (newUsers[i].working_times) {
      newUsers[i].Daily = calculate1DayDuration(newUsers[i].working_times)
      newUsers[i].weekly = calculate7DayDuration(newUsers[i].working_times)
    } else {
      newUsers[i].Daily = '0 seconds'
      newUsers[i].weekly = '0 seconds'
    }
  }

  return newUsers
}
const calculate7DayDuration = (times: any[]) => {
  let lastweek = []
  if (times.length < 7) {
    for (let i = 0; i < times.length; i++) {
      lastweek.push(times[i])
    }
  } else {
    for (let i = 0; i < 7; i++) {
      lastweek.push(times[i])
    }
  }

  if (lastweek[0]) {
    const timeInSeconds = lastweek.reduce((total, time) => {
      return total + differenceInSeconds(new Date(time.end), new Date(time.start))
    }, 0)
    const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 })

    const formatted = formatDuration(duration)

    return formatted
  } else {
    return '0 seconds'
  }
}

const calculate1DayDuration = (times: any[]) => {
  if (times[0]) {
    const timeInSeconds = differenceInSeconds(
      new Date(times[times.length - 1].end),
      new Date(times[times.length - 1].start)
    )

    const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 })

    const formatted = formatDuration(duration)

    return formatted
  } else {
    return '0 seconds'
  }
}

const handleDelete = async (id: string) => {
  await deleteUser(id)
  getUsers().then((res) => {
    users.value = getModifyUsers(res)
  })
}
const handleUpdate = async (user: User) => {
  if (user.role == 'employee') {
    await updateUser({
      role: 'manager',
      id: user.id,
      username: user.username,
      email: user.email
    })
    getUsers().then((res) => {
      users.value = getModifyUsers(res)
    })
  }
}
</script>

<template>
  <div class="mx-8 mt-4">
    <h3 class="text-2xl">Employees</h3>
    <hr class="h-1 mt-2 mb-6 bg-[#1D0455] border-0" />
    <div v-if="users" class="w-8">
      <table>
        <thead>
          <tr>
            <th
              :class="`${tdClass} font-bold bg-[#1D0455] text-white`"
              scope="col"
              v-for="header in headers"
              :key="header"
            >
              {{ capFL(header) }}
            </th>
            <th :class="`${tdClass} font-bold bg-[#1D0455] text-white`" colspan="3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <th :class="tdClass" scope="row">{{ user.id }}</th>
            <td :class="tdClass">{{ user.username }}</td>
            <td :class="tdClass">{{ user.email }}</td>
            <td :class="tdClass">{{ user.role }}</td>
            <td :class="tdClass">{{ user.Daily }}</td>
            <td :class="tdClass">{{ user.weekly }}</td>
            <td :class="tdClass">
              <button
                v-if="user.role === 'employee'"
                class="bg-[#1D0455] text-white p-1"
                @click="handleUpdate(user)"
              >
                Promote
              </button>
            </td>
            <td :class="tdClass">
              <button class="bg-[#1D0455] text-white p-1">Add</button>
            </td>
            <td :class="tdClass">
              <button class="bg-[#1D0455] text-white p-1" @click="handleDelete(user.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
