<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import AppInput from './ui/AppInput.vue'
import AppButton from './ui/AppButton.vue'

const router = useRouter()
const route = useRoute()

const start = ref(new Date(route.params.start as string).toISOString().split('.')[0])
const end = ref(new Date(route.params.end as string).toISOString().split('.')[0])
async function updateWorkingTime(id: any) {
  console.log(id, start.value, end.value)
  let data = JSON.stringify({
    working_time: {
      end: end.value,
      start: start.value
    }
  })
  if (start.value != null && end.value != null) {
    let res = await fetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/` + route.params.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 200) {
      router.push(`/workingtime/1`)
    }
  } else {
    console.log('no end or start')
  }
}
</script>

<template>
  <div class="ml-8">
    <p class="text-2xl my-4">Update a working time</p>
    <hr class="h-1 mb-4 ml-1 mr-16 bg-[#1D0455] border-0" />
    <div class="flex space-x-10">
      <div class="p-2">
        <p>Start</p>
        <AppInput v-model="start" type="datetime-local" name="" id="" class="border-2" />
      </div>
      <div class="p-2">
        <p>End</p>
        <AppInput v-model="end" type="datetime-local" name="" id="" class="border-2" />
      </div>
    </div>
    <button
      @click="updateWorkingTime(1)"
      class="bg-[#1D0455] text-white rounded-full p-2 my-6 w-1/12 text-center"
    >
      Submit
    </button>
  </div>
</template>
