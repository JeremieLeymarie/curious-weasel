<script setup lang="ts">
import Menubar from 'primevue/menubar'
import { computed, ref, watch } from 'vue'
import { useUserStore } from './stores/user'
import { onMounted } from 'vue'
import { Network } from '@capacitor/network'
import { synchronizeMutations } from './requests/fetch'
import { getCurrentInstance } from 'vue'

const isSynchronizing = ref(false)

Network.addListener('networkStatusChange', status => {
  console.log('Network status changed', status);
  if (status.connected)
    synchronizeMutations().then((res) => {
      if (res) {
        const instance = getCurrentInstance();
        instance?.proxy?.$forceUpdate();
      }
    })
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
  ...(userStore.user?.role !== "employee" ? [{
    label: 'Manage',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Employees',
        route: '/users'
      },
      {
        label: 'Teams',
        route: '/teams'
      }
    ]
  }] : []),
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
    <div>
      <Menubar :model="items">
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
            <span v-if="item.icon" :class="item.icon"></span>
            <span v-if="item.label" class="ml-2">{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2"></span>
          </a>
        </template>
      </Menubar>
    </div>
  </header>
  <main class="p-12">
    <RouterView :key="$route.path" v-if="!isSynchronizing" />
    <div v-else>Synchronizing your data...</div>
  </main>
</template>
