<script setup lang="ts"></script>

<template>
  <header class="flex gap-8 items-center">
    <img alt="Vue logo" class="logo" src="./assets/Logo_nobg.png" width="100" height="125" />
    <div class="space-x-2">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/">Clock</RouterLink>
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/user"><i class="pi pi-user"></i></RouterLink>
    </div>
  </header>
  <main>
    <RouterView :key="$route.path" />
  </main>
</template>
