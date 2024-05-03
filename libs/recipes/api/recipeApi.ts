import { recipes } from './data'

const recipeApi = {
  fetch: async(id:string) => {
    const recipe = recipes.find((recipe) => recipe.id === id);
    return await Promise.resolve(recipe);
  },
  get: async () => {
    return await Promise.resolve(recipes);
  }
}

export {recipeApi};