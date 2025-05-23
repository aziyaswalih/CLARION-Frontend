import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API requests
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { EmailIcon } from "../../../components/ui/email-icon";
// import Header from "../../../components/beneficiary/Header/Header";
// import Footer from "../../../components/beneficiary/Footer/Footer";
import { Label } from "@radix-ui/react-label";

export default function OTPVerification() {
  const [otp, setOtp] = useState<string>(""); // OTP input
  const [timeLeft, setTimeLeft] = useState<number>(10); // Timer for resend
  const [showResend, setShowResend] = useState<boolean>(false); // Show resend button
  const [loading, setLoading] = useState<boolean>(false); // Loading state for buttons

  // const API_BASE_URL = "http://localhost:5000/api/user";

  // Timer countdown
  useEffect(() => {
    if (timeLeft === 0) {
      setShowResend(true);
    }
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer on component unmount
    }
  }, [timeLeft]);

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/auth/verify-otp`,
        {
          otp,
        }
      );
      alert(response.data.message || "OTP verified successfully!");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      alert(error.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/auth/send-otp`
      );
      alert(response.data.message || "OTP resent successfully!");
      setTimeLeft(10); // Reset timer
      setShowResend(false); // Hide resend button
      setOtp(""); // Clear OTP input
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      alert(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#877356]">
      {/* <Header /> */}
      <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="gap-8 max-w-5xl mx-auto">
          {/* Centered OTP Verification */}
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
            <EmailIcon />
            <h2 className="text-lg font-medium text-center">
              VERIFY YOUR EMAIL
            </h2>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center"
            />
            <div>
              {showResend ? (
                <Button
                  onClick={handleResendOTP}
                  className="w-full text-[#956d09]"
                  disabled={loading}
                >
                  {loading ? "Resending..." : "Resend OTP"}
                </Button>
              ) : (
                <Label className="w-full text-[#956d09] text-center">
                  You can resend OTP after {timeLeft} seconds
                </Label>
              )}
            </div>
            <Button
              onClick={handleVerifyOTP}
              className="w-full bg-[#b8860b] hover:bg-[#956d09] text-white"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Submit OTP"}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              ENTER THE OTP SENT TO YOUR EMAIL
            </p>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
