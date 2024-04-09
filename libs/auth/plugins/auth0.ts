import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((app) => {
  
  const config = useRuntimeConfig() as any;

  const auth0 = createAuth0({
    ...config.public.auth0,
    postLogoutRedirectUri: config.public.auth0.postLogoutRedirectUri,
  });

  if(process.client){
    app.vueApp.use(auth0);
  }

  addRouteMiddleware('auth', async () => {
    if (process.client) {
      await auth0.checkSession()
      
      if(auth0.isLoading.value){
        return;
      }

      if (!auth0.isAuthenticated.value) {
        auth0.loginWithRedirect({
          appState: {
            target: useRoute().path,
          },
        })
      }
    }
  })
});