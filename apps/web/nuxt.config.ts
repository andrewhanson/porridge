
export default defineNuxtConfig({
  devtools: { enabled: true }, 
  ssr: false, 
  extends: [
    "@app/ui",
    "@app/auth",
    "@app/users",
    "@app/recipes"
  ],
})
