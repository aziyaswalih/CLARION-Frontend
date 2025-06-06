import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminRoutes from "./routes/AdminRoutes";
import BeneficiaryRoutes from "./routes/BeneficiaryRoutes";
import VolunteerRoutes from "./routes/VolunteerRoutes";
import DonorRoutes from "./routes/DonorRoutes";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserSignup from "./pages/Beneficiary/signup/UserSignup";
import UserLogin from "./pages/Beneficiary/Login/UserLogin";
import ResetPassword from "./pages/Beneficiary/Login/ResetPassword";
import NotFound from "./components/NotFound";
import AdminLogin from "./pages/Admin/Login/AdminLogin";
import DonationPage from "./pages/Donor/DonationPage/DonationPage";
import AboutUsPage from "./pages/AboutUs";
import RecentCases from "./pages/RecentCases";
import Concern from "./pages/Concern";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/*" element={<BeneficiaryRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["volunteer"]} />}>
            <Route path="/volunteer/*" element={<VolunteerRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["donor"]} />}>
            <Route path="/donor/*" element={<DonorRoutes />} />
          </Route>

          <Route path="/main" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="signup" element={<UserSignup />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="reset" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="latest_causes" element={<RecentCases />} />
          <Route path="about_us" element={<AboutUsPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/concern/:id" element={<Concern />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
