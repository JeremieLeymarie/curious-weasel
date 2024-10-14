<script setup lang="ts">
import Menubar from 'primevue/menubar'

import { ref } from 'vue'
import { useUserStore } from './stores/user'
const { user } = useUserStore()

const items = ref([
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
  { label: 'Account', icon: 'pi pi-user', route: `/user/${user?.id}` }
])
</script>

<template>
  <header class="flex items-center justify-between text-white px-4 bg-[#1D0455]">
    <RouterLink to="/">
      <img alt="CGT-U logo" class="ml-10" src="./assets/img/Logo_white.png" width="100" />
    </RouterLink>
    <div>
      <Menubar :model="items" class="!border-none !bg-transparent">
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a
              v-ripple
              :href="href"
              v-bind="props.action"
              @click="navigate"
              class="!text-white hover:!text-black"
            >
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            v-ripple
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
            class="!text-white hover:!text-black"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
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
