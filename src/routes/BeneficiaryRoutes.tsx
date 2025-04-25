import { Route, Routes } from "react-router-dom";
import OTPVerification from "../pages/Beneficiary/signup/otpverify";
import BeneficiaryHome from "../pages/Beneficiary/HomePage/Home";
import HomePage from "../pages/HomePage";
import NotFound from "../components/NotFound";
import ProfilePage from "../pages/Beneficiary/ProfilePage/ProfilePage";
import Story from "../pages/Beneficiary/Story/Story";
import StoryHistory from "../pages/Beneficiary/StoryHistory/StoryHistory";

const BeneficiaryRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<BeneficiaryHome />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="landingpage" element={<HomePage />} />
      <Route path="test" element={<OTPVerification />} />
      <Route path="*" element = {<NotFound />} />
      <Route path="story" element={<Story/>} />
      <Route path="stories" element={<StoryHistory/>} />

    </Routes>
  );
};

export default BeneficiaryRoutes;
