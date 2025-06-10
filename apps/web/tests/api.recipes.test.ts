import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockUser, mockAuthToken, createTestRecipeData } from './setup'

// Mock the auth utility
vi.mock('~/server/utils/auth', () => ({
  requireAuth: vi.fn(async (event: any) => {
    const authHeader = event.headers?.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Authentication required')
      ;(error as any).statusCode = 401
      throw error
    }
    
    const token = authHeader.substring(7)
    if (token === mockAuthToken) {
      return mockUser
    }
    
    const error = new Error('Invalid authentication token')
    ;(error as any).statusCode = 401
    throw error
  })
}))

// Mock the database module
vi.mock('@app/database', () => {
  const mockPrisma = {
    recipe: {
      findMany: vi.fn(),
      findUnique: vi.fn(), 
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn()
    }
  }
  
  return {
    prisma: mockPrisma,
    CreateRecipeSchema: {
      parse: vi.fn((data) => {
        if (!data.name || !data.summary || !data.description || !data.ingredients || !data.preparationSteps) {
          const error = new Error('Validation failed')
          error.name = 'ZodError'
          error.errors = [{ message: 'Required fields missing' }]
          throw error
        }
        return data
      })
    },
    UpdateRecipeSchema: {
      parse: vi.fn((data) => {
        if (data.name === '') {
          const error = new Error('Validation failed')
          error.name = 'ZodError'
          error.errors = [{ message: 'Name cannot be empty' }]
          throw error
        }
        return data
      })
    }
  }
})

// Import the actual handlers after mocking
import getRecipesHandler from '../server/api/recipes/index.get'
import getRecipeHandler from '../server/api/recipes/[id].get'
import createRecipeHandler from '../server/api/recipes/index.post'
import updateRecipeHandler from '../server/api/recipes/[id].put'
import deleteRecipeHandler from '../server/api/recipes/[id].delete'

// Get access to mocked prisma
import { prisma } from '@app/database'
const mockPrisma = prisma as any

// Helper to create mock events
function createMockEvent(options: any = {}) {
  return {
    headers: options.headers || {},
    body: options.body,
    context: {
      params: options.params || {}
    },
    status: 200,
    ...options
  }
}

