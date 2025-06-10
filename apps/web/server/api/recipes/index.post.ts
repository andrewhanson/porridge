import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { CreateRecipeSchema } from '~/server/types/recipe'

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
    
    const recipe = await prisma.recipe.create({
      data: {
        name: validatedData.name,
        image: validatedData.image,
        summary: validatedData.summary,
        description: validatedData.description,
        ingredients: validatedData.ingredients,
        preparationSteps: validatedData.preparationSteps,
        createdBy: user.id
      }
    })

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