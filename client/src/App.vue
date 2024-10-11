<script setup lang="ts">
import { useUserStore } from './stores/user'

const { user } = useUserStore()
</script>

<template>
  <header class="flex items-center justify-between bg-[#1D0455] text-white">
    <RouterLink to="/">
      <img alt="CGT-U logo" class="ml-10" src="./assets/img/Logo_nobg.png" width="100" />
    </RouterLink>
    <nav class="space-x-6 mr-10">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink :to="`/workingtime/${user.id}`">Working Time</RouterLink>
      <RouterLink to="/chart-manager/1">Dashboard</RouterLink>
      <RouterLink to="/users" v-if="user?.role === 'general_manager'">Employees</RouterLink>
      <RouterLink to="/user/1"><i class="pi pi-user"></i></RouterLink>
    </nav>
  </header>
  <main class="p-4">
    <RouterView :key="$route.path" />
  </main>
  <footer
    class="flex items-center justify-center bg-[#1D0455] text-white h-12 text-center fixed mt-4 bottom-0 w-full"
  >
    <p class="">
      Need help? Contact the IT service at the following number : +1 252 258 4736 <b>or</b> download
      the
      <a class="bold underline" href="server/documentation/UserGuide.pdf" download>documentation</a
      >
    </p>
  </footer>
</template>
