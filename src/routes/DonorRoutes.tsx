import { Route, Routes } from "react-router-dom";
import DonorWelcome from "../pages/Donor/Home/DonorWelcome";
import NotFound from "../components/NotFound";

const DonorRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<DonorWelcome/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
};

export default DonorRoutes;

