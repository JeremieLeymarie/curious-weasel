<template #start>
    <header class="flex">
        <nav>
            <RouterLink to="/">
            <img alt="CGT-U logo" class="logo" src="../assets/img/Logo_nobg.png" width="150" height="120" />
            </RouterLink>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/">Clock</RouterLink>
            <RouterLink to="/">Dashboard</RouterLink>
            <RouterLink to="/"><i class="pi pi-user"></i></RouterLink>
        </nav>
    </header>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
</script>
