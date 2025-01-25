import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminRoutes from "./routes/AdminRoutes";
import BeneficiaryRoutes from "./routes/BeneficiaryRoutes";
import VolunteerRoutes from "./routes/VolunteerRoutes";
import DonorRoutes from "./routes/DonorRoutes";
// import NotFound from "./components/NotFound";
// import HomePage from "./pages/Beneficiary/HomePage/HomePage";

function App() {
  

  return (
    <>
     <Router>
      
        <Routes>
          <Route path="/*" element = {<BeneficiaryRoutes />} />
          <Route path="/donor/*" element = {<DonorRoutes />} />
          <Route path="/volunteer/*" element = {<VolunteerRoutes />} />
          <Route path="/admin/*" element = {<AdminRoutes />} />
          
        </Routes>
     
     </Router>
     <ToastContainer />
    </>
  )
}

export default App
