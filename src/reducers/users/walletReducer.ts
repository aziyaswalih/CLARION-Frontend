
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAxiosInstance from '../../api/useraxios';

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAxiosInstance.get('/wallet');
      return res.data;
    } catch (err : any) {
      return rejectWithValue(err.response.data);
    }
  }
);
interface WalletState {
  walletBalance: number;
    walletTransactions: Array<{ id: string; amount: number; date: string; description: string }> | null;
    walletLoading: boolean;
    error: string | null;
}
const initialState: WalletState = {
    walletBalance: 0,
    walletTransactions: [],
    walletLoading: false,
    error: null,
  }
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.walletLoading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.walletBalance = action.payload.balance;
        state.walletTransactions = action.payload.transactions;
        state.walletLoading = false;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.walletLoading = false;
        state.error = action.payload as string || 'Failed to fetch wallet data';
      });
  },
});

export default walletSlice.reducer;
