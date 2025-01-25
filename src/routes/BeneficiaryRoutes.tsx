import { Route, Routes } from "react-router-dom"
import UserSignup from "../pages/Beneficiary/signup/UserSignup"
import OTPVerification from "../pages/Beneficiary/signup/otpverify"
import UserLogin from "../pages/Beneficiary/Login/UserLogin"
import HomePage from "../pages/Beneficiary/HomePage/HomePage"
import NotFound from "../components/NotFound";

// import HomePage from "../pages/Beneficiary/HomePage/HomePage"
// import { Navigate } from "react-router-dom";

const BeneficiaryRoutes = () => {
  return (
    <Routes>
      <Route path="signup" element={<UserSignup/>}/>
      <Route path="login" element={<UserLogin/>}/>
      <Route path="home" element={<HomePage/>}/>
      <Route path="*" element = {<NotFound />} />
      <Route path="test" element = {<OTPVerification />} />
      

      
    </Routes>
  
  )
}

export default BeneficiaryRoutes
