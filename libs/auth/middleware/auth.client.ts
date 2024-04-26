import { useAuth0 } from '@auth0/auth0-vue'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  if (isAuthenticated.value === false) {
    return loginWithRedirect({
      appState: { targetUrl: to.fullPath }
    })
  }
})