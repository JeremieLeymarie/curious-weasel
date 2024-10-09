<template lang="">
  <div class="h-full max-h-80">
    <p>Update a workingtime</p>
    <hr />
    <p>Start</p>
    <input v-model="start" type="datetime-local" name="" id="" />
    <br />
    <p>End</p>
    <input v-model="end" type="datetime-local" name="" id="" />
    <br />
    <button @click="updateWorkingTime(1)">submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const start = ref(new Date('2024-10-06 13:02:00Z').toISOString().split('.')[0])
const end = ref(new Date('2024-10-06 13:02:00Z').toISOString().split('.')[0])
async function updateWorkingTime(id: any) {
  console.log(id, start.value, end.value)
  let data = JSON.stringify({
    working_time: {
      end: end.value,
      start: start.value
    }
  })
  if (start.value != null && end.value != null) {
    let res = await fetch('http://localhost:4000/api/workingtimes/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 200) {
      console.log('gg')
    }
  } else {
    console.log('no end or start')
  }
}
</script>
<style lang=""></style>
