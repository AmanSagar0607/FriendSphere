import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;
console.log('API URL:', apiUrl); // Keep this line for debugging

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (username, password) => {
  console.log('Attempting login with:', { username, password });
  return api.post('/auth/login', { username, password })
    .then(response => {
      console.log('Login response:', response);
      return response;
    })
    .catch(error => {
      console.error('Login error:', error.response || error);
      throw error;
    });
};

export const signup = (username, password) => {
  return api.post('/auth/signup', { username, password }); // Remove the extra '/api'
};

export const getUserData = () => {
  console.log('Fetching user data');
  return api.get('/auth/user')
    .then(response => {
      console.log('User data response:', response);
      return response;
    })
    .catch(error => {
      console.error('Error fetching user data:', error.response || error);
      throw error;
    });
};

// Add more API calls as needed

export default api;