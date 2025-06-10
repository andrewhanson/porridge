import { useAuth0 } from '@auth0/auth0-vue'

export const useRecipeAuth = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  
  const getAuthToken = async (): Promise<string> => {
    if (!isAuthenticated.value) {
      throw new Error('User is not authenticated')
    }
    
    try {
      return await getAccessTokenSilently()
    } catch (error) {
      console.error('Failed to get access token:', error)
      throw error
    }
  }
  
  return {
    getAuthToken,
    isAuthenticated
  }
}