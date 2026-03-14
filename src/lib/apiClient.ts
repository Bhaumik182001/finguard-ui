import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Ensure this matches your Spring Boot port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('finguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Global Error Handling for Business Logic
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific Spring Boot Exceptions
    if (error.response?.status === 401) {
      toast.error('Authentication Required. Please login.');
    } else if (error.response?.status === 403) {
      const message = error.response?.data?.message || 'Access Denied.';
      toast.error(message);
    } else if (error.response?.status === 400 || error.response?.status === 422) {
      const message = error.response?.data?.message || 'Transaction Failed.';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;