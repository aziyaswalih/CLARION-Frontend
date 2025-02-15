import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import axios from "axios";
import { toast } from "react-toastify";
import OTPForm from "../signup/OTPForm"; 
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../../../components/googleAuth/Auth";
const LoginPage = () => {
  // ... (state variables and handleChange function - same as before)
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showOTPForm, setShowOTPForm] = useState(false);
    const [otp, setOtp] = useState(""); // State to store OTP input
    const [otpError, setOtpError] = useState(""); // State to store OTP error message
    const [userEmail, setUserEmail] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: undefined });
  };
    const [redirectPath, setRedirectPath] = useState<string | null>(null);


  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleHome = (formData.email,response.data){
  //   if (response.data?.user?.role === "volunteer") {
  //     window.location.href = "/volunteer/home";
  //   } else if (response.data?.user?.role === "user") {
  //     window.location.href = "/home";
  //   } else if (response.data?.user?.role === "donor") {
  //     window.location.href = "/donor/home";
  //   } else {
  //     throw new Error("Invalid role");
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post<{ token: string; message: string; user: any }>(
        "http://localhost:5000/api/user/login",
        formData
      );

      if (response.data.user.is_verified) {
        localStorage.setItem("authToken", response.data.token);
        setUserEmail(formData.email);
        if (response.data?.user?.role === "volunteer") {
          window.location.href = "/volunteer/home";
        } else if (response.data?.user?.role === "user") {
          window.location.href = "/home";
        } else if (response.data?.user?.role === "donor") {
          window.location.href = "/donor/home";
        } else {
          throw new Error("Invalid role");
        }
        
      } else {
        localStorage.setItem("authToken", response.data.token);
        setShowOTPForm(true);
        setUserEmail(formData.email);

        // Send OTP only if not already sent (or implement logic to resend if needed)
        try {
          const otpResponse = await axios.post<{ otpToken: string; message: string; user: any }>(
            "http://localhost:5000/api/user/auth/send-otp",
            { email: formData.email }
          );
          localStorage.setItem('otpToken', otpResponse.data.otpToken[1]); // Store the OTP token
          console.log( otpResponse.data.otpToken[1],'token from otp response');
          
          toast.info("Your account is not verified. Please enter the OTP sent to your email.");
        } catch (otpError:any) {
          console.error("Error sending OTP:", otpError);
          toast.error(otpError.response?.data?.message || "Failed to send OTP.");
        }
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      setErrors({ email: error.response?.data?.message || "Login failed." });
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {  // Accept otp as argument
    setLoading(true);
    try {
      const token = localStorage.getItem("otpToken");
      console.log(token,otp);
      
      const response = await axios.post(
        "http://localhost:5000/api/user/verifyOtp",
        { token, otp }
      );
      if (response.data.success) {
        localStorage.removeItem('otpToken');
        toast.success("OTP verified successfully!");
        const token = localStorage.getItem("authToken") || '';
        console.log(token);
        
        if(token){
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        
        if (decoded.role === "volunteer") {
          window.location.href = "/volunteer/home";
        } else if (decoded.role === "user") {
          window.location.href = "/home";
        } else if (decoded.role === "donor") {
          window.location.href = "/donor/home";
        } else {
          throw new Error("Invalid role");
        }}
      } else {
        setOtpError(response.data.message || "Invalid OTP. Please try again.");
        toast.error(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during OTP verification:", error);
      setOtpError(error.response?.data?.message || "OTP verification failed.");
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setResendTimer(30); // Set initial timer value

    try {
      const otpToken = localStorage.getItem('otpToken'); // Retrieve OTP token
      const response = await axios.post("http://localhost:5000/api/user/resendOtp", {
        token: otpToken,  // Use OTP token for resend
      });
      toast.success("OTP resent successfully!");
    } catch (error:any) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
      setResendTimer(30); // Reset timer even on failure
    }
  };


  const handleReset = async () => {
    // ... (handleReset function - same as before)
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Enter a valid email before resetting password." });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/user/auth/send-otp", {
        email: formData.email,
      });

      if (response.data.success) {
        window.location.href = `/reset?email=${encodeURIComponent(formData.email)}`;
        localStorage.setItem('token', response.data.otpToken[1]);
        alert("OTP sent to your email. Proceed to reset your password.");

      } else {
        throw new Error(response.data.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Error sending OTP." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log(decoded.role);
        
        switch (decoded.role) {
          case "volunteer":
            setRedirectPath("/volunteer/home");
            break;
          case "donor":
            setRedirectPath("/donor/home");
            break;
          case "user":
            setRedirectPath("/home");
            break;
          case 'admin':
            setRedirectPath('/admin/dashboard')
            break;
          default:
            setRedirectPath("/login");
        }
      } catch (error) {
        console.error("Invalid Token", error);
        localStorage.removeItem("authToken");
        setRedirectPath("/login");
      }
    }
  }, []);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }


  return (
    <div className="min-h-screen flex flex-col bg-[#877356]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            {/* ... (Card Header content - same as before) */}
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#b8860b] to-[#956d09] rounded-full mx-auto flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold mt-4">LOGIN TO YOUR ACCOUNT</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {!showOTPForm ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* ... (Login form fields - same as before) */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#b8860b] to-[#956d09] text-white"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <Auth/>
                {/* ... (Forgot password and signup links - same as before) */}
                <p className="mt-6 text-center text-sm text-gray-600">
                  Forgot your password?{" "}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[#b8860b] hover:text-[#956d09] font-semibold"
                  >
                    Reset password
                  </button>
                </p>
                <p className="mt-6 text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-[#b8860b] hover:text-[#956d09] font-semibold">
                    Sign Up Here
                  </a>
                </p>
              </form>
            ) : (
              <OTPForm
                onSubmit={handleOTPVerify}
                onResend={handleResendOtp}
                isLoading={loading}
                isResending={isResending}
                resendTimer={resendTimer}
              />
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;