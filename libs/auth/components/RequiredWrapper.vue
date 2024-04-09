<template>
  <div v-if="isAuthenticated" class="pa-0 ma-0">
    <slot />
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated } = useAuth0()
</script>