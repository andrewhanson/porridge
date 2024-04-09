import { sampleData } from './data'

const recipeApi = {
  fetch: async(id:string) => {
    const recipe = sampleData.find((recipe) => recipe.id === id);
    return await Promise.resolve(recipe);
  },
  get: async () => {
    return await Promise.resolve(sampleData);
  }

}

export { recipeApi }