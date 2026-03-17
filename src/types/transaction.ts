export interface Transaction {
  id: string;             // UUID or Reference ID
  amount: number;
  type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL'; // Changed from transactionType
  createdAt: string;      // The backend confirmed "timestamp" in the error JSON
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'COMPLETED';
  description: string;
  sourceAccountId: string;      // New key
  destinationAccountId: string; // New key
}


export interface PaginatedTransactions {
  content: Transaction[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page index
  last: boolean;
  first: boolean;
}

export interface TransactionRequest {
  sourceAccountId: string;      // Changed from sourceAccountNumber
  destinationAccountId: string; // Changed from destinationAccountNumber
  amount: number;
  currency: string;
  type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL'; // Changed from transactionType
  description: string;
}