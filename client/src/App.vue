<script setup lang="ts">
import Home from './components/Home.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <header class="flex items-center justify-between bg-[#1343ad] text-white">
    <img alt="CGT-U logo" class="ml-10" src="./assets/img/Logo_nobg.png" width="100" />
    <nav class="space-x-2 mr-10">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/workingtime">Working Time</RouterLink>
      <RouterLink to="/chart-manager/1">Dashboard</RouterLink>
      <RouterLink to="/user/1" class="p-4"><i class="pi pi-user"></i></RouterLink>
    </nav>
  </header>
  <main class="p-4">
    <RouterView :key="$route.path" />
  </main>
  <footer
    class="flex items-center justify-center bg-[#1343ad] text-white h-20 text-center fixed bottom-0 w-full"
  >
    <p class="">
      Need help? Contact the IT service at the following number : +1 252 258 4736 <b>or</b> download
      the
      <a class="bold underline" href="server/documentation/UserGuide.pdf" download>documentation</a
      >.
    </p>
  </footer>
</template>

<script lang="ts"></script>

<style>
/* Ajoutez des styles globaux si nécessaire */
</style>
