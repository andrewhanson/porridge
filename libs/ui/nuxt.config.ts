import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: { '@app/ui': resolve('./') },
  build: {
    transpile: ['vuetify']
  },
  components: [
    { path: '@app/ui/components', prefix: 'ui-' }
  ],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  }
})