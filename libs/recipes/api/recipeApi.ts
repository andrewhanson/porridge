// Type definitions for Recipe API
export interface Recipe {
  id: string
  name: string
  image?: string
  summary: string
  description: string
  ingredients: string[]
  preparationSteps: string[]
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
}

export interface CreateRecipe {
  name: string
  image?: string
  summary: string
  description: string
  ingredients: string[]
  preparationSteps: string[]
  createdBy?: string
}

export interface UpdateRecipe {
  name?: string
  image?: string
  summary?: string
  description?: string
  ingredients?: string[]
  preparationSteps?: string[]
}

const recipeApi = {
  fetch: async (id: string): Promise<Recipe | undefined> => {
    try {
      const response = await $fetch<Recipe>(`/api/recipes/${id}`)
      return response
    } catch (error) {
      console.error('Error fetching recipe:', error)
      return undefined
    }
  },
  
  get: async (): Promise<Recipe[]> => {
    try {
      const response = await $fetch<Recipe[]>('/api/recipes')
      return response
    } catch (error) {
      console.error('Error fetching recipes:', error)
      return []
    }
  },
  
  create: async (recipe: CreateRecipe): Promise<Recipe | undefined> => {
    try {
      const response = await $fetch<Recipe>('/api/recipes', {
        method: 'POST',
        body: recipe,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      })
      return response
    } catch (error) {
      console.error('Error creating recipe:', error)
      throw error
    }
  },
  
  update: async (id: string, recipe: UpdateRecipe): Promise<Recipe | undefined> => {
    try {
      const response = await $fetch<Recipe>(`/api/recipes/${id}`, {
        method: 'PUT',
        body: recipe,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      })
      return response
    } catch (error) {
      console.error('Error updating recipe:', error)
      throw error
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      await $fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      })
      return true
    } catch (error) {
      console.error('Error deleting recipe:', error)
      throw error
    }
  }
}

// Helper function to get auth token (to be implemented based on your auth system)
async function getAuthToken(): Promise<string> {
  // This should be implemented to get the actual auth token from your auth system
  // For now, returning a placeholder
  return 'placeholder-token'
}

export { recipeApi }