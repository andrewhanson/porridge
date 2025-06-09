
export default defineNuxtConfig({
  devtools: { enabled: true }, 
  ssr: false, 
  extends: [
    "@app/ui",
    "@app/auth",
    "@app/users",
    "@app/recipes"
  ],
  runtimeConfig: {
    // Private keys (only available on server-side)
    databaseUrl: process.env.DATABASE_URL,
    postgresHost: process.env.POSTGRES_HOST,
    postgresPort: process.env.POSTGRES_PORT,
    postgresDb: process.env.POSTGRES_DB,
    postgresUser: process.env.POSTGRES_USER,
    postgresPassword: process.env.POSTGRES_PASSWORD,
    // Public keys (exposed to client-side)
    public: {
      // Add any public runtime config here if needed
    }
  }
})
