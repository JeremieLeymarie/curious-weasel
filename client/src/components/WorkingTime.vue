<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from './ui/AppInput.vue'

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
  <div class="h-full max-h-80">
    <p>Create a Working Time</p>
    <hr />
    <p>Start</p>
    <AppInput v-model="start" type="datetime-local" />
    <br />
    <p>End</p>
    <AppInput v-model="end" type="datetime-local" />
    <br />
    <button @click="createWorkingTime(1)">submit</button>
  </div>
</template>
