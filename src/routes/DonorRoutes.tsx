import { Route, Routes } from "react-router-dom";
import DonorWelcome from "../pages/Donor/Home/DonorWelcome";
import NotFound from "../components/NotFound";
import DonorProfilePage from "../pages/Donor/ProfilePage/ProfilePage";
// import LatestCauses from "../components/beneficiary/LatestCauses";

const DonorRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<DonorWelcome/>} />
      <Route path="profile" element={<DonorProfilePage/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
};

export default DonorRoutes;

