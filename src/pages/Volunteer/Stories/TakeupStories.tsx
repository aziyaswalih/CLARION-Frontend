import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  fetchStories,
  updateReviewer,
} from "../../../reducers/beneficiary/storyReducer";
import { useNavigate } from "react-router-dom";

export const TakeupStories = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { stories, loading, error } = useSelector(
    (state: RootState) => state.stories
  );
  const defaultImage = "/images/orphanage.jpg";

  // Local state for search, filter, sort, pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 6;

  // Get stories taken up by this user
  const filteredStories = useMemo(() => {
    let results = stories.filter(
      (story) => story.reviewedBy?.name === user?.name
    );

    if (searchTerm) {
      results = results.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((story) => story.status === statusFilter);
    }

    results.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "requestType") {
        return a.requestType.localeCompare(b.requestType);
      } else {
        return a.status.localeCompare(b.status);
      }
    });

    return results;
  }, [stories, user, searchTerm, statusFilter, sortBy]);

  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * storiesPerPage;
    const end = start + storiesPerPage;
    return filteredStories.slice(start, end);
  }, [filteredStories, currentPage]);

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

  const HandleReview = (story_id: string) => {
    dispatch(updateReviewer({ id: story_id }))
      .unwrap()
      .then(() => navigate(`/volunteer/story/${story_id}`))
      .catch((error) => {
        alert("Error: " + error);
        console.log(error);
      });
  };

  const getStatusColorClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "rejected":
        return "text-red-600 font-medium";
      case "completed":
        return "text-green-600 font-medium";
      case "approved":
        return "text-blue-600 font-medium";
      case "pending":
        return "text-yellow-600 font-medium";
      case "processing":
        return "text-orange-600 font-medium";
      default:
        return "text-gray-700 font-medium";
    }
  };

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-sans text-center text-gray-800 mb-12 underline">
        Takeups Stories
      </h2>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="title">Sort by Title</option>
          <option value="requestType">Sort by Request Type</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Loading & Error */}
      {loading && (
        <p className="text-center text-xl text-gray-600">Loading stories...</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-xl">Error: {error}</p>
      )}

      {/* Story Cards */}
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
                Status :
                <span className={getStatusColorClass(story.status)}>
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
        <div className="flex justify-center mt-8 gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={
                currentPage === index + 1 ? "bg-blue-600 text-white" : ""
              }
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
