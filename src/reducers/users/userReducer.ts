import { createSlice } from "@reduxjs/toolkit";
import { userSignup, verifyOtp, resendOtp ,loginAsync} from "./userActions";

interface User {
     id: string;
     name: string,
     email: string,
     phone: string,
     isActive: boolean,
     role: "admin" | "donor" | "volunteer" | "user",
     is_verified: boolean,
     password: string,
     profilePic: string
}
interface UserState {
  user: null | User;
  token: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  isOtpSent: boolean;
}
const user = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')as string)as User:null
const initialState: UserState = {
  user: user,
  token: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  isOtpSent: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(userSignup.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    })
    .addCase(userSignup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.token = action.payload.token;
      state.isOtpSent = true;
      state.message = action.payload.message;
    })
    .addCase(userSignup.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload as string;
    }).addCase(loginAsync.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    })
    .addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload.user;      
      state.isLoading = false;
      state.isSuccess = true;
      state.token = action.payload.token;
      state.message = action.payload.message;
    })
    .addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload as string;
    })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.isOtpSent = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isOtpSent = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isOtpSent = true;
        state.message = action.payload as string;
      })
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.isOtpSent = true;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.isOtpSent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isOtpSent = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
