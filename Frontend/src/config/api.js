// API Configuration
const API_BASE_URL = 'https://fast-delivery-site-ijsb.vercel.app';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      profile: '/api/auth/profile',
      logout: '/api/auth/logout'
    },
    clients: '/api/clients',
    deliverers: '/api/deliverers',
    deliveries: '/api/deliveries',
    categories: '/api/categories',
    health: '/api/health'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
