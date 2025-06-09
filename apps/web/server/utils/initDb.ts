import { query } from '~/server/utils/db'

export async function initializeDatabase() {
  try {
    // Create recipes table
    await query(`
      CREATE TABLE IF NOT EXISTS recipes (
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
      )
    `)

    // Create index for faster queries
    await query(`
      CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
    `)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}