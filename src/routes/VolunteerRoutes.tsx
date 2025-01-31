import HomePage from "../pages/Volunteer/Home/Home"
import NotFound from "../components/NotFound";
import { Route, Routes } from "react-router-dom"

const VolunteerRoutes = () => {
  return (
    <Routes>
    
      <Route path="home" element={<HomePage/>}/>
      <Route path="*" element = {<NotFound />} />
    
    </Routes>
  )
}

export default VolunteerRoutes
