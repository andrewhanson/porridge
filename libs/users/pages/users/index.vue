<template>
    <h1>Users</h1>
    <v-container>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>

    <v-data-table :items="data" :headers></v-data-table>
  </v-container>
</template>

<script setup>
import { userApi } from '@app/api'

const headers = ref([    
    { title: 'Name', value: 'name' },
    { title: 'Email', value: 'email' },
    { title: 'Phone', value: 'phone' },
    { title: 'City', value: 'city' },    
    { title: 'Country', value: 'country' },
])
const { data, error, loading } = useAsyncData('users', () => userApi.get())


</script>