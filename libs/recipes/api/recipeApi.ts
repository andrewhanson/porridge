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
  
  create: async (recipe: CreateRecipe, authToken?: string): Promise<Recipe | undefined> => {
    try {
      const token = authToken || await getAuthToken()
      const response = await $fetch<Recipe>('/api/recipes', {
        method: 'POST',
        body: recipe,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      return response
    } catch (error) {
      console.error('Error creating recipe:', error)
      throw error
    }
  },
  
  update: async (id: string, recipe: UpdateRecipe, authToken?: string): Promise<Recipe | undefined> => {
    try {
      const token = authToken || await getAuthToken()
      const response = await $fetch<Recipe>(`/api/recipes/${id}`, {
        method: 'PUT',
        body: recipe,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      return response
    } catch (error) {
      console.error('Error updating recipe:', error)
      throw error
    }
  },
  
  delete: async (id: string, authToken?: string): Promise<boolean> => {
    try {
      const token = authToken || await getAuthToken()
      await $fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return true
    } catch (error) {
      console.error('Error deleting recipe:', error)
      throw error
    }
  }
}

// Helper function to get auth token (integrates with Auth0)
async function getAuthToken(): Promise<string> {
  // In a client-side context, get the token from Auth0
  if (process.client) {
    try {
      // This would need to be imported in the component that uses it
      // const { getAccessTokenSilently } = useAuth0()
      // return await getAccessTokenSilently()
      
      // For now, return a placeholder - this should be implemented in components
      // that need authentication by importing useAuth0 and getting the token
      return 'placeholder-token'
    } catch (error) {
      console.error('Failed to get auth token:', error)
      throw error
    }
  }
  
  // On server-side, this shouldn't be called
  throw new Error('getAuthToken should not be called on server-side')
}

export { recipeApi }