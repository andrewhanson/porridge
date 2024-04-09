<template>
  <div>
    <v-btn
      v-if="!isAuthenticated"
      @click="login"
    >
      login
    </v-btn>
    <v-btn
      v-else
      title="Logout"
      @click="logout"
    >
      <v-icon icon="mdi-logout" />
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { useAuth0 } from '@auth0/auth0-vue'

const auth0 = process.client ? useAuth0() : undefined

const isAuthenticated = computed(() => {
  return auth0?.isAuthenticated.value
})

const login = () => {
  auth0?.checkSession()
  if (!auth0?.isAuthenticated.value) {
    auth0?.loginWithRedirect({
      appState: {
        target: useRoute().path
      },
    })
  }
}

const logout = () => {
  auth0?.logout({ logoutParams: { returnTo: `${window.location.origin}/goodbye` } })
}
</script>