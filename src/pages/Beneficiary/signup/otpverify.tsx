import { useState, useEffect } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { EmailIcon } from "../../../components/ui/email-icon"
import Header from "../../../components/beneficiary/Header/Header"
import Footer from "../../../components/beneficiary/Footer/Footer"
import { Label } from "@radix-ui/react-label"

export default function OTPVerification() {
//   const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(10) // 2 minutes in seconds
  const [show, setShow] = useState(false)

  useEffect(() => {
    if(timeLeft==0) {
        setShow(true)
    }
    if (timeLeft >= 0 ) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins}:${secs.toString().padStart(2, "0")}`
//   }

//   const handleSendOTP = () => {
//     if (email) {
//       setShow(2)
//       setTimeLeft(120)
//     }
//   }

  const handleVerifyOTP = () => {
    if (Number(otp)>999 && Number(otp) <10000) {

    }else if(otp){
        alert("OTP should be 4 digit")
    }else{
        alert("error while entering otp")
    }
  }

  const handleResendOTP = () => {
    setTimeLeft(10)
    setShow(false)
    setOtp("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#877356]">
        <Header />
      <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {/* <div>
        <h1 className="text-center text-3xl font-semibold mb-12">VERIFICATION</h1>
        </div> */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
            <EmailIcon />
            <h2 className="text-lg font-medium">VERIFY YOUR EMAIL</h2>
            <Input
              type="otp"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
            />
            <div>
            {show  &&(<Button onClick={handleResendOTP} className="w-full  text-[#956d09]">
              Resend OTP
            </Button>)}
            {!show &&(<Label className="w-full  text-[#956d09]">
              You can resend OTP after {timeLeft}
            </Label>)}
            </div>
            <Button onClick={handleVerifyOTP} className="w-full bg-[#b8860b] hover:bg-[#956d09] text-white">
              Submit OTP
            </Button>
            <p className="text-sm text-gray-500">ENTER THE OTP SENT TO YOUR EMAIL</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

