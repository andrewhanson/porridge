import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: { '@app/users': resolve('./') },
  components: [
    { path: '@app/users/components', prefix: 'a-' }
  ],
  devtools: { enabled: true },
  extends: [
    "@app/ui"
  ]
})