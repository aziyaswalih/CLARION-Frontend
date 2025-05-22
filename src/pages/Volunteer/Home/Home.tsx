import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Bell, Eye, LogOut } from "lucide-react";
import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode';
// import VolunteerCauseApproval from '../../../components/volunteer/RecentCasesList';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  submitVolunteerDetails,
  getVolunteer,
} from "../../../reducers/volunteers/volunteerReducer";
import {
  fetchStories,
  updateReviewer,
} from "../../../reducers/beneficiary/storyReducer";
import socket from "../../../socket/socket";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const volunteerName = useSelector((state: RootState) => state.volunteer.name);
  const user = useSelector((state: RootState) => state.users.user);
  const status = useSelector(
    (state: RootState) => state.volunteer.submissionStatus
  );
  const [skill, setSkills] = useState("");
  const [skills, setSkillsArray] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");
  const [availability, setAvailability] = useState("part-time");
  const [isNotificationTrayOpen, setIsNotificationTrayOpen] = useState(false); // Added

  console.log(user, "user from state");

  useEffect(() => {
    dispatch(getVolunteer());
  }, [dispatch, user]);

  useEffect(() => {
    if (skill) {
      const arr = skill.split(",").map((item) => item.trim());
      setSkillsArray(arr);
    }
  }, [skill]);

  const goToProfile = () => {
    navigate("/volunteer/account/profile");
  };

  const defaultImage = "/images/orphanage.jpg";

  // Select stories state from Redux
  const { stories, loading, error } = useSelector(
    (state: RootState) => state.stories
  );
  const pendingStories = useMemo(
    () => stories.filter((story) => story.status === "pending"),
    [stories]
  );
  const takeupsStories = useMemo(
    () => stories.filter((story) => story.reviewedBy?.name === user?.name),
    [stories]
  );
  const notificationCount = useMemo(
    () => pendingStories.length,
    [pendingStories]
  );
  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  // listen for new stories added
  useEffect(() => {
    // const socket = io(import.meta.env.VITE_SOCKET_URL); // your backend server

    socket.on("new_story_added", () => {
      console.log("New story added! notification");

      dispatch(fetchStories()); // your function to refetch stories
    });
    return () => {
      socket.off("new_story_added");
    };
  }, []);

  const handleSaveDetails = () => {
    const volunteerDetails = { skills, motivation, availability };
    dispatch(submitVolunteerDetails(volunteerDetails))
      .unwrap()
      .then(() => alert("success"));

    localStorage.setItem("volunteerDetails", JSON.stringify(volunteerDetails));
    alert("Details saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const HandleReview = (story_id: string) => {
    dispatch(updateReviewer({ id: story_id }))
      .unwrap()
      .then(() => navigate(`/volunteer/story/${story_id}`))
      .catch((error) => {
        alert("Error: " + error);
        console.log(error);
      });
  };
  const HandleNotification = (story_id: string) => {
    return () => {
      // Optional: Navigate to story or mark as read
      setIsNotificationTrayOpen(false); // Close tray on item click
      HandleReview(story_id);
    };
  };
  // Function to toggle notification tray
  const toggleNotificationTray = () => {
    // Added
    setIsNotificationTrayOpen((prev) => !prev);
  };

  const latestFiveStories = useMemo(() => {
    // Added
    // Assuming stories are fetched. If they have a timestamp, you might want to sort by it.
    // e.g., [...stories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    return pendingStories.slice(0, 5);
  }, [stories]);

  return (
    <div className="min-h-screen flex flex-col bg-[#efede8]">
      <Header />
      {/* Hero Section */}
      <section className="flex items-center bg-[#f7f6f3]">
        <div className="w-1/2 h-full">
          <img
            src="/images/volunteers.jpg"
            alt="Hero"
            className="w-4/5 h-full object-cover brightness-100 mt-20 m-16 p-4 bg-[#fae09186]"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center text-gray-500 p-8">
          <h2 className="text-5xl md:text-7xl font-serif text-[#b16003] tracking-wider mb-6">
            Welcome, {user?.name}!
          </h2>
          <p className="text-xl md:text-2xl text-[#2f22bd] mb-8 italic">
            "The best way to find yourself is to lose yourself in the service of
            others."
          </p>
          <p className="text-lg md:text-xl text-[#3c3630] mb-8">
            We're glad to have you with us. Your efforts make a real difference!
          </p>

          {/* Container for Notification, Profile Button, and Logout Button */}
          {/* <div className="mt-8 flex flex-col items-center space-y-4"> */}
          {/* Notification Icon and Tray */}
          <div className="relative mb-4">
            <Button
              onClick={toggleNotificationTray}
              className="p-2 rounded-full hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b8860b] bg-transparent border-none"
            >
              <Bell className="h-7 w-7 text-[#2a30dd]" />
              {/* Notification Count Badge */}
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
              <span className="text-lg text-[#2a30dd] font-medium">
                Notifications
              </span>
            </Button>
            {isNotificationTrayOpen && (
              <div className="absolute right-1/2 translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 text-left">
                    Latest Story Notifications
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loading && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                      Loading stories...
                    </p>
                  )}
                  {!loading && error && (
                    <p className="text-center text-red-500 text-sm py-4">
                      Error loading stories.
                    </p>
                  )}
                  {!loading && !error && latestFiveStories.length > 0
                    ? latestFiveStories.map((story) => (
                        <div
                          key={story._id}
                          className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out cursor-pointer"
                          onClick={HandleNotification(story._id)}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate text-left">
                            {story.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
                            Type: {story.requestType}
                          </p>
                        </div>
                      ))
                    : !loading &&
                      !error && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-10 text-center">
                          No new stories to show.
                        </p>
                      )}
                </div>
                {/* Optional: Footer for the tray */}
                {latestFiveStories.length > 0 && !loading && !error && (
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button
                      onClick={() => {
                        setIsNotificationTrayOpen(false); // Close tray
                        // Potentially navigate to a page with all stories or notifications
                      }}
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* </div> */}

          {status !== "failed" && (
            <div
              className="flex items-center space-x-4 cursor-pointer text-[#3c3630]"
              onClick={goToProfile}
            >
              <Eye className="w-6 h-6" />
              <span className="text-lg font-medium underline">
                Go to profile
              </span>
            </div>
          )}

          {/* Logout Button */}
          {/* <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white mt-4 px-4 py-2"
          >
            <LogOut className="w-5 h-5 inline-block mr-2" />
            Logout
          </Button> */}
        </div>
      </section>

      {/* Additional Information for Volunteers */}
      {(status === "failed" || status === "idle") && (
        <section className="py-12 bg-[#e8f4ff]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-serif text-[#3c3630] text-center mb-8">
              Additional Information
            </h2>
            <form className="space-y-6 bg-white p-8 rounded-lg shadow-md">
              <div>
                <label className="block text-lg text-gray-700 font-semibold">
                  Skills
                </label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="E.g. Fundraising, Social Work, Event Management"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md mt-2"
                />
              </div>
              <div>
                <label className="block text-lg text-gray-700 font-semibold">
                  Why do you want to volunteer?
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Describe your motivation..."
                  className="w-full border border-gray-300 px-4 py-2 rounded-md mt-2 h-24"
                />
              </div>
              <div>
                <label className="block text-lg text-gray-700 font-semibold">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-md mt-2"
                >
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                  <option value="weekends">Weekends</option>
                </select>
              </div>
              <Button
                onClick={handleSaveDetails}
                className="bg-[#b8860b] hover:bg-[#956d09] text-white px-6 py-2 rounded-md"
              >
                Save Details
              </Button>
            </form>
          </div>
        </section>
      )}
      <section className="py-20 bg-gradient-to-r from-gray-100 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-sans text-center text-gray-800 mb-12 underline">
            Takeups Stories
          </h2>

          {loading && (
            <p className="text-center text-xl text-gray-600">
              Loading stories...
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 text-xl">Error: {error}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {takeupsStories.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={
                    story.images && story.images.length > 0
                      ? story.images[0]
                        ? `${import.meta.env.VITE_SOCKET_URL}/uploads/${
                            story.images[0]
                          }`
                        : defaultImage
                      : defaultImage
                  }
                  alt={story.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <p className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    Request Type: {story.requestType}
                  </p>
                  <p className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    Title: {story.title}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    Description: {story.description}
                  </p>
                  <p className="text-lg text-gray-600 mb-4">
                    <span className="font-medium">Status:</span>{" "}
                    {story.status.charAt(0).toUpperCase() +
                      story.status.slice(1)}
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => HandleReview(story._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
                    >
                      Review Story
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-gradient-to-r from-gray-100 to-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Takeups Stories - Left Side 
                <div>
                  <h2 className="text-4xl font-sans text-center text-gray-800 mb-12 underline">
                    Takeups Stories
                  </h2>
                  {loading && <p className="text-center text-xl text-gray-600">Loading stories...</p>}
                  {error && <p className="text-center text-red-500 text-xl">Error: {error}</p>}
                  <div className="grid gap-6">
                    {takeupsStories.map((story) => (
                      <div
                        key={story._id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      >
                        <img
                          src={story.images && story.images.length > 0 ? story.images[0]?`http://localhost:5000/uploads/${story.images[0]}`:defaultImage : defaultImage}
                          alt={story.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                        <p className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">
                            Request Type : {story.requestType}
                          </p>
                          <p className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                            Title: {story.title}
                          </p>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            Description: {story.description}
                          </p>
                          <p className="text-lg text-gray-600 mb-4">
                            <span className="font-medium">Status:</span> {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                          </p>
                          <div className="flex justify-center">
                            <Button
                              onClick={() => HandleReview(story._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
                            >
                              Review Story
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

      {/* Recent Stories - Right Side */}
      {/* <div>
                  <h2 className="text-4xl font-sans text-center text-gray-800 mb-12 underline">
                    Recent Stories
                  </h2>
                  {loading && <p className="text-center text-xl text-gray-600">Loading stories...</p>}
                  {error && <p className="text-center text-red-500 text-xl">Error: {error}</p>}
                  <div className="grid gap-6">
                    {pendingStories.map((story) => (
                      <div
                        key={story._id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      >
                        <img
                          src={story.images && story.images.length > 0 ? 
                            `http://localhost:5000/uploads/${story.images[0]}` : defaultImage}
                          alt={story.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                        <p className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">
                            Title: {story.requestType}
                          </p>
                          <p className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">
                            Title: {story.title}
                          </p>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            Description: {story.description}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            <span className="font-medium">Status:</span> {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                          </p>
                          <div className="flex justify-center">
                            <Button
                              onClick={() => HandleReview(story._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
                            >
                              Review Story
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
      {/* </div>
            </div>
          </section> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
