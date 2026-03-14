import apiClient from '../lib/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (payload: LoginRequest) => {
  const response = await apiClient.post('/api/v1/auth/login', payload);
  const token = response.data?.token;
  if (token) {
    localStorage.setItem('finguard_token', token);
  } else if (typeof response.data === 'string') {
    localStorage.setItem('finguard_token', response.data);
  }
  return response.data;
};
