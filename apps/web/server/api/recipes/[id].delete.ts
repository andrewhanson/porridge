import { query } from '~/server/utils/db'
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

    // Check if recipe exists
    const existingResult = await query('SELECT id FROM recipes WHERE id = $1', [id])
    if (existingResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found'
      })
    }

    // Delete the recipe
    await query('DELETE FROM recipes WHERE id = $1', [id])

    setResponseStatus(event, 204)
    return null
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error deleting recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete recipe'
    })
  }
})