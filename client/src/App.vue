<script setup lang="ts">
import { useUserStore } from './stores/user'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { user } = useUserStore()
</script>

<template>
  <header class="flex items-center justify-between bg-[#1D0455] text-white">
    <RouterLink to="/">
      <img alt="CGT-U logo" class="ml-10" src="./assets/img/Logo_nobg.png" width="100" />
    </RouterLink>
    <Menu as="div" class="flex space-x-6 mr-10 text-white">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink :to="`/workingtime/${user.id}`">Working Time</RouterLink>
      <RouterLink to="/chart-manager/1">Dashboard</RouterLink>
      <div>
        <MenuButton
          class="inline-flex w-full justify-center gap-x-1.5 rounded-md hover:bg-[#0b328a]">
          Manage
          <ChevronDownIcon class="-mr-1 h-5 w-5" aria-hidden="true" />
        </MenuButton>
      </div>
      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md focus:outline-none bg-[#1D0455] text-white">
          <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-white', 'block px-4 py-2 text-sm']"><RouterLink to="/users" v-if="user?.role === 'general_manager'">Employees</RouterLink></a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-white', 'block px-4 py-2 text-sm']"><RouterLink to="/teams" v-if="user?.role === 'general_manager'">Teams</RouterLink></a>
          </MenuItem>
        </div>
        </MenuItems>
      </transition>
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
    </Menu>
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
 /* Nav menu */
.nav{
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: var(--black);
    overflow: hidden;

}
.menu a{
    display: block;
    padding: 30px;
    color: var(--white);
}
.menu a:hover{
    background-color: var(--gray);
}
.nav{
    max-height: 0;
    transition: max-height .5s ease-out;
}
    
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
@media (min-width: 920px) {
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
    }

    .hamb{
        display: none;
    }
}
</style> -->