import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "react-toastify";

interface OTPFormProps {
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => void;
  isLoading: boolean;
  isResending: boolean;
  resendTimer: number;
}

const OTPForm: React.FC<OTPFormProps> = ({
  onSubmit,
  onResend,
  isLoading,
  isResending,
  resendTimer,
}) => {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ otp?: string }>({});

  const validateOtp = (): boolean => {
    const newErrors: { otp?: string } = {};
    if (!otp.trim()) {
      newErrors.otp = "OTP is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setErrors({ ...errors, otp: undefined });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateOtp()) {
      return;
    }
    try {
      await onSubmit(otp);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Card className="lg:w-1/2 w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={handleChange}
              placeholder="Enter OTP sent to your email"
              className="mt-1"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
          </div>
          <Button
            onClick={onResend}
            disabled={resendTimer > 0 || isResending || isLoading}
            className="w-full bg-gray-600 text-white mt-2"
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </Button>
          <Button
            className="w-full bg-gradient-to-br from-[#956d09] to-[#b8860b]"
            disabled={isLoading}
          >
            Verify OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OTPForm;
