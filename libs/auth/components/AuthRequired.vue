<template>
  <div v-if="isAuthenticated" class="pa-0 ma-0">
    <slot />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const isAuthenticated = ref(false)

onMounted(() => {
  const auth = useAuth0()  

  console.log('AuthRequired onMounted Value', auth.isAuthenticated)

  isAuthenticated.value = auth.isAuthenticated.value;
})
</script>