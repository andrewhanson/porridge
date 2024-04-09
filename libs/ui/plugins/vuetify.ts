import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: false, 
          colors:{
          primary: '#A67B5B', // Warm, inviting wood tone
          secondary: '#D9C3B0', // Soft, comforting bear fur tone
          accent: '#F2B705', // Vibrant, honey-inspired yellow
          success: '#4CAF50', // Rich forest green
          error: '#FF5252', // Soft, cautionary red
          info: '#2196F3', // Calm, clear sky blue
          warning: '#FB8C00', // Bright, attention-grabbing yellow
        },
      },
    },
    },
  })
  app.vueApp.use(vuetify)
})