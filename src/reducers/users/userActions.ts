import { createAsyncThunk } from "@reduxjs/toolkit";
import  useraxiosInstance  from "../../api/useraxios";

interface UserSignupData {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface VerifyOtpData {
  token: string;
  otp: string;
}

interface ResendOtpData {
  token: string;
}

interface LoginData {
  email:string;
  password:string;
}


interface ResetPasswordData {
  email: string;
  password: string;
}

// **Reset Password Action**
export const resetPasswordAsync = createAsyncThunk(
  "user/resetPassword",
  async (resetData: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await useraxiosInstance.post<{ message: string }>(
        "/user/reset-password",
        resetData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// **User Signup Action**
export const userSignup = createAsyncThunk(
  "user/signup",
  async (userData: UserSignupData, { rejectWithValue }) => {
    try {
      const response = await useraxiosInstance.post<{ message: string; token: string }>(
        "/user/register",
        userData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// **Verify OTP Action**
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async (otpData: VerifyOtpData, { rejectWithValue }) => {
      try {
          const response = await useraxiosInstance.post<{ message: string }>(
              "/user/verifyOtp",
              otpData
          );
          // Remove otpToken from localStorage after successful OTP verification
          localStorage.removeItem('otpToken');
          return response.data;
      } catch (error: any) {
          return rejectWithValue(error.response?.data?.message || "OTP verification failed");
      }
  }
);
// send otp
export const sendOTP = createAsyncThunk("user/sendOTP",
  async (email : string, {rejectWithValue}) => {
    try {
      const otpResponse = await useraxiosInstance.post<{ otpToken: string; message: string; user: any }>(
        "/user/send-otp",
        { email}
      );
      return otpResponse.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to resend OTP");

    }
  }
  

)
// **Resend OTP Action**
export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (otpData: ResendOtpData, { rejectWithValue }) => {
    try {
      const response = await useraxiosInstance.post<{ message: string }>(
        "/user/resendOtp",
        otpData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to resend OTP");
    }
  }
);

export const loginAsync = createAsyncThunk(
  "user/login",
  async (loginData: LoginData, { rejectWithValue }) => {
      try {
          const response = await useraxiosInstance.post<{ token: string; message: string; user: any }>(
              "/user/login",
              loginData
          );
          // Store authToken in localStorage after successful login
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem('user',JSON.stringify(response.data.user))
          return response.data;
      } catch (error: any) {
          return rejectWithValue(error.response?.data?.message || "Login failed");
      }
  }
);