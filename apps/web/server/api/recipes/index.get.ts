import { query } from '~/server/utils/db'
import type { Recipe } from '~/server/types/recipe'

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
export default defineEventHandler(async (event) => {
  try {
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
      ORDER BY created_at DESC
    `)

    const recipes: Recipe[] = result.rows.map(row => ({
      ...row,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined
    }))

    return recipes
  } catch (error) {
    console.error('Error fetching recipes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recipes'
    })
  }
})