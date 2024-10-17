<script setup lang="ts">
import type { User } from '../types'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { deleteUser, getUsers, updateUser } from '@/requests/user'

// const { users } = defineProps<{ users: User[] }>()
// TODO: sorting

let users = ref<User[]>()
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
</script>

<template>
  <!-- <div v-if="users" class=""> -->
    <Card class="">
      <template #title>Employees</template>
      <template #content>
        <DataTable :value="employees" stripedRows tableStyle="min-width: 20rem" paginator :rows="10"
          :rowsPerPageOptions="[10, 20, 30, 40]" sortField="Name" :sortOrder="-1">
          <Column field="id" header="ID">
            <!-- {{ user.id }} -->
          </Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="role" header="Role" sortable></Column>
          <Column field="daily" header="Daily avg" sortable></Column>
          <Column field="weekly" header="Weekly avg" sortable></Column>
          <Column field="info" header="Info" sortable>
            <Button>
              <RouterLink to="/users/{{ userStore.user?.id }}"></RouterLink>
            </Button>
          </Column>
        </DataTable>
      </template>
    </Card>
  <!-- </div> -->
</template>
