import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { sendOTP, verifyOtp, resetPasswordAsync } from "../../../reducers/users/userActions";
import { toast } from "react-toastify";
import Footer from "../../../components/beneficiary/Footer/Footer";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSendOtp = async () => {
    try {
      const result = await dispatch(sendOTP(formData.email ));
      if (sendOTP.fulfilled.match(result)) {
        localStorage.setItem("token", result.payload.otpToken[1]);
        console.log("token", result.payload.otpToken[1]);
        
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please request OTP again.");
      return;
    }

    const result = await dispatch(verifyOtp({ token, otp: formData.otp }));
    if (verifyOtp.fulfilled.match(result)) {
      localStorage.removeItem("token");
      setOtpVerified(true);
      toast.success("OTP successfully verified!");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpVerified) return;
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await dispatch(
      resetPasswordAsync({ email: formData.email, password: formData.newPassword })
    );
    setLoading(false);

    if (resetPasswordAsync.fulfilled.match(result)) {
      toast.success("Password reset successfully!");
      window.location.href = "/login";
    } else {
      toast.error("Password reset failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#877356]">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">RESET PASSWORD</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" onChange={handleChange} placeholder="Enter your email" />
                {!otpSent && (
                  <Button type="button" onClick={handleSendOtp} className="mt-2 bg-blue-500 text-white">
                    Send OTP
                  </Button>
                )}
              </div>

              {otpSent && (
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input id="otp" type="text" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" />
                  <Button type="button" onClick={handleVerifyOtp} className="mt-2 bg-green-500 text-white">
                    Verify OTP
                  </Button>
                </div>
              )}

              {otpVerified && (
                <>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-[#b8860b] to-[#956d09] text-white">
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;