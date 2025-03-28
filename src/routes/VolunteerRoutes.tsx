import HomePage from "../pages/Volunteer/Home/Home"
import NotFound from "../components/NotFound";
import { Route, Routes } from "react-router-dom"
import ProfilePage from "../pages/Volunteer/ProfilePage/ProfilePage";
import StoryDetailsPage from "../pages/Volunteer/StoryDetailsPage/StoryDetailsPage";

const VolunteerRoutes = () => {
  return (
    <Routes>
    
      <Route path="home" element={<HomePage/>}/>
      <Route path="*" element = {<NotFound />} />
      <Route path="profile" element = {<ProfilePage />} />
      <Route path="story/:id" element = {<StoryDetailsPage />} />
    </Routes>
  )
}

export default VolunteerRoutes
