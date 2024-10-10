<template lang="">
  <div class="h-full max-h-80">
    <p>Update a workingtime</p>
    <hr />
    <p>Start</p>
    <input v-model="start" type="datetime-local" name="" id="" />
    <br>
    <p>End</p>
    <input v-model="end" type="datetime-local" name="" id="" />
    <br />
    <button @click="updateWorkingTime(1)">submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const start = ref(new Date(route.params.start).toISOString().split('.')[0])
const end = ref(new Date(route.params.end).toISOString().split('.')[0])
async function updateWorkingTime(id: any) {
  console.log(id, start.value, end.value)
  let data = JSON.stringify({
    working_time: {
      end: end.value,
      start: start.value
    }
  })
  if (start.value != null && end.value != null) {
    let res = await fetch('http://localhost:4000/api/workingtimes/' + route.params.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
    if (res.status == 200) {
      router.push(`/workingtime`)
    }
  } else {
    console.log('no end or start')
  }
}
</script>
<style lang=""></style>
