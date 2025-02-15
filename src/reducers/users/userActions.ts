// import { Dispatch } from "redux";
// import { useraxiosInstance } from "../../api/useraxios";

// // Action Types
// export const REGISTER_USER_REQUEST = "REGISTER_USER_REQUEST";
// export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
// export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";

// export const VERIFY_OTP_REQUEST = "VERIFY_OTP_REQUEST";
// export const VERIFY_OTP_SUCCESS = "VERIFY_OTP_SUCCESS";
// export const VERIFY_OTP_FAILURE = "VERIFY_OTP_FAILURE";

// export const RESEND_OTP_REQUEST = "RESEND_OTP_REQUEST";
// export const RESEND_OTP_SUCCESS = "RESEND_OTP_SUCCESS";
// export const RESEND_OTP_FAILURE = "RESEND_OTP_FAILURE";

// // Register User
// export const registerUser = (formData: any) => async (dispatch: Dispatch) => {
//   try {
//     dispatch({ type: REGISTER_USER_REQUEST });

//     const response = await useraxiosInstance.post("/register", formData);

//     dispatch({
//       type: REGISTER_USER_SUCCESS,
//       payload: response.data,
//     });
//   } catch (error:any) {
//     dispatch({
//       type: REGISTER_USER_FAILURE,
//       payload: error.response?.data || error.message,
//     });
//   }
// };

// // Verify OTP
// export const verifyOtp = (token: string, otp: string) => async (dispatch: Dispatch) => {
//   try {
//     dispatch({ type: VERIFY_OTP_REQUEST });

//     const response = await useraxiosInstance.post("/verifyOtp", { token, otp });

//     dispatch({
//       type: VERIFY_OTP_SUCCESS,
//       payload: response.data,
//     });
//   } catch (error:any) {
//     dispatch({
//       type: VERIFY_OTP_FAILURE,
//       payload: error.response?.data || error.message,
//     });
//   }
// };

// // Resend OTP
// export const resendOtp = (token: string) => async (dispatch: Dispatch) => {
//   try {
//     dispatch({ type: RESEND_OTP_REQUEST });

//     const response = await useraxiosInstance.post("/resendOtp", { token });

//     dispatch({
//       type: RESEND_OTP_SUCCESS,
//       payload: response.data,
//     });
//   } catch (error:any) {
//     dispatch({
//       type: RESEND_OTP_FAILURE,
//       payload: error.response?.data || error.message,
//     });
//   }
// };


import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// **User Signup Action**
export const userSignup = createAsyncThunk(
  "user/signup",
  async (userData: UserSignupData, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ message: string; token: string }>(
        "http://localhost:5000/api/user/register",
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
      const response = await axios.post<{ message: string }>(
        "http://localhost:5000/api/user/verifyOtp",
        otpData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

// **Resend OTP Action**
export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (otpData: ResendOtpData, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ message: string }>(
        "http://localhost:5000/api/user/resendOtp",
        otpData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to resend OTP");
    }
  }
);
