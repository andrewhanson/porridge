import { query } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'
import { CreateRecipeSchema } from '~/server/types/recipe'
import { randomUUID } from 'crypto'

/**
 * @openapi
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Create a new recipe. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipe'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export default defineEventHandler(async (event) => {
  // Require authentication
  const user = await requireAuth(event)
  
  try {
    const body = await readBody(event)
    
    // Validate input
    const validatedData = CreateRecipeSchema.parse(body)
    
    const id = randomUUID()
    const now = new Date()
    
    await query(`
      INSERT INTO recipes (
        id, name, image, summary, description, 
        ingredients, preparation_steps, created_at, updated_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id,
      validatedData.name,
      validatedData.image || null,
      validatedData.summary,
      validatedData.description,
      JSON.stringify(validatedData.ingredients),
      JSON.stringify(validatedData.preparationSteps),
      now,
      now,
      user.id
    ])

    // Fetch the created recipe
    const result = await query(`
      SELECT 
        id,
        name,
        image,
        summary,
        description,
        ingredients,
        preparation_steps as "preparationSteps",
        created_at as "createdAt",
        updated_at as "updatedAt",
        created_by as "createdBy"
      FROM recipes 
      WHERE id = $1
    `, [id])

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create recipe'
      })
    }

    const recipe = result.rows[0]
    recipe.createdAt = new Date(recipe.createdAt)
    recipe.updatedAt = new Date(recipe.updatedAt)

    setResponseStatus(event, 201)
    return recipe
  } catch (error) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input data',
        data: error.errors
      })
    }
    
    console.error('Error creating recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create recipe'
    })
  }
})