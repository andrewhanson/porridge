import { prisma } from './client'
import { recipes } from '@app/recipes/api/data'

export async function migrateExistingRecipes() {
  try {
    // Check if recipes already exist
    const count = await prisma.recipe.count()
    
    // if (count > 0) {
    //   console.log(`Database already has ${count} recipes, skipping migration`)
    //   return
    // }

    console.log('Migrating existing recipes to database...')
    
    await prisma.recipe.createMany({
      data: recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        image: recipe.image || null,
        summary: recipe.summary,
        description: recipe.description,
        ingredients: recipe.ingredients,
        preparationSteps: recipe.preparationSteps
      }))
    })
    
    console.log(`Successfully migrated ${recipes.length} recipes to database`)
  } catch (error) {
    console.error('Failed to migrate recipes:', error)
  }
}