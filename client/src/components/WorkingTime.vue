<template lang="">
  <div class="h-full max-h-80">
    <p>Create a workingtime</p>
    <hr />
    <p>Start</p>
    <input v-model="start" type="datetime-local" name="" id="" />
    <br />
    <p>End</p>
    <input v-model="end" type="datetime-local" name="" id="" />
    <br />
    <button @click="createWorkingTime(1)">submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
<style lang=""></style>
