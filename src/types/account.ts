export interface Account {
  id: string; // Updated to match UUID string
  accountNumber: string; // Updated to camelCase
  balance: number;
  currency: string;
}