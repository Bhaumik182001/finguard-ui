import apiClient from '@/lib/apiClient';
import type { Account } from '@/types/account';

export const accountService = {
  // GET /api/v1/accounts - Token is handled by our interceptor
  getMyAccounts: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>('/api/v1/accounts');
    return response.data;
  }
};