<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from './ui/AppInput.vue'
import AppButton from './ui/AppButton.vue'

const router = useRouter()

const start = ref(null)
const end = ref(null)

async function createWorkingTime(id: any) {
  let data = JSON.stringify({
    working_time: {
      end: end.value,
      start: start.value
    }
  })
  if (start.value != null && end.value != null) {
    let res = await fetch('http://localhost:4000/api/workingtimes/' + id, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 201) {
      router.push(`/workingtime`)
    }
  } else {
    console.log('no end or start')
  }
}
</script>

<template>
  <div class="ml-8">
    <p class="text-2xl my-4">Create a working time</p>
    <hr class="h-1 mb-4 ml-1 mr-16 bg-[#1343ad] border-0">
    <div class="flex space-x-10">
      <div class="p-2">
        <p>Start</p>
        <AppInput v-model="start" type="datetime-local" class="border-2" />
      </div>
      <div class="p-2">
        <p>End</p>
        <hr />
        <AppInput v-model="end" type="datetime-local" class="border-2" />
      </div>
    </div>
    <AppButton @click="createWorkingTime(1)" class="my-6 w-1/12 text-center">Submit</AppButton>
  </div>
</template>
