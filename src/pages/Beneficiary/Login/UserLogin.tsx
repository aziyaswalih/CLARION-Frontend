import Footer from "../../../components/beneficiary/Footer/Footer";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "react-toastify";
import OTPForm from "../signup/OTPForm"; 
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Auth from "../../../components/googleAuth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, resendOtp, sendOTP, verifyOtp } from "../../../reducers/users/userActions";
import { AppDispatch, RootState } from "../../../store/store";
import { resetState } from "../../../reducers/users/userReducer";
const LoginPage = () => {
  
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const { isSuccess, isError, isLoading } = useSelector(
      (state: RootState) => state.users
    );
    const [isOtpSent,setOtpSent] = useState<boolean>(false) 
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showOTPForm, setShowOTPForm] = useState(false);
    // const [otp, setOtp] = useState(""); // State to store OTP input
    const [otpError, setOtpError] = useState(""); // State to store OTP error message
    const [userEmail, setUserEmail] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState<number>(30);  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: undefined });
  };
    const dispatch = useDispatch<AppDispatch>()
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
  useEffect(() => {
    if (isSuccess || isError) {
      setTimeout(() => dispatch(resetState()), 3000);
      Navigate 
    }
  }, [isSuccess, isError, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

      dispatch(loginAsync(formData)).unwrap()
      .then((user)=>{
        if (user.user?.is_verified) {
        localStorage.setItem("authToken", user.token);
        setUserEmail(formData.email);
        if (user?.user?.role === "volunteer") {
          window.location.href = "/volunteer/home";
        } else if (user?.user?.role === "user") {
          window.location.href = "/home";
        } else if (user?.user?.role === "donor") {
          window.location.href = "/donor/home";
        } else if (user?.user?.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          throw new Error("Invalid role");
        }
        
      } else {
        localStorage.setItem("authToken", user.token);
        setShowOTPForm(true);
        setUserEmail(formData.email);

        // Send OTP only if not already sent (or implement logic to resend if needed)
        try {
          // cutted from
          dispatch(sendOTP(formData.email??userEmail)).unwrap()
          .then((otpResponse)=>{
            setOtpSent(true)
          localStorage.setItem('otpToken', otpResponse.otpToken[1]); // Store the OTP token
          console.log( otpResponse.otpToken[1],'token from otp response');
          
          toast.info("Your account is not verified. Please enter the OTP sent to your email.");
        })
        }catch (error:any) {
          console.error("Error sending OTP:", otpError);
          toast.error(error.response?.data?.message || "Failed to send OTP.");
        }
      }
      setLoading(false);

      })
      
      
      
    .catch ((error)=> {
      console.error("Error during login:", error);
      setErrors({ email: error.response?.data?.message || "Login failed." });
      toast.error(error.response?.data?.message || "Login failed.");
    }) 
  
  }
  const handleOTPVerify = async (otp: string) => {  // Accept otp as argument
    setLoading(true);
    try {
      const token = localStorage.getItem("otpToken");
      console.log(token,otp);
      
      dispatch(verifyOtp({ token:token as string, otp })).unwrap()
      
      .then(()=> {
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
      }) 
      .catch((error)=> {
        setOtpError(error.message || "Invalid OTP. Please try again.");
        toast.error(error.message || "Invalid OTP. Please try again.");
      })
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
      const token = localStorage.getItem('otpToken'); // Retrieve OTP token
     
      dispatch(resendOtp({ token:token as string })).unwrap();
            toast.success("OTP resent successfully");
            setResendTimer(30);
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
      // setLoading(true);
      // dispatch(sendOTP(
      //   formData.email??userEmail
      // )).unwrap()

      // .then((response) =>{
        window.location.href = `/reset}`;
      //   localStorage.setItem('token', response.otpToken[1]);
      //   toast.info("OTP sent to your email. Proceed to reset your password.");

      // }).catch((error)=> {
      //   throw new Error(error?.data?.message || "Failed to send OTP.");
      // })
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || "Error sending OTP." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const otpToken = localStorage.getItem("otpToken")??null
    if (token && !otpToken) {
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
    let timer: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, isOtpSent]);
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }


  // return (
  //   <div className="min-h-screen flex flex-col bg-[#877356]">
  //     {/* <Header /> */}
  //     <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
  //       <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
  //         <CardHeader>
  //           {/* ... (Card Header content - same as before) */}
  //           <div className="text-center mb-4">
  //             <div className="w-20 h-20 bg-gradient-to-br from-[#b8860b] to-[#956d09] rounded-full mx-auto flex items-center justify-center">
  //               <svg
  //                 className="w-12 h-12 text-white"
  //                 fill="none"
  //                 stroke="currentColor"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <path
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   strokeWidth="2"
  //                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  //                 />
  //               </svg>
  //             </div>
  //             <CardTitle className="text-2xl md:text-3xl font-bold mt-4">LOGIN TO YOUR ACCOUNT</CardTitle>
  //           </div>
  //         </CardHeader>
  //         <CardContent>
  //           {!showOTPForm ? (
  //             <form className="space-y-4" onSubmit={handleSubmit}>
  //               {/* ... (Login form fields - same as before) */}
  //               <div>
  //                 <Label htmlFor="email">Email</Label>
  //                 <Input
  //                   id="email"
  //                   type="email"
  //                   value={formData.email}
  //                   onChange={handleChange}
  //                   placeholder="Enter your email"
  //                   className="mt-1"
  //                 />
  //                 {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
  //               </div>
  //               <div>
  //                 <Label htmlFor="password">Password</Label>
  //                 <Input
  //                   id="password"
  //                   type="password"
  //                   value={formData.password}
  //                   onChange={handleChange}
  //                   placeholder="Enter your password"
  //                   className="mt-1"
  //                 />
  //                 {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
  //               </div>

  //               <Button
  //                 type="submit"
  //                 className="w-full bg-gradient-to-r from-[#b8860b] to-[#956d09] text-white"
  //                 disabled={loading}
  //               >
  //                 {loading ? "Logging in..." : "Login"}
  //               </Button>
  //               <p className="text-lg text-center flex justify-center items-center">OR</p>

  //               <Auth/>
  //               {/* ... (Forgot password and signup links - same as before) */}
  //               <p className="mt-6 text-center text-sm text-gray-600">
  //                 Forgot your password?{" "}
  //                 <button
  //                   type="button"
  //                   onClick={handleReset}
  //                   className="text-[#b8860b] hover:text-[#956d09] font-semibold"
  //                 >
  //                   Reset password
  //                 </button>
  //               </p>
  //               <p className="mt-6 text-center text-sm text-gray-600">
  //                 Don't have an account?{" "}
  //                 <a href="/signup" className="text-[#b8860b] hover:text-[#956d09] font-semibold">
  //                   Sign Up Here
  //                 </a>
  //               </p>
  //             </form>
  //           ) : (
  //             <OTPForm
  //               onSubmit={handleOTPVerify}
  //               onResend={handleResendOtp}
  //               isLoading={isLoading}
  //               isResending={isResending}
  //               resendTimer={resendTimer}
  //             />
  //           )}
  //         </CardContent>
  //       </Card>
  //     </main>
  //     <Footer />
  //   </div>
  // );



  return (
    <div className="min-h-screen flex flex-col bg-[#c5b6a0]">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white/80 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden w-full max-w-5xl">
          {/* 👈 Charity Image (left side only on md+) */}
          <div className="hidden md:flex items-center justify-center bg-[#b8860b]">
            <img
              src="images/featured-4.jpeg"
              alt="Charity illustration"
              className="object-cover h-full w-full"
            />
          </div>
  
          {/* 👉 Login Form (right side) */}
          <div className="p-8">
            <Card className="bg-transparent shadow-none">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#b8860b] to-[#956d09] rounded-full mx-auto flex items-center justify-center shadow-lg">
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
                <CardTitle className="text-2xl md:text-3xl font-bold mt-4 text-[#4B3621]">
                  LOGIN TO YOUR ACCOUNT
                </CardTitle>
              </CardHeader>
  
              <CardContent>
                {!showOTPForm ? (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <Label htmlFor="email" className="text-[#4B3621] font-medium">Email</Label>
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
                      <Label htmlFor="password" className="text-[#4B3621] font-medium">Password</Label>
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
                      className="w-full bg-gradient-to-r from-[#b8860b] to-[#956d09] text-white font-semibold tracking-wide"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
  
                    <div className="text-center my-3 text-[#4B3621] font-semibold">OR</div>
                    <Auth />
  
                    <div className="text-center text-sm text-gray-700 mt-6">
                      Forgot your password?{" "}
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-[#b8860b] hover:text-[#956d09] font-semibold"
                      >
                        Reset password
                      </button>
                    </div>
                    <div className="text-center text-sm text-gray-700">
                      Don’t have an account?{" "}
                      <a
                        href="/signup"
                        className="text-[#b8860b] hover:text-[#956d09] font-semibold"
                      >
                        Sign Up Here
                      </a>
                    </div>
                  </form>
                ) : (
                  <OTPForm
                    onSubmit={handleOTPVerify}
                    onResend={handleResendOtp}
                    isLoading={isLoading}
                    isResending={isResending}
                    resendTimer={resendTimer}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
  
};

export default LoginPage;