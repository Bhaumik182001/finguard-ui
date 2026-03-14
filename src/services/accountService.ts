import apiClient from '@/lib/apiClient';
import type { Account } from '@/types/account';

export const accountService = {
  getMyAccounts: async (): Promise<Account[]> => {
    // --- TEMP MOCK DATA MATCHING SPRING BOOT CONTRACT ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab",
            accountNumber: "ACC-1001",
            balance: 5000.00,
            currency: "USD"
          },
          {
            id: "f9e8d7c6-b5a4-3210-fedc-ba0987654321",
            accountNumber: "ACC-9999",
            balance: 1000.00,
            currency: "USD"
          }
        ]);
      }, 800);
    });

    // --- REAL IMPLEMENTATION (Uncomment when Spring Boot is live) ---
    // const response = await apiClient.get<Account[]>('/api/v1/accounts');
    // return response.data;
  }
};