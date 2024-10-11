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
      <!-- Test de burger menu ><
      <input class="side-menu" type="checkbox" id="side-menu"/>
      <label class="hamb" for="side-menu"><span class="hamb-line"></span></label>
      <nav class="nav">
          <ul class="menu">
              <li><a href="#">Home</a></li>
              <li><a href="#">Working Time</a> </li>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Employees</a></li>
          </ul>
      </nav> -->
    </nav>
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

<!-- <style>
/* Menu Icon */
.hamb{
    cursor: pointer;
    float: right;
    padding: 40px 20px;
}/* Style label tag */

.hamb-line {
    background: var(--white);
    display: block;
    height: 2px;
    position: relative;
    width: 24px;

} /* Style span tag */

.hamb-line::before,
.hamb-line::after{
    background: var(--white);
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all .2s ease-out;
    width: 100%;
}
.hamb-line::before{
    top: 5px;
}
.hamb-line::after{
    top: -5px;
}

.side-menu {
    display: none;
} /* Hide checkbox */

/* Toggle menu icon */
.side-menu:checked ~ nav{
    max-height: 100%;
}
.side-menu:checked ~ .hamb .hamb-line {
    background: transparent;
}
.side-menu:checked ~ .hamb .hamb-line::before {
    transform: rotate(-45deg);
    top:0;
}
.side-menu:checked ~ .hamb .hamb-line::after {
    transform: rotate(45deg);
    top:0;
}

body:has(.side-menu:checked) {
  overflow: hidden;
}

/* Responsiveness */
@media (min-width: 768px) {
    .nav{
        max-height: none;
        top: 0;
        position: relative;
        float: right;
        width: fit-content;
        background-color: transparent;
    }
    .menu li{
        float: left;
    }
    .menu a:hover{
        background-color: transparent;
        color: var(--gray);

    }

    .hamb{
        display: none;
    }
}
</style> -->