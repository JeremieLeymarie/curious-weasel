<script lang="ts" setup>
import type { User } from '../types'
import { computed, onMounted, ref } from 'vue'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { deleteUser, getUsers, updateUser } from '@/requests/user'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useUserStore } from '@/stores/user'
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router'
import { Network } from '@capacitor/network'
import { isOffline } from '@/requests/fetch'


type ListUser = User & { daily: string; weekly: string }
let users = ref<ListUser[]>()
const userStore = useUserStore();
const router = useRouter()

const isDeleteDisabled = ref(false)

Network.addListener('networkStatusChange', status => {
  isDeleteDisabled.value = !status.connected
  getUsers().then((res) => {
    users.value = formatUserList(res)
  })
});

onMounted(() => {
  getUsers().then((res) => {
    users.value = formatUserList(res)
  })
  isOffline().then(offline => {
    isDeleteDisabled.value = offline
  })
})

const formatUserList = (users: User[]): ListUser[] => {
  const formattedUsers = users.map(user => {
    return {
      ...user,
      ...getUserAverageWT(user),
    }
  }
  )

  return formattedUsers

}

const getUserAverageWT = (user: User) => {

  if (user.workingTimes) {
    return {
      ...user, daily: calculate1DayDuration(user.workingTimes),
      weekly: calculate7DayDuration(user.workingTimes)
    }
  } else {
    return {
      ...user, daily: "0 seconds", weekly: '0 seconds'
    }
  }

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
    users.value = formatUserList(res)
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
      users.value = formatUserList(res)
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
      users.value = formatUserList(res)
    })
  }
}

const currentMenuUser = ref<User>()
const MenuItems = computed(() => {
  const user = currentMenuUser.value

  if (!user) return []

  return [
    {
      label: 'Options',
      items: [
        ...(user.role == "manager" ? [] : [{
          label: "Promote",
          command: () => {
            handleUpdate(user)
          }
        }]),
        ...(user.role == "employee" ? [] : [{
          label: "Demote",
          command: () => {
            handleUpdate(user)
          }
        }]),
        ...(isDeleteDisabled.value ? [] : [{
          label: 'Delete',
          command: () => {
            handleDelete(user.id)
          }
        }])
      ]
    },
    {
      label: 'Profile',
      items: [
        {
          label: 'Working Time',
          command: () => {
            router.push('/workingtime/' + currentMenuUser.value?.id);
          }
        },
        {
          label: 'Account',
          command: () => {
            router.push('/user/' + currentMenuUser.value?.id);
          }
        },
        {
          label: 'Dashboard',
          command: () => {
            router.push('/chart-manager/' + currentMenuUser.value?.id);

          }
        }
      ]
    }
  ]
})

const menu = ref();
const Toggle = (event: Event, user: User) => {
  currentMenuUser.value = user
  menu.value.toggle(event);
};
</script>

<template>
  <div class="mx-8 mt-4">
    <div class="flex gap-4 items-center">
      <h3 class="text-2xl">Employees</h3>
      <RouterLink to="/user/new">
        <Button icon="pi pi-plus" class="!text-lg" outlined rounded />
      </RouterLink>
    </div>
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
                <Button type="button" icon="pi pi-ellipsis-v" @click="Toggle($event, user.data)"
                  v-if="user.data.role != 'general_manager'" aria-haspopup="true" aria-controls="overlay_menu" rounded
                  outlined />
                <Menu ref="menu" id="overlay_menu" :model="MenuItems" v-if="user.data.role != 'general_manager'"
                  :popup="true" />
                <Button size="small" class="mt-1" icon="pi pi-trash" outlined rounded severity="danger"
                  v-if="user.data.role == 'general_manager'" @click="handleDelete(user.data.id)"
                  :disabled="isDeleteDisabled"></Button>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
