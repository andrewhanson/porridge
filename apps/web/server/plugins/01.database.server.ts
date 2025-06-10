import { initializeDatabase } from '~/server/utils/initDb'
import { migrateExistingRecipes } from '~/server/utils/migrateData'

export default defineNitroPlugin(async (nitroApp) => {
  console.log('Initializing Nitro Plugin')
  
  nitroApp.hooks.hook('nitro:init', async () => {
    console.log('Initializing database...')
    await initializeDatabase()
    await migrateExistingRecipes()
  })
})