import { Route, Routes } from "react-router-dom"
// import UserSignup from "../pages/Beneficiary/signup/UserSignup"
import OTPVerification from "../pages/Beneficiary/signup/otpverify"
// import UserLogin from "../pages/Beneficiary/Login/UserLogin"
// import HomePage from "../pages/Beneficiary/HomePage/HomePage"
import BeneficiaryHome from "../pages/Beneficiary/HomePage/Home"

import HomePage from "../pages/HomePage"
// import ResetPassword from "../pages/Beneficiary/Login/ResetPassword";
// import { Navigate } from "react-router-dom";

const BeneficiaryRoutes = () => {
  return (
    <Routes>
      {/* <Route path="signup" element={<UserSignup/>}/>
      <Route path="login" element={<UserLogin/>}/>
      <Route path="reset" element={<ResetPassword/>}/> */}
      <Route path="home" element={<BeneficiaryHome/>}/>
      <Route path="landingpage" element={<HomePage/>}/>
      <Route path="test" element = {<OTPVerification />} />
      

      
    </Routes>
  
  )
}

export default BeneficiaryRoutes
