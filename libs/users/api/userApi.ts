import { userData } from './data';

const userApi = {
  fetch: async (id: string) => {
    const user = userData.find((user) => user.id === id);
    return await Promise.resolve(user);
  },
  get: async () => {
    return await Promise.resolve(userData);
  }
};


export { userApi };