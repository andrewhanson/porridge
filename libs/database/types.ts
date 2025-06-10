import { z } from 'zod'

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  image: z.string().optional(),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  preparationSteps: z.array(z.string()).min(1, 'At least one preparation step is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional()
})

export const CreateRecipeSchema = RecipeSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const UpdateRecipeSchema = CreateRecipeSchema.partial()

export type Recipe = z.infer<typeof RecipeSchema>
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>