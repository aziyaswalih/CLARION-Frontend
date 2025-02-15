import { useraxiosInstance } from "../api/useraxios"; // Adjust the path as needed

// Register user
export const registerUser = async (formData: any) => {
  const response = await useraxiosInstance.post("/register", formData);
  return response.data;
};

// Verify OTP
export const verifyOtp = async (token: string, otp: string) => {
  const response = await useraxiosInstance.post("/verifyOtp", { token, otp });
  return response.data;
};

// Resend OTP
export const resendOtp = async (token: string) => {
  const response = await useraxiosInstance.post("/resendOtp", { token });
  return response.data;
};
