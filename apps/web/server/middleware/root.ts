export default defineEventHandler((event) => {
  // Only handle requests to the root path
  if (getRequestURL(event).pathname === '/') {
    // You can perform any server-side operations here
    // For example, checking authentication, database queries, etc.
    console.log('Processing root request on server', event)
    
    // You can set headers or modify the event
    setHeader(event, 'x-processed-by', 'server')
    
    // You can also set response data that will be available in your components
    event.context.serverData = {
      processedAt: new Date().toISOString()
    }
  }
})