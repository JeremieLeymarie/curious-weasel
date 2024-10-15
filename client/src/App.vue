<script setup lang="ts">
import Menubar from 'primevue/menubar'

import { computed, ref, watch } from 'vue'
import { useUserStore } from './stores/user'
const { user } = useUserStore()

const isDarkModeEnabled = ref(document.documentElement.classList.contains('my-app-dark'))

watch(isDarkModeEnabled, () => {
  if (isDarkModeEnabled.value) document.documentElement.classList.add('my-app-dark')
  else document.documentElement.classList.remove('my-app-dark')
})

const items = computed(() => [
  { label: 'Home', icon: 'pi pi-home', route: '/' },
  { label: 'Working Times', icon: 'pi pi-clock', route: `/workingtime/${user?.id}` },
  { label: 'Dashboard', icon: 'pi pi-chart-bar', route: `/chart-manager/${user?.id}` },
  {
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
  },
  { label: 'Account', icon: 'pi pi-user', route: `/user/${user?.id}` },
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
      <img alt="CGT-U logo" class="ml-10" src="./assets/img/Logo_white.png" width="100" />
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
            <span v-if="item.icon" :class="item.icon" />
            <span v-if="item.label" class="ml-2">{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
          </a>
        </template>
      </Menubar>
    </div>
  </header>
  <main class="p-4">
    <RouterView :key="$route.path" />
  </main>
  <!-- <footer
    class="flex items-center justify-center bg-[#1D0455] text-white h-12 text-center fixed mt-4 bottom-0 w-full"
  >
    <p class="">
      Need help? Contact the IT service at the following number : +1 252 258 4736 <b>or</b> download
      the
      <a class="bold underline" href="server/documentation/UserGuide.pdf" download>documentation</a>
    </p>
  </footer> -->
</template>
