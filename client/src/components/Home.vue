<script setup lang="ts"></script>

<template>
    <h1 class="text-3xl m-4 ml-8">Welcome, {{ user }}!</h1>
    <p class="text-l m-4 ml-8">Today is {{ date }}</p>
    <hr class="h-1 m-3 ml-8 mr-16 bg-[#1343ad] border-0">

    <div class="flex ml-8">
        <div class="m-4 w-6/12">
            <h3 class="text-2xl m-4">Fast Clocking</h3>
            <div class="flex m-4">
                <button class="bg-[#1343ad] text-white rounded-full p-3 w-8/12 mt-4"><a>DECLARE MY ARRIVAL</a></button>
            </div>
            <div class="flex m-4">
                <button class="bg-[#1343ad] text-white rounded-full p-3 w-8/12 mt-4"><a>DECLARE MY DEPARTURE</a></button>
            </div>
        </div>
        <div class="m-4 w-6/12">
            <h3 class="text-2xl m-4">Overview</h3>
            <span>
                <p class="bg-[#1343ad] text-white squared-full p-3 m-4 w-8/12 text-center">You have worked {{ }} this
                    week.</p>
            </span>
            <span>
                <p class="bg-[#1343ad] text-white squared-full p-3 m-4 w-8/12 text-center">You have {{ }} days off left.
                </p>
            </span>
            <span class="">
                <button class="bg-[#1343ad] text-white rounded-full p-3 m-4 w-4/12 text-center"><a>Consult
                        dashboard</a></button>
            </span>
        </div>
    </div>

</template>