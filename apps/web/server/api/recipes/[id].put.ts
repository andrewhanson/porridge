import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { UpdateRecipeSchema } from '~/server/types/recipe'

/**
 * @openapi
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     description: Update an existing recipe. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRecipe'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
export default defineEventHandler(async (event) => {
  // Require authentication
  await requireAuth(event)
  
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipe ID is required'
      })
    }

    // Validate input
    const validatedData = UpdateRecipeSchema.parse(body)
    
    // Check if recipe exists and update it
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name: validatedData.name,
        image: validatedData.image,
        summary: validatedData.summary,
        description: validatedData.description,
        ingredients: validatedData.ingredients,
        preparationSteps: validatedData.preparationSteps,
      }
    })

    return recipe
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input data',
        data: error.errors
      })
    }

    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found'
      })
    }
    
    console.error('Error updating recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update recipe'
    })
  }
})