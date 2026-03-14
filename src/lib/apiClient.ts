import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Matches your Spring Boot port
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
    if (error.response?.status === 401) {
      toast.error('Authentication Required', { description: 'Please login to continue.' });
    } else if (error.response?.status === 403) {
      const message = error.response?.data?.message || 'Access Denied.';
      toast.error('Access Denied', { description: message });
    } else if (error.response?.status === 400 || error.response?.status === 422) {
      const message = error.response?.data?.message || 'Transaction Failed.';
      toast.error('Error', { description: message });
    }

    return Promise.reject(error);
  }
);

export default apiClient;