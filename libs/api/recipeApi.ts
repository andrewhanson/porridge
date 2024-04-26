import { recipes } from './data/recipes'

const recipeApi = {
  fetch: async(id:string) => {
    const recipe = recipes.find((recipe) => recipe.id === id);
    return await Promise.resolve(recipe);
  },
  get: async () => {
    return await Promise.resolve(recipes);
  }
}

export default recipeApi;