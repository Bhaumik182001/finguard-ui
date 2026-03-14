export interface TransactionResponse {
  transactionReference: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionType: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
  createdAt: string;
}

export interface TransactionRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  transactionType: 'TRANSFER';
}