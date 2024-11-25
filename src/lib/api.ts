import axios from 'axios';
import { signOut } from 'next-auth/react';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle unauthorized access
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/authclient/Login' });
      return Promise.reject(error);
    }
    
    // Handle profile not found
    if (error.response?.status === 404 && error.response?.data?.error === 'Profile not found') {
      return Promise.reject({
        response: {
          status: 404,
          data: { error: 'NO_PROFILE' }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;