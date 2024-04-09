import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: { '@app/recipes': resolve('./') },
  components: [
    { path: '@app/recipes/components', prefix: 'ui-' }
  ],
  devtools: { enabled: true },
  extends: [
    "@app/ui"
  ]
})

