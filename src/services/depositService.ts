import api from '@/lib/axios';

export interface DepositRequest {
  amount: number;
  receiptUrl?: string;
  transactionHash?: string;
  notes?: string;
}

export interface Deposit {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  transactionHash?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface DepositResponse {
  success: boolean;
  message?: string;
  deposit?: Deposit;
  deposits?: Deposit[];
  error?: string;
  details?: string;
}

export const depositService = {
  // Create a new deposit request
  async createDeposit(depositData: DepositRequest): Promise<DepositResponse> {
    try {
      const response = await api.post('/api/deposits', depositData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Failed to create deposit request');
    }
  },

  // Get user's deposit history
  async getDeposits(): Promise<DepositResponse> {
    try {
      const response = await api.get('/api/deposits');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Failed to fetch deposits');
    }
  },

  // Admin: Confirm a deposit
  async confirmDeposit(depositId: string, notes?: string): Promise<DepositResponse> {
    try {
      const response = await api.put(`/api/deposits/${depositId}/confirm`, { notes });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Failed to confirm deposit');
    }
  }
}; 