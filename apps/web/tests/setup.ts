import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Set up global Nuxt functions before any modules are imported
global.defineEventHandler = (handler: any) => handler
global.readBody = async (event: any) => event.body
global.getRouterParam = (event: any, param: string) => event.context.params?.[param]
global.getHeader = (event: any, name: string) => event.headers?.[name]
global.setResponseStatus = (event: any, status: number) => {
  event.status = status
}
global.createError = (error: any) => {
  const err = new Error(error.statusMessage || error.message || 'Error')
  ;(err as any).statusCode = error.statusCode || 500
  ;(err as any).statusMessage = error.statusMessage
  ;(err as any).data = error.data
  throw err
}

// Mock user for authentication tests
export const mockUser = {
  id: 'test_user_123',
  email: 'test@example.com'
}

// Mock auth token
export const mockAuthToken = 'valid_test_token_12345'

beforeAll(async () => {
  console.log('Setting up test environment...')
})

afterAll(async () => {
  console.log('Test environment cleaned up')
})

beforeEach(async () => {
  // Test isolation is handled by vi.clearAllMocks() in individual tests
})

afterEach(async () => {
  // Test cleanup is handled by vi.clearAllMocks() in individual tests
})

// Helper function to create test recipe data
export function createTestRecipeData(overrides = {}) {
  return {
    name: 'Test Recipe',
    summary: 'A test recipe summary',
    description: 'A detailed test recipe description',
    ingredients: ['Test ingredient 1', 'Test ingredient 2'],
    preparationSteps: ['Test step 1', 'Test step 2'],
    image: 'https://example.com/test-image.jpg',
    ...overrides
  }
}