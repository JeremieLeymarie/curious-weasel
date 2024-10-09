<template>
  <header class="flex gap-8 items-center">
    <RouterLink to="/"
      ><img alt="Vue logo" class="logo" src="./assets/Logo_nobg.png" width="100" height="125"
    /></RouterLink>
    <div class="space-x-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/user/1">User</RouterLink>
      <RouterLink to="/workingtimecreated">Working Time created</RouterLink>
      <RouterLink to="/workingtimeupdate">Update Working Time</RouterLink>
      <RouterLink to="/workingtime">Working Time</RouterLink>
      <RouterLink to="/chart-manager/1">Dashboard</RouterLink>
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
