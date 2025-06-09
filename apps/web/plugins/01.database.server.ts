import { initializeDatabase } from '~/server/utils/initDb'
import { migrateExistingRecipes } from '~/server/utils/migrateData'

export default defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook('ready', async () => {
    console.log('Initializing database...')
    await initializeDatabase()
    await migrateExistingRecipes()
  })
})