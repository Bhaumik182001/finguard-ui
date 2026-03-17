import apiClient from '@/lib/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

// Added the registration payload
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('finguard_token', response.data.token);
    }
    return response.data;
  },

  // NEW: Registration method hitting your backend's /register endpoint
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
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