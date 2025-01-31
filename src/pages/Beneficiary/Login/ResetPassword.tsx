// import Footer from "../../../components/beneficiary/Footer/Footer";
// import Header from "../../../components/beneficiary/Header/Header";
// import { Button } from "../../../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import { useState, ChangeEvent, FormEvent } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// interface FormData {
//   otp: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// interface Errors {
//   otp: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// const ResetPasswordPage: React.FC = () => {
//   const { email } = useParams<{ email: string }>();
//   const [formData, setFormData] = useState<FormData>({ otp: "", newPassword: "", confirmPassword: "" });
//   const [errors, setErrors] = useState<Errors>({ otp: "", newPassword: "", confirmPassword: "" });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [otpVerified, setOtpVerified] = useState<boolean>(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//     setErrors({ ...errors, [id]: "" });
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       const response = await axios.post<{ success: boolean }>("http://localhost:5000/api/user/verify-otp", { email, otp: formData.otp });
//       if (response.data.success) {
//         setOtpVerified(true);
//       } else {
//         setErrors({ ...errors, otp: "Invalid OTP. Please try again." });
//       }
//     } catch (error) {
//       setErrors({ ...errors, otp: "OTP verification failed." });
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!otpVerified) return;

//     if (formData.newPassword !== formData.confirmPassword) {
//       setErrors({ ...errors, confirmPassword: "Passwords do not match." });
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("http://localhost:5000/api/user/reset-password", { email, password: formData.newPassword });
//       alert("Password reset successfully");
//       window.location.href = "/login";
//     } catch (error) {
//       console.error("Error resetting password:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-[#877356]">
//       <Header />
//       <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
//         <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
//           <CardHeader>
//             <CardTitle className="text-2xl md:text-3xl font-bold">RESET PASSWORD</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <div>
//                 <Label htmlFor="otp">Enter OTP</Label>
//                 <Input id="otp" type="text" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" />
//                 <Button type="button" onClick={handleVerifyOtp} className="mt-2 bg-blue-500 text-white">Verify OTP</Button>
//                 {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="newPassword">New Password</Label>
//                 <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password" />
//               </div>
//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
//                 {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
//               </div>
//               <Button type="submit" disabled={!otpVerified} className="w-full bg-gradient-to-r from-[#b8860b] to-[#956d09] text-white" title={!otpVerified ? "Verify OTP first" : ""}>
//                 {loading ? "Resetting..." : "Reset Password"}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ResetPasswordPage;
import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface FormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface Errors {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { email: paramEmail } = useParams<{ email: string }>();
  const [formData, setFormData] = useState<FormData>({
    email: paramEmail || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const handleVerifyOtp = async () => {
    try {
        const token = localStorage.getItem('token')
        console.log(token);
        
      const response = await axios.post<{ success: boolean }>(
        "http://localhost:5000/api/user/verifyOtp",
        { token:token, otp: formData.otp }
      );
      if (response.data.success) {
        setOtpVerified(true);
      } else {
        setErrors({ ...errors, otp: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      setErrors({ ...errors, otp: "OTP verification failed." });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpVerified) return;

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/user/reset-password", {
        email: formData.email,
        password: formData.newPassword,
      });
      alert("Password reset successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#877356]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">RESET PASSWORD</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!!paramEmail} // Readonly if email is from params
                  placeholder="Enter your email"
                  className={paramEmail ? "bg-gray-200 cursor-not-allowed" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* OTP Field */}
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                />
                <Button type="button" onClick={handleVerifyOtp} className="mt-2 bg-blue-500 text-white">
                  Verify OTP
                </Button>
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              </div>

              {/* New Password Field */}
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Reset Password Button */}
              <Button
                type="submit"
                disabled={!otpVerified}
                className="w-full bg-gradient-to-r from-[#b8860b] to-[#956d09] text-white"
                title={!otpVerified ? "Verify OTP first" : ""}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
