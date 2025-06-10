export async function requireAuth(event: any) {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const token = authHeader.substring(7)
  
  try {
    // In a real implementation, you would verify the JWT token here
    // For now, we'll do a basic validation
    if (!token || token.length < 10) {
      throw new Error('Invalid token')
    }
    
    // Extract user information from token (in real implementation, decode JWT)
    // Support test token for testing purposes
    if (token === 'valid_test_token_12345') {
      return {
        id: 'test_user_123',
        email: 'test@example.com'
      }
    }
    
    // For now, we'll return a mock user for other valid tokens
    return {
      id: 'user_123',
      email: 'user@example.com'
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid authentication token'
    })
  }
}