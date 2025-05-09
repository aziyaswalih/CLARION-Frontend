import { Navigate, Route, Routes } from "react-router-dom";
import DonorWelcome from "../pages/Donor/Home/DonorWelcome";
import NotFound from "../components/NotFound";
import DonorProfilePage from "../pages/Donor/ProfilePage/ProfilePage";
import DonationHistory from "../pages/Donor/DonationHistory/DonationHistory";
import TransactionHistory from "../pages/Donor/TransactionHistory/TransactionHistory";
import DonorAccount from "../pages/Donor/DonorAccount";
import DonationCertificate from "../pages/Donor/DonationCertificate/DonationCertificate";
// import LatestCauses from "../components/beneficiary/LatestCauses";

const DonorRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<DonorWelcome/>} />
      <Route path="" element={<DonorWelcome/>} />
      <Route path="/account" element={<DonorAccount />}>
        <Route path="home" element={<Navigate to="/donor/home" />} />
        <Route path="profile" element={<DonorProfilePage />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="donations" element={<DonationHistory />} />
      </Route>    
      <Route path="certificate" element={<DonationCertificate />} />    
      <Route path="*" element={<NotFound/>} />
      <Route path="donations" element={<DonationHistory/>} />
      <Route path="transaction_history" element={<TransactionHistory/>} />
    </Routes>
  );
};

export default DonorRoutes;

