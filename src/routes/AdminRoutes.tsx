import { Route, Routes } from "react-router-dom"
import AdminLogin from "../pages/Admin/Login/AdminLogin"
import DashboardPage from "../pages/Admin/Dashboard/Dashboard"
import { VolunteerTable } from "../pages/Admin/VolunteerList/Volunteerlist"
import { DonorsList } from "../pages/Admin/DonorList/Donorlist"
import { BeneficiariesList } from "../pages/Admin/BeneficiaryList/Beneficiarylist"
import EditBeneficiary  from "../pages/Admin/BeneficiaryList/Beneficiaryedit"
import Editvolunteers from "../pages/Admin/VolunteerList/VolunteerEdit"
import EditDonor from "../pages/Admin/DonorList/DonorEdit"
import AddBeneficiary from "../pages/Admin/BeneficiaryList/AddBeneficiary"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin/>}/>
      <Route path="dashboard" element={<DashboardPage/>}/>
      <Route path="volunteers" element={<VolunteerTable/>}/>
      <Route path="volunteers/edit/:id" element={<Editvolunteers />} />
      <Route path="donors" element={<DonorsList/>}/>
      <Route path="donors/edit/:id" element={<EditDonor />} />
      <Route path="beneficiaries" element={<BeneficiariesList/>}/>
      <Route path="beneficiaries/edit/:id" element={<EditBeneficiary />} />
      <Route path="beneficiaries/add" element={<AddBeneficiary />} />
      </Routes>
  )
}

export default AdminRoutes
