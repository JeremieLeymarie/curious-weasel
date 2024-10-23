<script setup lang="ts">
import Menubar from 'primevue/menubar'
import ProgressSpinner from 'primevue/progressspinner';
import { computed, ref, watch } from 'vue'
import { useUserStore } from './stores/user'
import { onMounted } from 'vue'
import { Network } from '@capacitor/network'
import { synchronizeMutations } from './requests/fetch'
import { getCurrentInstance } from 'vue'

const isSynchronizing = ref(false)

Network.addListener('networkStatusChange', status => {
  console.log('Network status changed', status);
  if (status.connected) {
    isSynchronizing.value = true
    synchronizeMutations().then((res) => {
      if (res) {
        const instance = getCurrentInstance();
        instance?.proxy?.$forceUpdate();
        isSynchronizing.value = false
      }
    })
  }
  else {
    const instance = getCurrentInstance();
    instance?.proxy?.$forceUpdate();
  }
});

onMounted(() => {
  synchronizeMutations().then((res) => {
    if (res) {
      const instance = getCurrentInstance();
      instance?.proxy?.$forceUpdate();
    }
  })
})

const userStore = useUserStore()

const isDarkModeEnabled = ref(document.documentElement.classList.contains('my-app-dark'))

watch(isDarkModeEnabled, () => {
  if (isDarkModeEnabled.value) document.documentElement.classList.add('my-app-dark')
  else document.documentElement.classList.remove('my-app-dark')
})
onMounted(() => {
  let user = localStorage.getItem('user')
  if (user) {
    userStore.setUser(JSON.parse(user))
  }
})
const items = computed(() => [
  { label: 'Home', icon: 'pi pi-home', route: '/' },
  { label: 'Working Times', icon: 'pi pi-clock', route: `/workingtime/${userStore.user?.id}` },
  { label: 'Dashboard', icon: 'pi pi-chart-bar', route: `/chart-manager/${userStore.user?.id}` },
  ...(userStore.user?.role !== "employee" ? [{ label: 'Employees', icon: 'pi pi-users', route: '/users' },
  { label: 'Teams', icon: 'pi pi-sitemap', route: '/teams' }] : []),
  { label: 'Account', icon: 'pi pi-user', route: `/user/${userStore.user?.id}` },
  {
    icon: isDarkModeEnabled.value ? 'pi pi-sun' : 'pi pi-moon',
    command: () => toggleDarkMode()
  }
])

const toggleDarkMode = () => {
  isDarkModeEnabled.value = !isDarkModeEnabled.value
}
</script>

<template>
  <header class="flex items-center justify-between text-white px-4 bg-primary-950">
    <RouterLink to="/">
      <img alt="Gotham City logo" class="ml-10" src="./assets/img/Logo_White2.png" width="90" />
    </RouterLink>
    <div class="flex">
      <Menubar :model="items" class="menubar">
        <template #item="{ item, props }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
      </Menubar>
    </div>
  </header>
  <main class="p-12">
    <RouterView :key="$route.path" v-if="!isSynchronizing" />
    <div v-else class="w-full flex flex-col gap-4 justify-center items-center text-muted-color animate-pulse">
      <p class="w-max">
        Synchronizing your data...</p>
      <ProgressSpinner class="!w-[5Opx] !h-[5Opx]" stroke-width="4" />
    </div>
  </main>
</template>

<style scoped>
@media screen and (min-device-width : 320px) and (max-device-width : 480px) {

  .menubar {
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
}
</style>