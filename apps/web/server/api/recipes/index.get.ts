import { prisma } from '@app/database'
import type { Recipe } from '@app/database'

/**
 * @openapi
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieve all recipes. No authentication required for reading.
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: List of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Internal server error
 */
export default defineEventHandler(async () => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return recipes
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch recipes'
    })
  }
})