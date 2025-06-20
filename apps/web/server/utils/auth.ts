import { jwtVerify, createRemoteJWKSet } from 'jose'

// Cache for JWKS to avoid fetching on every request
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null

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
    // Get Auth0 configuration from runtime config
    const config = useRuntimeConfig()
    const auth0Domain = config.public.auth0?.domain
    const auth0Audience = config.public.auth0?.authorizationParams?.audience
    
    if (!auth0Domain) {
      throw new Error('Auth0 domain not configured')
    }
    
    if (!auth0Audience) {
      throw new Error('Auth0 audience not configured')
    }
    
    // Create JWKS endpoint URL
    const jwksUri = new URL(`https://${auth0Domain}/.well-known/jwks.json`)
    
    // Initialize JWKS cache if not already done
    if (!jwksCache) {
      jwksCache = createRemoteJWKSet(jwksUri)
    }
    
    // Verify the JWT token
    const { payload } = await jwtVerify(token, jwksCache, {
      issuer: `https://${auth0Domain}/`,
      audience: auth0Audience,
    })
    
    // Extract user information from the verified token
    return {
      id: payload.sub || 'unknown',
      email: payload.email || payload.sub || 'unknown',
      // Include additional claims if needed
      nickname: payload.nickname,
      name: payload.name,
      picture: payload.picture
    }
  } catch (error) {
    console.error('JWT verification failed:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid authentication token'
    })
  }
}