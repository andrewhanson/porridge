import { query } from '~/server/utils/db'
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
    
    // Check if recipe exists
    const existingResult = await query('SELECT id FROM recipes WHERE id = $1', [id])
    if (existingResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found'
      })
    }

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (validatedData.name !== undefined) {
      updates.push(`name = $${paramCount++}`)
      values.push(validatedData.name)
    }
    if (validatedData.image !== undefined) {
      updates.push(`image = $${paramCount++}`)
      values.push(validatedData.image)
    }
    if (validatedData.summary !== undefined) {
      updates.push(`summary = $${paramCount++}`)
      values.push(validatedData.summary)
    }
    if (validatedData.description !== undefined) {
      updates.push(`description = $${paramCount++}`)
      values.push(validatedData.description)
    }
    if (validatedData.ingredients !== undefined) {
      updates.push(`ingredients = $${paramCount++}`)
      values.push(JSON.stringify(validatedData.ingredients))
    }
    if (validatedData.preparationSteps !== undefined) {
      updates.push(`preparation_steps = $${paramCount++}`)
      values.push(JSON.stringify(validatedData.preparationSteps))
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid fields to update'
      })
    }

    updates.push(`updated_at = $${paramCount++}`)
    values.push(new Date())
    values.push(id)

    await query(`
      UPDATE recipes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `, values)

    // Fetch the updated recipe
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

    const recipe = result.rows[0]
    recipe.createdAt = new Date(recipe.createdAt)
    recipe.updatedAt = new Date(recipe.updatedAt)

    return recipe
  } catch (error) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input data',
        data: error.errors
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error updating recipe:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update recipe'
    })
  }
})