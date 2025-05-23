import { Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/Admin/Dashboard/Dashboard";
import { VolunteerTable } from "../pages/Admin/VolunteerList/Volunteerlist";
import { DonorsList } from "../pages/Admin/DonorList/Donorlist";
import { BeneficiariesList } from "../pages/Admin/BeneficiaryList/Beneficiarylist";
import EditBeneficiary from "../pages/Admin/BeneficiaryList/Beneficiaryedit";
import Editvolunteers from "../pages/Admin/VolunteerList/VolunteerEdit";
import EditDonor from "../pages/Admin/DonorList/DonorEdit";
import Logout from "../components/admin/Dashboard/logout";
import NotFound from "../components/NotFound";
import RecentStories from "../pages/Admin/RecentStories/RecentStories";
import ConcernDetailPage from "../pages/Admin/Concerns/ConcernDetailPage";
import ConcernListPage from "../pages/Admin/Concerns/ConcernList";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="volunteers" element={<VolunteerTable />} />
      <Route path="volunteers/edit/:id" element={<Editvolunteers />} />
      <Route path="donors" element={<DonorsList />} />
      <Route path="donors/edit/:id" element={<EditDonor />} />
      <Route path="beneficiaries" element={<BeneficiariesList />} />
      <Route path="beneficiaries/edit/:id" element={<EditBeneficiary />} />
      <Route path="recentstories" element={<RecentStories />} />
      <Route path="concerns/:id" element={<ConcernDetailPage />} />
      <Route path="concerns" element={<ConcernListPage />} />
      <Route path="analytics" element={<DashboardPage />} />
      <Route path="logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
