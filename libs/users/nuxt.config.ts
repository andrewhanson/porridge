import { createResolver } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: { '@app/users': resolve('./') },
  components: [
    { path: '@app/users/components', prefix: 'a-' }
  ],
  devtools: { enabled: true },
  extends: [
    "@app/ui"
  ], 
  hooks: {
    'pages:extend' (pages) {
      function setMiddleware (pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.path.indexOf('/users') === 0){
            page.meta ||= {}
            page.meta.middleware ||= []
            page.meta.middleware.unshift('auth')
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    }
  }
})