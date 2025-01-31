// import {useSelector}from "react-redux"
import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import Header from '../../../components/beneficiary/Header/Header';
import Footer from '../../../components/beneficiary/Footer/Footer';
import axios from 'axios';
// import { RootState } from "../../../store/store";

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
  otp?: string; // Optional OTP field for verification
}

const UserSignup: React.FC = () => {
  // const {isSuccess,isError,message,isLoading,user}=useSelector((state:RootState)=>state.beneficiary)
  // useEffect(()=>{

  // })
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
    otp: '', // OTP state for verification
  });
  const [token, setToken] = useState<string>('');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Flag to show OTP form
  const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false); // Flag for resend OTP process
  const [resendTimer, setResendTimer] = useState<number>(30); // Timer for resend OTP button

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, isOtpSent]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Username is required.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'A valid 10-digit phone number is required.';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Please select a role.';
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: undefined });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
    setErrors({ ...errors, role: undefined });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post<{ message: string; token: string }>(
        'http://localhost:5000/api/user/register',
        formData
      );


      alert(response.data.message);
      setIsOtpSent(true);
      setToken(response.data.token);
    } catch (error: any) {
      console.error('Error during signup:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      setErrors({ ...errors, otp: 'OTP is required.' });
      return;
    }

    try {
      const response = await axios.post<{ message: string }>(
        'http://localhost:5000/api/user/verifyOtp',
        { token: token, otp: formData.otp }
      );

      alert(response.data.message);
      window.location.href = '/login'; // Redirect to login page after OTP verification
    } catch (error: any) {
      console.error('Error during OTP verification:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);

    try {
      const response = await axios.post<{ message: string }>(
        'http://localhost:5000/api/user/resendOtp',
        { token: token }
      );

      alert(response.data.message);
      setResendTimer(30); // Reset timer after resending OTP
    } catch (error: any) {
      console.error('Error during OTP resend:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#9f8b75] to-[#2c2520]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* <div className="lg:w-1/2 text-black">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg md:text-xl mb-6">
            Be part of something bigger. Sign up today and start making a difference!
          </p>
        </div> */}

<div className="lg:w-1/2 text-black">
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
        <Card className="lg:w-1/2 w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="text-center mb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold mt-4">
                Sign Up to Register
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={isOtpSent ? handleOtpSubmit : handleSubmit}>
              {!isOtpSent ? (
                <>
                  {/* Registration Form */}
                  <div>
                    <Label htmlFor="name">Username</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className="mt-1"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={handleRoleChange}>
                      <SelectTrigger className="w-full mt-1 bg-white border-2 border-gray-300">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300 shadow-lg">
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="user">Beneficiary</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
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
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="mt-1"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* OTP Form */}
                  <div>
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter OTP sent to your email"
                      className="mt-1"
                    />
                    {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                  </div>
                  <Button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isResendingOtp}
                    className="w-full bg-gray-600 text-white mt-2"
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </Button>
                </>
              )}
              <Button className="w-full bg-gradient-to-br from-[#956d09] to-[#b8860b]">
                {isOtpSent ? 'Verify OTP' : 'Sign Up'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
             <a href="/login" className="text-[#b8860b] hover:text-[#956d09] font-semibold">
           Login Here
           </a>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default UserSignup;
