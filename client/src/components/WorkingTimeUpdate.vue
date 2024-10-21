<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user'
import { authFetch } from '@/requests/fetch'

const { user } = useUserStore()

const router = useRouter()
const route = useRoute()
const start = ref(new Date(route.params.start as string))
const end = ref(new Date(route.params.end as string))
async function updateWorkingTime(id: any) {
    let data = JSON.stringify({
        working_time: {
            end: end.value,
            start: start.value
        }
    })
    if (start.value != null && end.value != null) {
        let res = await authFetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/` + route.params.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: data
        })
        if (res.status == 200) {
            router.push(`/workingtime/${user?.id}`)
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
                <DatePicker v-model="start" showTime hourFormat="24" fluid />
            </div>
            <div class="p-2">
                <p>End</p>
                <DatePicker v-model="end" showTime hourFormat="24" fluid />
            </div>
        </div>
        <Button @click="updateWorkingTime(1)" class="bg-[#1D0455] text-white rounded-full p-2 my-6 w-1/12 text-center">
            Submit
        </Button>
    </div>
</template>
