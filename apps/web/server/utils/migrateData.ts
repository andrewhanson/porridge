import { query } from '~/server/utils/db'
import { recipes } from '~/../../libs/recipes/api/data'

export async function migrateExistingRecipes() {
  try {
    // Check if recipes already exist
    const existingResult = await query('SELECT COUNT(*) as count FROM recipes')
    const count = parseInt(existingResult.rows[0].count)
    
    if (count > 0) {
      console.log(`Database already has ${count} recipes, skipping migration`)
      return
    }

    console.log('Migrating existing recipes to database...')
    
    for (const recipe of recipes) {
      await query(`
        INSERT INTO recipes (
          id, name, image, summary, description, 
          ingredients, preparation_steps, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        recipe.id,
        recipe.name,
        recipe.image || null,
        recipe.summary,
        recipe.description,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.preparationSteps),
        new Date(),
        new Date()
      ])
    }
    
    console.log(`Successfully migrated ${recipes.length} recipes to database`)
  } catch (error) {
    console.error('Failed to migrate recipes:', error)
  }
}