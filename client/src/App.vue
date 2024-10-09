<script setup lang="ts">
import Home from './components/Home.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <header class="flex items-center justify-between bg-[#1343ad] text-white">
    <img alt="CGT-U logo" class="ml-10" src="./assets/img/Logo_nobg.png" width="100" />
    <nav class="space-x-2 mr-10">
      <RouterLink to="/" class="p-4">Home</RouterLink>
      <RouterLink to="/" class="p-4">Clock</RouterLink>
      <RouterLink to="/" class="p-4">Dashboard</RouterLink>
      <RouterLink to="/user" class="p-4"><i class="pi pi-user"></i></RouterLink>
    </nav>
  </header>
  <main>
    <RouterView :key="$route.path" />
  </main>
  <footer class="flex items-center justify-center bg-[#1343ad] text-white h-24 text-center">
    <p class="">Need help? Contact the IT service at the following number : +1 252 258 4736 or download the <a class="bold underline">documentation</a>.
    </p>
  </footer>
</template>
