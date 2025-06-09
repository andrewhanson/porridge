/**
 * @openapi
 * /api/docs:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI specification for the Recipe API
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export default defineEventHandler(async (event) => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Porridge Recipe API',
      version: '1.0.0',
      description: 'API for managing porridge recipes'
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            image: { type: 'string', nullable: true },
            summary: { type: 'string' },
            description: { type: 'string' },
            ingredients: {
              type: 'array',
              items: { type: 'string' }
            },
            preparationSteps: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            createdBy: { type: 'string', nullable: true }
          },
          required: ['id', 'name', 'summary', 'description', 'ingredients', 'preparationSteps']
        },
        CreateRecipe: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            image: { type: 'string' },
            summary: { type: 'string' },
            description: { type: 'string' },
            ingredients: {
              type: 'array',
              items: { type: 'string' }
            },
            preparationSteps: {
              type: 'array',
              items: { type: 'string' }
            },
            createdBy: { type: 'string' }
          },
          required: ['name', 'summary', 'description', 'ingredients', 'preparationSteps']
        },
        UpdateRecipe: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            image: { type: 'string' },
            summary: { type: 'string' },
            description: { type: 'string' },
            ingredients: {
              type: 'array',
              items: { type: 'string' }
            },
            preparationSteps: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    },
    paths: {
      '/recipes': {
        get: {
          summary: 'Get all recipes',
          description: 'Retrieve all recipes. No authentication required for reading.',
          tags: ['Recipes'],
          responses: {
            '200': {
              description: 'List of recipes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Recipe' }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error'
            }
          }
        },
        post: {
          summary: 'Create a new recipe',
          description: 'Create a new recipe. Requires authentication.',
          tags: ['Recipes'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateRecipe' }
              }
            }
          },
          responses: {
            '201': {
              description: 'Recipe created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Recipe' }
                }
              }
            },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          }
        }
      },
      '/recipes/{id}': {
        get: {
          summary: 'Get a recipe by ID',
          description: 'Retrieve a specific recipe by its ID. No authentication required for reading.',
          tags: ['Recipes'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Recipe ID'
            }
          ],
          responses: {
            '200': {
              description: 'Recipe found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Recipe' }
                }
              }
            },
            '404': { description: 'Recipe not found' },
            '500': { description: 'Internal server error' }
          }
        },
        put: {
          summary: 'Update a recipe',
          description: 'Update an existing recipe. Requires authentication.',
          tags: ['Recipes'],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Recipe ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateRecipe' }
              }
            }
          },
          responses: {
            '200': {
              description: 'Recipe updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Recipe' }
                }
              }
            },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Recipe not found' },
            '500': { description: 'Internal server error' }
          }
        },
        delete: {
          summary: 'Delete a recipe',
          description: 'Delete an existing recipe. Requires authentication.',
          tags: ['Recipes'],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Recipe ID'
            }
          ],
          responses: {
            '204': { description: 'Recipe deleted successfully' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Recipe not found' },
            '500': { description: 'Internal server error' }
          }
        }
      }
    }
  }

  return spec
})