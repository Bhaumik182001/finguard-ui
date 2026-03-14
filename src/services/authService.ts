import apiClient from '@/lib/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

// Added the exact DTO from the Spring Boot contract
export interface AuthResponse {
  token: string;
  message: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
    
    // We perfectly match the "token" key from the backend
    if (response.data.token) {
      localStorage.setItem('finguard_token', response.data.token);
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('finguard_token');
    window.location.href = '/login';
  }
};