import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finguard_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors & 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // THE BOUNCER: If the token is expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('finguard_token');
      // Only redirect if we aren't already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        toast.error("Session expired. Please log in again.");
      }
    } 
    // Handle Business Logic Errors (400 Bad Request)
    else if (error.response?.status === 400) {
      const serverMessage = error.response?.data?.message || error.response?.data?.errors?.[0];
      if (serverMessage) {
        toast.error("Transaction Failed", { description: serverMessage });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;