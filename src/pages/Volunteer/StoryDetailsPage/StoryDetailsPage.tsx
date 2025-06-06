import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { Button } from "../../../components/ui/button";
import {
  updateStory,
  Story,
  fetchStories,
} from "../../../reducers/beneficiary/storyReducer";
import VolunteerChatList from "../UserChat/VolunteerChatList";

const StoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get stories from Redux state
  const stories = useSelector((state: RootState) => state.stories.stories);
  const [story, setStory] = useState<Story | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedStory, setUpdatedStory] = useState<Partial<Story>>({});
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  useEffect(() => {
    const foundStory = stories.find((s) => s._id === id) || null;
    setStory(foundStory);
    setUpdatedStory(foundStory || {});
  }, [stories, id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedStory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!story) return;
    try {
      const formData = new FormData();
      Object.entries(updatedStory).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      console.log("formData", formData, updatedStory);

      await dispatch(updateStory({ id: story._id, updatedData: formData }));
      setIsEditing(false);
      setStory({ ...story, ...updatedStory } as Story);
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  if (!story) return <p className="text-center mt-10">Story not found</p>;

  return (
    <>
      {showChat && <VolunteerChatList userId={story.beneficiary._id} />}
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-10 space-y-6">
        <h1 className="text-3xl font-bold">{story.title}</h1>
        <div className="flex justify-end mt-8 ">
          <Button onClick={() => setShowChat(true)}>
            Chat With Beneficiary
          </Button>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Edit Story
          </Button>
        </div>

        {/* <div>
          <UserChatDetails volunteerId={updatedStory.reviewedBy?._id as string} userId={updatedStory.beneficiary?._id as string} userName={updatedStory.beneficiary?.name as string}/>
          </div> */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Title */}
            <div>
              <label className="font-semibold text-gray-700">Title:</label>
              <input
                type="text"
                name="title"
                value={(updatedStory.title as string) || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold text-gray-700">
                Description:
              </label>
              <textarea
                name="description"
                value={(updatedStory.description as string) || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
                rows={4}
              ></textarea>
            </div>
            {/* Reason */}
            <div>
              <label className="font-semibold text-gray-700">
                Reason for Rejection:
              </label>
              <textarea
                name="reason"
                value={(updatedStory.reason as string) || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
                rows={4}
              ></textarea>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="font-semibold text-gray-700">Status:</label>
              <select
                name="status"
                value={updatedStory.status || story.status}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Financial specific: Amount */}
            {story.requestType === "financial" && (
              <div>
                <label className="font-semibold text-gray-700">Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={
                    updatedStory.amount !== undefined ? updatedStory.amount : ""
                  }
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>
            )}

            {/* Blood/Organ specific: Blood Group */}
            {(story.requestType === "blood" ||
              story.requestType === "organ") && (
              <div>
                <label className="font-semibold text-gray-700">
                  Blood Group:
                </label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={(updatedStory.bloodGroup as string) || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>
            )}

            {/* Organ specific: Organ Type */}
            {story.requestType === "organ" && (
              <div>
                <label className="font-semibold text-gray-700">
                  Organ Type:
                </label>
                <input
                  type="text"
                  name="organType"
                  value={(updatedStory.organType as string) || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setUpdatedStory(story);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Title:</span> {story.title}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Description:</span>{" "}
              {story.description}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Status:</span>{" "}
              {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
            </p>
            {story.requestType === "financial" &&
              story.amount !== undefined && (
                <p className="text-gray-700">
                  <span className="font-semibold">Amount:</span> $
                  {story.amount.toLocaleString()}
                </p>
              )}
            {(story.requestType === "blood" ||
              story.requestType === "organ") && (
              <p className="text-gray-700">
                <span className="font-semibold">Blood Group:</span>{" "}
                {story.bloodGroup}
              </p>
            )}
            {story.requestType === "organ" && (
              <p className="text-gray-700">
                <span className="font-semibold">Organ Type:</span>{" "}
                {story.organType}
              </p>
            )}
            <p className="text-gray-700">
              <span className="font-semibold">Submitted At:</span>{" "}
              {new Date(story.submittedAt).toLocaleDateString()}
            </p>
            {story.reviewedAt && (
              <p className="text-gray-700">
                <span className="font-semibold">Reviewed At:</span>{" "}
                {new Date(story.reviewedAt).toLocaleDateString()}
              </p>
            )}
            {story.documents &&
              story.documents.filter((img) => img.trim() !== "").length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Documents:
                  </h4>
                  <ul className="list-disc pl-6">
                    {story.documents.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={`${
                            import.meta.env.VITE_SOCKET_URL
                          }/uploads/${doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Document {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {story.images &&
              story.images.filter((img) => img.trim() !== "").length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Images:</h4>
                  <div className="flex gap-4">
                    {story.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${
                          import.meta.env.VITE_SOCKET_URL
                        }/uploads/${img}`}
                        alt={`Story Image ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-md shadow-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            {story.reviewedBy && (
              <p className="text-gray-700">
                <span className="font-semibold">Reviewed By:</span>{" "}
                {story.reviewedBy.name}
              </p>
            )}
            {/* <div className="flex justify-center mt-8">
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                  Edit Story
                </Button>
              </div> */}
          </div>
        )}
        {/* <div className="flex justify-center mt-8">
            <Button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
              Back
            </Button>
          </div> */}
        {/* {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">Title:</label>
            <input
              type="text"
              name="title"
              value={updatedStory.title || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Description:</label>
            <textarea
              name="description"
              value={updatedStory.description || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
              rows={4}
            ></textarea>
          </div>
          <div className="flex justify-between mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
              Save Changes
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setUpdatedStory(story);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700"><span className="font-semibold">Title:</span> {story.title}</p>
          <p className="text-gray-700"><span className="font-semibold">Description:</span> {story.description}</p>
          <p className="text-gray-700"><span className="font-semibold">Status:</span> {story.status.toUpperCase()}</p>

          {story.requestType === "financial" && story.amount !== undefined && (
            <p className="text-gray-700"><span className="font-semibold">Amount:</span> ${story.amount.toLocaleString()}</p>
          )}

          {story.requestType === "blood" && (
            <p className="text-gray-700"><span className="font-semibold">Blood Group:</span> {story.bloodGroup}</p>
          )}

          {story.requestType === "organ" && (
            <p className="text-gray-700"><span className="font-semibold">Organ Type:</span> {story.organType}</p>
          )}

          <p className="text-gray-700"><span className="font-semibold">Submitted At:</span> {new Date(story.submittedAt).toLocaleDateString()}</p>
           */}
        {/* Display Beneficiary Details */}
        {story.beneficiary && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold">Beneficiary Details</h2>
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {story.beneficiary.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {story.beneficiary.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {story.beneficiary.phone}
            </p>
          </div>
        )}

        {/* Approve & Reject Buttons */}
        {/* <div className="flex justify-normal pl-4 mt-6">
            <Button
              onClick={() => handleStatusUpdate("approved")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleStatusUpdate("rejected")}
              className="bg-red-600 hover:bg-red-700 text-white ml-3 px-5 py-2 rounded-lg"
            >
              Reject
            </Button>
          </div> */}
        {/* </div> */}
        {/* )} */}

        <div className="flex justify-end mt-8">
          <Button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
};

export default StoryDetailsPage;
