import { requireAuth } from '~/server/utils/auth'
import { migrateExistingRecipes } from '@app/database'

/**
 * @openapi
 * /api/recipes/migrate:
 *   post:
 *     summary: Migrate existing recipes to the database
 *     description: Migrate predefined recipes to the database. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Migration completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export default defineEventHandler(async (event) => {
  // Require authentication
  await requireAuth(event)
  
  try {
    await migrateExistingRecipes()
    
    return {
      message: 'Recipe migration completed successfully'
    }
  } catch (error) {
    console.error('Error during recipe migration:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to migrate recipes'
    })
  }
}) 