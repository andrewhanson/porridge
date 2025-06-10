import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

/**
 * @openapi
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     description: Delete an existing recipe. Requires authentication.
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
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
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
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipe ID is required'
      })
    }

    await prisma.recipe.delete({
      where: { id }
    })

    setResponseStatus(event, 204)
    return null
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found'
      })
    }
    
    console.error('Error deleting recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete recipe'
    })
  }
})