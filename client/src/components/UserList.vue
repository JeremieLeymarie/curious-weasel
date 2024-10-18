<script lang="ts" setup>
import type { User } from '../types'
import { onMounted, ref } from 'vue'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { deleteUser, getUsers, updateUser } from '@/requests/user'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useUserStore } from '@/stores/user'

let users = ref<User[]>()
const userStore = useUserStore();

onMounted(() => {
  getUsers().then((res) => {
    users.value = getModifyUsers(res)
  })
})

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
  if (user.role == 'manager') {
    await updateUser({
      role: 'employee',
      id: user.id,
      username: user.username,
      email: user.email
    })
    getUsers().then((res) => {
      users.value = getModifyUsers(res)
    })
  }
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
    <div v-if="users">
      <Card class="">
        <template #content>
          <DataTable :value="users" stripedRows tableStyle="min-width: 50rem" paginator :rows="10"
            :rowsPerPageOptions="[10, 20, 30, 40]" sortField="username" :sortOrder="1">
            <Column field="id" header="ID" sortable></Column>
            <Column field="username" header="Name" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column field="role" header="Role" sortable></Column>
            <Column field="Daily" header="Daily avg" sortable></Column>
            <Column field="weekly" header="Weekly avg" sortable></Column>
            <Column header="Info" class="w-24" v-if="userStore.user?.role == 'general_manager'" sortable>
              <template #body="user">
                <Button size="small" @click="handleUpdate(user.data)" v-if="user.data.role == 'employee'">Promote</Button>
                <Button size="small" @click="handleUpdate(user.data)" v-if="user.data.role == 'manager'">Demote</Button>
                <Button size="small" class="mt-1" severity="danger" @click="handleDelete(user.data.id)">Delete</Button>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
