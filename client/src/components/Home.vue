<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
    <Header />
    <h1>Welcome, {{  }}!</h1>
    <p>Today is {{  }}</p>
    <hr>
    <div class="flex">
        <div class="items-left">
        <h3>Fast Clocking</h3>
        <button><a>DECLARE MY ARRIVAL</a></button>
        <button><a>DECLARE MY DEPARTURE</a></button>
    </div>
    <div class="items-right">
        <h3>Overview</h3>
        <span><p>You have worked {{ }} this week.</p></span>
        <span><p>You have {{  }} days off left.</p></span>
        <button><a>Consult dashboard</a></button>
    </div>
    </div>
    
</template>