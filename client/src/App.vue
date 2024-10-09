<template>
  <header class="flex gap-8 items-center">
    <img alt="Vue logo" class="logo" src="./assets/Logo_nobg.png" width="100" height="125" />
    <div class="space-x-2">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/user/1">User</RouterLink>
      <RouterLink to="/workingtimecreated">Working Time created</RouterLink>
      <RouterLink to="/workingtimeupdate">Working Time updated</RouterLink>
      <RouterLink to="/workingtime">Working Time</RouterLink>
    </div>
  </header>
  <main class="p-4">
    <RouterView :key="$route.path" />
  </main>
</template>

<script lang="ts"></script>

<style>
/* Ajoutez des styles globaux si nécessaire */
</style>
