import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { userSignup, verifyOtp, resendOtp } from '../../../reducers/users/userActions';
import { resetState } from '../../../reducers/users/userReducer';
import Footer from '../../../components/beneficiary/Footer/Footer';
import SignupForm from './SignupForm'; // Import the SignupForm component
import OTPForm from './OTPForm'; // Import the OTPForm component
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

const UserSignup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuccess, isError, isLoading, isOtpSent, token } = useSelector(
    (state: RootState) => state.users
  );

  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

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
    let timer: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, isOtpSent]);

  useEffect(() => {
    if (isSuccess || isError) {
      setTimeout(() => dispatch(resetState()), 3000);
    }
  }, [isSuccess, isError, dispatch]);


  const handleSignupSubmit = async (data: any) => {
    try {
      const result = await dispatch(userSignup(data)).unwrap();
      console.log("Signup Success:", result);
      toast.success("OTP sent to your mail");
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error(error);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      const result = await dispatch(verifyOtp({ token, otp })).unwrap();
      toast.success("Verification successful");
      setTimeout(() => (window.location.href = '/login'), 1000);
      console.log("OTP Verification Success:", result);
    } catch (error:any) {
      toast.error(error);
      console.error("OTP Verification Error:", error);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      dispatch(resendOtp({ token })).unwrap();
      toast.success("OTP resent successfully");
      setResendTimer(30);
    } catch (error:any) {
      toast.error(error);
      console.error("Resend OTP Error:", error);
    } finally {
      setIsResendingOtp(false);
    }
  };
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#9f8b75] to-[#2c2520]">
     
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="lg:w-1/2 text-black">
        <h1 className="text-2xl md:text-4xl font-bold font-serif text-[#774513]">CLARION</h1>
        <br></br>
          {/* ... (Community info - same as before) */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg md:text-xl mb-6">Be part of something bigger. Sign up today and start making a difference!</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Why Join Clarion?</h3>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
              <li>Connect with like-minded individuals</li>
              <li>Support meaningful causes</li>
              <li>Make a real impact in your community</li>
              <li>Access exclusive events and resources</li>
            </ul>
          </div>
        </div>
        {!isOtpSent ? (
          <SignupForm onSubmit={handleSignupSubmit} isLoading={isLoading} />
        ) : (
          <OTPForm
            onSubmit={handleOtpSubmit}
            onResend={handleResendOtp}
            isLoading={isLoading}
            isResending={isResendingOtp}
            resendTimer={resendTimer}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserSignup;
