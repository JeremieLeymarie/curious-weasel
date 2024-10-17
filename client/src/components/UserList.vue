<script setup lang="ts">
import type { User } from '../types'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { deleteUser, getUsers, updateUser } from '@/requests/user'

const { users } = defineProps<{ users: User[] }>()
// TODO: sorting

</script>

<template>
  <!-- <div v-if="users" class=""> -->
  <Card class="">
    <template #title>Employees</template>
    <template #content>
      <DataTable :value="employees" stripedRows tableStyle="min-width: 20rem" paginator :rows="10"
        :rowsPerPageOptions="[10, 20, 30, 40]" sortField="Name" :sortOrder="-1">
        <Column field="id" header="ID">
          <!-- {{ user.id }} -->
        </Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="role" header="Role" sortable></Column>
        <Column field="daily" header="Daily avg" sortable></Column>
        <Column field="weekly" header="Weekly avg" sortable></Column>
        <Column field="info" header="Info" sortable>
          <!-- <Button>
              <RouterLink to="/users/{user.id}"></RouterLink>
            </Button> -->
        </Column>
      </DataTable>
    </template>
  </Card>
  <!-- </div> -->
</template>
