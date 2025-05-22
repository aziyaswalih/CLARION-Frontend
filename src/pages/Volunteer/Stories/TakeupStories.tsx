import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { fetchStories, updateReviewer } from "../../../reducers/beneficiary/storyReducer";
import { useNavigate } from "react-router-dom";

export const TakeupStories = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { stories, loading, error } = useSelector(
    (state: RootState) => state.stories
  );
  const takeupsStories = useMemo(
    () => stories.filter((story) => story.reviewedBy?.name === user?.name),
    [stories]
  );
  const defaultImage = "/images/orphanage.jpg";

  const HandleReview = (story_id: string) => {
    dispatch(updateReviewer({ id: story_id }))
      .unwrap()
      .then(() => navigate(`/volunteer/story/${story_id}`))
      .catch((error) => {
        alert("Error: " + error);
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(fetchStories())
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-sans text-center text-gray-800 mb-12 underline">
        Takeups Stories
      </h2>

      {loading && (
        <p className="text-center text-xl text-gray-600">Loading stories...</p>
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
                {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
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
  );
};