describe('/api/recipes API endpoints', () => {
  const testRecipeId = 'test-recipe-123'
  const testRecipe = {
    id: testRecipeId,
    name: 'Test Recipe',
    summary: 'A test recipe summary',
    description: 'A detailed test recipe description',
    ingredients: ['Test ingredient 1', 'Test ingredient 2'],
    preparationSteps: ['Test step 1', 'Test step 2'],
    image: 'https://example.com/test-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: mockUser.id,
    tags: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/recipes', () => {
    it('should return an empty array when no recipes exist', async () => {
      mockPrisma.recipe.findMany.mockResolvedValue([])
      
      const event = createMockEvent()
      const response = await getRecipesHandler(event)
      
      expect(Array.isArray(response)).toBe(true)
      expect(response).toEqual([])
      expect(mockPrisma.recipe.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should return all recipes in descending order by creation date', async () => {
      const recipes = [
        { ...testRecipe, name: 'Test Recipe 2' },
        { ...testRecipe, name: 'Test Recipe 1' }
      ]
      mockPrisma.recipe.findMany.mockResolvedValue(recipes)

      const event = createMockEvent()
      const response = await getRecipesHandler(event)
      
      expect(Array.isArray(response)).toBe(true)
      expect(response).toHaveLength(2)
      expect(response[0].name).toBe('Test Recipe 2')
      expect(response[1].name).toBe('Test Recipe 1')
    })

    it('should handle database errors', async () => {
      mockPrisma.recipe.findMany.mockRejectedValue(new Error('Database error'))

      const event = createMockEvent()
      
      await expect(getRecipesHandler(event)).rejects.toThrow()
    })
  })

  describe('GET /api/recipes/[id]', () => {
    it('should return a recipe by ID', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(testRecipe)

      const event = createMockEvent({
        context: { params: { id: testRecipeId } }
      })
      
      const response = await getRecipeHandler(event)
      
      expect(response).toEqual(testRecipe)
      expect(mockPrisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: testRecipeId }
      })
    })

    it('should throw 404 for non-existent recipe', async () => {
      mockPrisma.recipe.findUnique.mockResolvedValue(null)

      const event = createMockEvent({
        context: { params: { id: 'non-existent-id' } }
      })
      
      await expect(getRecipeHandler(event)).rejects.toThrow()
    })

    it('should throw 400 for missing ID', async () => {
      const event = createMockEvent({
        context: { params: {} }
      })
      
      await expect(getRecipeHandler(event)).rejects.toThrow()
    })
  })

  describe('POST /api/recipes', () => {
    it('should create a new recipe with valid data and authentication', async () => {
      const recipeData = createTestRecipeData()
      const createdRecipe = { ...testRecipe, ...recipeData }
      mockPrisma.recipe.create.mockResolvedValue(createdRecipe)

      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        body: recipeData
      })
      
      const response = await createRecipeHandler(event)
      
      expect(response).toEqual(createdRecipe)
      expect(event.status).toBe(201)
      expect(mockPrisma.recipe.create).toHaveBeenCalledWith({
        data: {
          name: recipeData.name,
          image: recipeData.image,
          summary: recipeData.summary,
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          preparationSteps: recipeData.preparationSteps,
          createdBy: mockUser.id
        }
      })
    })

    it('should throw 401 without authentication', async () => {
      const recipeData = createTestRecipeData()
      const event = createMockEvent({
        body: recipeData
      })
      
      await expect(createRecipeHandler(event)).rejects.toThrow()
    })

    it('should throw 400 for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
        summary: 'Test summary'
        // Missing required fields
      }
      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        body: invalidData
      })
      
      await expect(createRecipeHandler(event)).rejects.toThrow()
    })
  })

  describe('PUT /api/recipes/[id]', () => {
    it('should update an existing recipe with valid data and authentication', async () => {
      const updateData = {
        name: 'Updated Test Recipe',
        summary: 'Updated summary',
        description: 'Updated description',
        ingredients: ['Updated ingredient 1', 'Updated ingredient 2'],
        preparationSteps: ['Updated step 1', 'Updated step 2']
      }
      const updatedRecipe = { ...testRecipe, ...updateData }
      mockPrisma.recipe.update.mockResolvedValue(updatedRecipe)

      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        body: updateData,
        context: { params: { id: testRecipeId } }
      })
      
      const response = await updateRecipeHandler(event)
      
      expect(response).toEqual(updatedRecipe)
      expect(mockPrisma.recipe.update).toHaveBeenCalledWith({
        where: { id: testRecipeId },
        data: updateData
      })
    })

    it('should throw 401 without authentication', async () => {
      const updateData = { name: 'Updated Recipe' }
      const event = createMockEvent({
        body: updateData,
        context: { params: { id: testRecipeId } }
      })
      
      await expect(updateRecipeHandler(event)).rejects.toThrow()
    })

    it('should throw 404 for non-existent recipe', async () => {
      const updateData = { name: 'Updated Recipe' }
      const error = new Error('Record not found')
      error.code = 'P2025'
      mockPrisma.recipe.update.mockRejectedValue(error)

      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        body: updateData,
        context: { params: { id: 'non-existent-id' } }
      })
      
      await expect(updateRecipeHandler(event)).rejects.toThrow()
    })

    it('should allow partial updates', async () => {
      const partialUpdateData = {
        name: 'Partially Updated Recipe'
      }
      const updatedRecipe = { ...testRecipe, ...partialUpdateData }
      mockPrisma.recipe.update.mockResolvedValue(updatedRecipe)

      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        body: partialUpdateData,
        context: { params: { id: testRecipeId } }
      })
      
      const response = await updateRecipeHandler(event)
      
      expect(response.name).toBe(partialUpdateData.name)
      expect(response.summary).toBe(testRecipe.summary) // Original value preserved
    })
  })

  describe('DELETE /api/recipes/[id]', () => {
    it('should delete an existing recipe with authentication', async () => {
      mockPrisma.recipe.delete.mockResolvedValue(testRecipe)

      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        context: { params: { id: testRecipeId } }
      })
      
      const response = await deleteRecipeHandler(event)
      
      expect(response).toBe(null)
      expect(event.status).toBe(204)
      expect(mockPrisma.recipe.delete).toHaveBeenCalledWith({
        where: { id: testRecipeId }
      })
    })

    it('should throw 401 without authentication', async () => {
      const event = createMockEvent({
        context: { params: { id: testRecipeId } }
      })
      
      await expect(deleteRecipeHandler(event)).rejects.toThrow()
    })

    it('should throw 404 for non-existent recipe', async () => {
      const error = new Error('Record not found')
      error.code = 'P2025'
      mockPrisma.recipe.delete.mockRejectedValue(error)

      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        context: { params: { id: 'non-existent-id' } }
      })
      
      await expect(deleteRecipeHandler(event)).rejects.toThrow()
    })

    it('should throw 400 for missing ID', async () => {
      const event = createMockEvent({
        headers: { authorization: `Bearer ${mockAuthToken}` },
        context: { params: {} }
      })
      
      await expect(deleteRecipeHandler(event)).rejects.toThrow()
    })
  })
})