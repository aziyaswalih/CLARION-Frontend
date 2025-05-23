import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  fetchStories,
  updateReviewer,
} from "../../../reducers/beneficiary/storyReducer";
import { useNavigate } from "react-router-dom";

export const RecentStories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { stories, loading, error } = useSelector(
    (state: RootState) => state.stories
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const storiesPerPage = 3;
  const defaultImage = "/images/orphanage.jpg";

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const filteredStories = useMemo(() => {
    return stories
      .filter((story) => story.status === "pending")
      .filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((story) =>
        selectedRequestType === "all"
          ? true
          : story.requestType === selectedRequestType
      )
      .sort((a, b) => {
        const dateA = new Date(a.submittedAt).getTime();
        const dateB = new Date(b.submittedAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [stories, searchQuery, selectedRequestType, sortOrder]);

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * storiesPerPage;
    return filteredStories.slice(start, start + storiesPerPage);
  }, [filteredStories, currentPage]);

  const uniqueRequestTypes = useMemo(() => {
    const types = new Set(stories.map((s) => s.requestType));
    return Array.from(types);
  }, [stories]);

  const HandleReview = (story_id: string) => {
    dispatch(updateReviewer({ id: story_id }))
      .unwrap()
      .then(() => navigate(`/volunteer/story/${story_id}`))
      .catch((error) => {
        alert("Error: " + error);
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-sans text-center text-gray-800 mb-8 underline">
        Recent Stories
      </h2>

      {/* Search, Filter, Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
        />

        <select
          value={selectedRequestType}
          onChange={(e) => {
            setSelectedRequestType(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded-md"
        >
          <option value="all">All Request Types</option>
          {uniqueRequestTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {loading && (
        <p className="text-center text-xl text-gray-600">Loading stories...</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-xl">Error: {error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paginatedStories.map((story) => (
          <div
            key={story._id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={
                story.images && story.images.length > 0 && story.images[0]
                  ? `${import.meta.env.VITE_SOCKET_URL}/uploads/${
                      story.images[0]
                    }`
                  : defaultImage
              }
              alt={story.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <p className="text-2xl font-semibold text-gray-800 mb-2 line-clamp-2">
                Request Type: {story.requestType}
              </p>
              <p className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                Title: {story.title}
              </p>
              <p className="text-gray-600 mb-4 line-clamp-3">
                Description: {story.description}
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Status :
                <span className="text-yellow-600 font-medium">
                  {" "}
                  {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                </span>{" "}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              } px-4 py-2 rounded-md`}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
