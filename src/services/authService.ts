import apiClient from '@/lib/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    
    // Assuming your Spring Boot backend returns { token: "..." }
    const token = response.data.token;
    if (token) {
      localStorage.setItem('finguard_token', token);
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('finguard_token');
    window.location.href = '/login';
  }
};
