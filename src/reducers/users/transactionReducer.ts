// transactionReducer.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAxiosInstance from '../../api/useraxios';

export const fetchUserTransactions = createAsyncThunk(
  'transaction/fetchUserTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAxiosInstance.get('/user/transactions');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong');
    }
  }
);

export interface Transaction {
    _id: string;
    userId: string;
    amount: number;
    mode: 'wallet' | 'razorpay' | 'wallet+razorpay';
    walletUsed: number;
    razorpayUsed: number;
    status: 'pending' | 'success' | 'failed' | 'refunded';
    purpose: string;
    razorpayPaymentId?: string;
    date: string; // ISO string if from backend
  }
  
interface TransactionState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string;
  }
  const initialState: TransactionState = {
    transactions: [],
    isLoading: false,
    error: '',
  };

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
