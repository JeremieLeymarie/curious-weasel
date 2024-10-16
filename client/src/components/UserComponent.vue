<script setup lang="ts">
import { deleteUser, getUser, updateUser } from '@/requests/user'
import type { User } from '@/types'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const confirm = useConfirm();
const toast = useToast();

const user = ref<User>()

const formValues = ref<Partial<User>>({})

const route = useRoute()
const router = useRouter()

watch(
  () => route.params.id,
  (id) => {
    getUser(id as string).then((res) => {
      user.value = res
      formValues.value = res
    })
  }
)

onMounted(() => {
  getUser(route.params.id as string).then((res) => {
    user.value = res
    formValues.value = res
  })
})

// const handleUpdate = (event: Event) => {
//   event.preventDefault()

//   if (!user.value?.id) return
//   // TODO: use zod for validation?
//   updateUser({
//     id: user.value.id,
//     username: formValues.value.username ?? user.value.username,
//     email: formValues.value.email ?? user.value.username,
//     role: user.value.role
//   })
// }
  if (!user.value?.id) return
  // TODO: use zod for validation?
  updateUser({
    id: user.value.id,
    username: formValues.value.username ?? user.value.username,
    email: formValues.value.email ?? user.value.username,
    teams: []
  })
}

const handleDelete = () => {
  if (!user.value?.id) return
  deleteUser(user.value?.id)

  router.push('/')
}

const confirm2 = () => {
  confirm.require({
    message: 'Do you want to delete this account?',
    header: 'Are you sure?',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      toast.add({
        severity: 'info',
        summary: 'Confirmed',
        detail: 'Account deleted',
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'You have canceled',
        life: 3000,
      });
    },
  });
};
</script>

<template>
  <div v-if="user">
    <div class="flex gap-4 items-center">
      <h2 class="text-2xl">Account</h2>
      <Toast />
      <ConfirmDialog></ConfirmDialog>
      <div class="card flex flex-wrap gap-2 justify-center">
        <Button @click="confirm2()" label="Delete" severity="danger" outlined size="small"></Button>
      </div>
    </div>
    <Panel class="space-y-4 my-4 p-2">
      <template #header>
        <div class="flex items-center gap-4">
          <h3 class="text-xl">My information</h3>
          <Button type="submit" @click="handleUpdate" size="small">Edit</Button>
        </div>
      </template>
      <form class="space-y-4" @submit="">
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
          <span>Police Commissionner</span>
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
  </div>
  <div v-else>User not found</div>
</template>
