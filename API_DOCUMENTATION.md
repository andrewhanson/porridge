# Recipe API Documentation

This document describes the Recipe API backend that has been implemented for the Porridge application.

## Overview

The Recipe API provides endpoints for managing porridge recipes with the following features:

- **Read Access**: Anonymous users can read recipe data
- **Write Access**: Authenticated users can create, update, and delete recipes
- **Database**: PostgreSQL for persistent storage
- **Authentication**: Bearer token authentication (integrates with existing Auth0 setup)
- **Documentation**: OpenAPI 3.0 specification available

## Environment Variables

The following environment variables need to be configured:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=porridge
POSTGRES_USER=username
POSTGRES_PASSWORD=password
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /api/recipes
- **Description**: Retrieve all recipes
- **Response**: Array of recipe objects
- **Status Codes**: 200 (success), 500 (server error)

#### GET /api/recipes/{id}
- **Description**: Retrieve a specific recipe by ID
- **Parameters**: `id` (string) - Recipe ID
- **Response**: Recipe object
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

#### GET /api/docs
- **Description**: Get OpenAPI specification
- **Response**: OpenAPI 3.0 specification object
- **Status Codes**: 200 (success)

### Protected Endpoints (Authentication Required)

#### POST /api/recipes
- **Description**: Create a new recipe
- **Authentication**: Bearer token required
- **Request Body**: CreateRecipe object
- **Response**: Created recipe object
- **Status Codes**: 201 (created), 400 (bad request), 401 (unauthorized), 500 (server error)

#### PUT /api/recipes/{id}
- **Description**: Update an existing recipe
- **Authentication**: Bearer token required
- **Parameters**: `id` (string) - Recipe ID
- **Request Body**: UpdateRecipe object (partial)
- **Response**: Updated recipe object
- **Status Codes**: 200 (success), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

#### DELETE /api/recipes/{id}
- **Description**: Delete a recipe
- **Authentication**: Bearer token required
- **Parameters**: `id` (string) - Recipe ID
- **Response**: No content
- **Status Codes**: 204 (deleted), 401 (unauthorized), 404 (not found), 500 (server error)

## Data Models

### Recipe Object
```typescript
{
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
```

### CreateRecipe Object
```typescript
{
  name: string
  image?: string
  summary: string
  description: string
  ingredients: string[]
  preparationSteps: string[]
  createdBy?: string
}
```

### UpdateRecipe Object
```typescript
{
  name?: string
  image?: string
  summary?: string
  description?: string
  ingredients?: string[]
  preparationSteps?: string[]
}
```

## Database Schema

The API automatically creates the following PostgreSQL table:

```sql
CREATE TABLE recipes (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  preparation_steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255)
);
```

## Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

**Note**: The current implementation includes a placeholder authentication system. For production use, integrate with your existing Auth0 setup by:

1. Installing a JWT verification library (e.g., `jose`)
2. Updating `server/utils/auth.ts` to verify Auth0 JWT tokens
3. Extracting user information from the verified token

## Example Usage

### Get All Recipes
```bash
curl -X GET http://localhost:3000/api/recipes
```

### Create a Recipe (with authentication)
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Vanilla Almond Porridge",
    "summary": "Creamy porridge with vanilla and almonds",
    "description": "A delicious breakfast option...",
    "ingredients": ["1 cup oats", "2 cups almond milk", "1 tsp vanilla"],
    "preparationSteps": ["Combine ingredients", "Cook for 5 minutes", "Serve hot"]
  }'
```

### Update a Recipe
```bash
curl -X PUT http://localhost:3000/api/recipes/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Updated Recipe Name"
  }'
```

### Delete a Recipe
```bash
curl -X DELETE http://localhost:3000/api/recipes/{id} \
  -H "Authorization: Bearer <your-token>"
```

## Client Integration

The client-side `recipeApi` has been updated to use these HTTP endpoints. The API methods are:

- `recipeApi.get()` - Get all recipes
- `recipeApi.fetch(id)` - Get recipe by ID
- `recipeApi.create(recipe)` - Create new recipe (requires auth)
- `recipeApi.update(id, updates)` - Update recipe (requires auth)
- `recipeApi.delete(id)` - Delete recipe (requires auth)

## Development Setup

1. Install dependencies: `pnpm install`
2. Set up PostgreSQL database
3. Configure environment variables in `.env` file
4. Run the application: `pnpm dev`
5. The database will be automatically initialized with existing recipe data

## Production Deployment

1. Ensure PostgreSQL is available and configured
2. Set all required environment variables
3. Build the application: `pnpm build`
4. Start the server: `node .output/server/index.mjs`

The API will be available at `/api/*` endpoints.