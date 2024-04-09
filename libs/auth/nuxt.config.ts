import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: { '@app/auth': resolve('./') },
  components: [
    { path: '@app/auth/components', prefix: 'auth-' }
  ],
  devtools: { enabled: true },
  extends: [
    "@app/ui"
  ],
  runtimeConfig: {
    public: {
      auth0: {
        domain: process.env.NUXT_PUBLIC_AUTH_DOMAIN,
        clientId: process.env.NUXT_PUBLIC_AUTH_CLIENT_ID,
        authorizationParams:{
          audience: process.env.NUXT_PUBLIC_AUTH_AUDIENCE,
          scopes: process.env.NUXT_PUBLIC_AUTH_SCOPES,
          redirect_uri: process.env.NUXT_PUBLIC_AUTH_REDIRECT_URI
        }
      }
    }
  }  
})
