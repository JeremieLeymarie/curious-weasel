<script setup lang="ts">
import { deleteUser, getUser, updateUser, logOut } from '@/requests/user'
import type { User } from '@/types'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast';
import ProtectedViewVue from './ProtectedView.vue'
import { useUserStore } from '@/stores/user'
import { Network } from '@capacitor/network'
import { isOffline } from '@/requests/fetch'


const confirm = useConfirm()
const toast = useToast()
const userStore = useUserStore();
const user = ref<User>()

const formValues = ref<Partial<User>>({})

const route = useRoute()
const router = useRouter()
const isDeleteDisabled = ref(false)

Network.addListener('networkStatusChange', status => {
  isDeleteDisabled.value = !status.connected
});

watch(
  () => route.params.id,
  (id) => {
    getUser(id as string).then((res) => {
      user.value = res
      formValues.value = res
    })

    isOffline().then(offline => { isDeleteDisabled.value = offline })
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
    email: formValues.value.email ?? user.value.username,
  })
}

const handleDelete = () => {
  if (!user.value?.id) return
  deleteUser(user.value?.id)

  router.push('/')
}

const handleLogout = () => {
  logOut()
  router.push('/login')
}

const confirmDelete = () => {
  confirm.require({
    message: 'Do you want to delete this account?',
    header: 'Are you sure?',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      handleDelete()
      toast.add({
        severity: 'success',
        summary: 'Confirmed',
        detail: 'Account deleted',
        life: 3000
      });
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Canceled',
        detail: 'You have canceled your action',
        life: 3000
      });
    }
  })
}
</script>

<template>
  <div v-if="user">
    <ProtectedViewVue :authorizedRoles="['manager', 'general_manager']" :resourceId="`${route.params.id}`">
      <div class="flex gap-4 items-center">
        <h2 class="text-2xl">Account</h2>
        <Toast />
        <ConfirmDialog></ConfirmDialog>
        <div class="card flex flex-wrap gap-2 justify-center">
          <Button @click="confirmDelete()" label="Delete" severity="danger" outlined size="small" rounded
            v-if="user.id == userStore.user?.id" :disabled="isDeleteDisabled"></Button>
          <Button @click="handleLogout" severity="danger" size="small" v-if="user.id == userStore.user?.id" rounded>Log
            out</Button>
        </div>
      </div>
      <Panel class="space-y-4 my-4 p-2">
        <template #header>
          <div class="flex items-center gap-4">
            <h3 class="text-xl">My information</h3>
            <Button type="submit" @click="handleUpdate" size="small" icon="pi pi-pencil" outlined rounded></Button>
          </div>
        </template>
        <form class="space-y-4">
          <div class="space-y-4">
            <div class="flex items-center">
              <label for="name" class="w-[150px] inline-block">Name</label>
              <InputText id="name" name="name" placeholder="James Gordon" v-model="formValues.username" />
            </div>
            <div class="flex items-center">
              <label for="email" class="w-[150px] inline-block">Email address</label>
              <InputText id="email" name="email" placeholder="example@gotham-city.com" v-model="formValues.email" />
            </div>
            <div class="flex items-center">
              <label for="number" class="w-[150px] inline-block">Phone number</label>
              <!-- <InputText id="number" name="number" placeholder="+1 223 4984" v-model="formValues.number" /> -->
            </div>
          </div>
        </form>
      </Panel>
      <Panel class="p-2">
        <template #header>
          <div class="flex items-center gap-4">
            <h3 class="text-xl">Job information</h3>
          </div>
        </template>
        <div class="space-y-4">
          <div class="flex items-center">
            <h4 class="w-[165px] inline-block">Job title</h4>
            <span>Police Commissioner</span>
          </div>
          <div class="flex items-center">
            <h4 class="w-[165px] inline-block">Manager</h4>
            <span>Mayor Hilton Hill</span>
          </div>
          <div class="flex items-center">
            <h4 class="w-[165px] inline-block">Team(s)</h4>
            <div class="flex gap-2 flex-wrap">
              <router-link v-for="team in user.teams" :key="team.id" :to="`/teams/${team.id}`">
                <Chip :label="team.name" />
              </router-link>
            </div>
          </div>
        </div>
      </Panel>
    </ProtectedViewVue>
  </div>
  <div v-else>User not found</div>
  <!-- <footer class="flex items-center justify-center bg-[#1D0455] text-white h-10 text-center fixed mt-4 bottom-0 w-full !p-0">
    <div>
      Need help? Contact the IT service at the following number : +1 252 258 4736 <b>or</b> download
      the
      <a class="bold underline" href="server/documentation/UserGuide.pdf" download>documentation</a>
    </div>
  </footer> -->
</template>
