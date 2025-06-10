import { prisma } from '@app/database'

/**
 * @openapi
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     description: Retrieve a specific recipe by its ID. No authentication required for reading.
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipe ID is required'
      })
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id }
    })

    if (!recipe) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found'
      })
    }

    return recipe
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recipe'
    })
  }
})