import HomePage from "../pages/Volunteer/Home/Home";
import NotFound from "../components/NotFound";
import { Navigate, Route, Routes } from "react-router-dom";
import ProfilePage from "../pages/Volunteer/ProfilePage/ProfilePage";
import StoryDetailsPage from "../pages/Volunteer/StoryDetailsPage/StoryDetailsPage";
import MEET from "../components/calls/VideoCall";
import VolunteerAccount from "../pages/Volunteer/VolunteerAccount/VolunteerAccount";
import VolunteerChatList from "../pages/Volunteer/UserChat/VolunteerChatList";
import { TakeupStories } from "../pages/Volunteer/Stories/TakeupStories";
import { RecentStories } from "../pages/Volunteer/Stories/RecentStories";

const VolunteerRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/account" element={<VolunteerAccount />}>
        <Route path="home" element={<Navigate to="/volunteer/home" />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* <Route path="stories" element={<StoryDetailsPage />} /> */}
        <Route path="chats" element={<VolunteerChatList userId={null} />} />
        <Route path="takeup-stories" element={<TakeupStories />} />
        <Route path="recent-stories" element={<RecentStories />} />
      </Route>
      <Route path="profile" element={<ProfilePage />} />
      <Route path="story/:id" element={<StoryDetailsPage />} />
      <Route path="/call" element={<MEET />} />

      {/* <Route path="call" element = {<UserChatDetails volunteerId={""} userId={""} userName={""}/>} /> */}
      {/* <Route path="call" element={<VideoCall />} /> */}
    </Routes>
    // </>
  );
};

export default VolunteerRoutes;
