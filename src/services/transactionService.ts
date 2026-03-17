import apiClient from '@/lib/apiClient';
import type { TransactionRequest, Transaction, PaginatedTransactions } from '@/types/transaction';

export const transactionService = {
  transfer: async (payload: TransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/api/v1/transactions', payload);
    return response.data;
  },

  getHistory: async (page: number = 0, size: number = 10): Promise<PaginatedTransactions> => {
    const response = await apiClient.get<PaginatedTransactions>(
      `/api/v1/transactions?page=${page}&size=${size}`
    );
    return response.data;
  }
};