// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../../../store/store"; // adjust path as needed
// import { fetchStories } from "../../../reducers/beneficiary/storyReducer"; // adjust path as needed

// // Define a Story type based on your model
// export interface Story {
//   _id: string;
//   beneficiary: string; // you might show beneficiary id or name if populated
//   title: string;
//   description: string;
//   documents?: string[];
//   images?: string[];
//   status: "pending" | "processing" | "approved" | "rejected";
//   submittedAt: string;
//   reviewedAt?: string;
//   reviewedBy?: string; // volunteer id or name if populated
// }

// const StoryPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { stories, loading, error } = useSelector((state: RootState) => state.stories);

//   useEffect(() => {
//     dispatch(fetchStories());
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Stories</h2>

//       {loading && <p>Loading stories...</p>}
//       {error && <p className="text-red-500">Error: {error}</p>}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {stories.map((story: Story) => (
//           <div key={story._id} className="bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold">{story.title}</h3>
//             <p className="text-gray-600">{story.description}</p>
//             <p className="text-sm text-gray-400">Status: {story.status}</p>
//             <p className="text-sm text-gray-400">
//               Submitted At: {new Date(story.submittedAt).toLocaleDateString()}
//             </p>
//             {story.reviewedAt && (
//               <p className="text-sm text-gray-400">
//                 Reviewed At: {new Date(story.reviewedAt).toLocaleDateString()}
//               </p>
//             )}
//             {story.documents && story.documents.length > 0 && (
//               <div>
//                 <h4 className="font-semibold">Documents:</h4>
//                 <ul className="list-disc ml-4">
//                   {story.documents.map((doc, idx) => (
//                     <li key={idx}>
//                       <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                         Document {idx + 1}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {story.images && story.images.length > 0 && (
//               <div className="mt-2">
//                 <h4 className="font-semibold">Images:</h4>
//                 <div className="flex gap-2">
//                   {story.images.map((img, idx) => (
//                     <img key={idx} src={img} alt={`Story Image ${idx + 1}`} className="w-16 h-16 object-cover rounded-md shadow" />
//                   ))}
//                 </div>
//               </div>
//             )}
//             {story.reviewedBy && (
//               <p className="text-sm text-gray-400">Reviewed By: {story.reviewedBy}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StoryPage;

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../../store/store";
// import { createStory } from "../../../reducers/beneficiary/storyReducer";
// import { useNavigate } from "react-router-dom";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";

// const Story: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [documents, setDocuments] = useState<FileList | null>(null);
//   const [images, setImages] = useState<FileList | null>(null);

//   const handleDocumentsChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setDocuments(e.target.files);
//     }
//   };

//   const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(e.target.files);
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);

//     if (documents) {
//       Array.from(documents).forEach((file) => {
//         formData.append("documents", file);
//       });
//     }

//     if (images) {
//       Array.from(images).forEach((file) => {
//         formData.append("images", file);
//       });
//     }

//     try {
//       await dispatch(createStory(formData));
//       navigate("/beneficiary"); // Navigate to beneficiary home or profile after submission
//     } catch (error) {
//       console.error("Error submitting story:", error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-200 mt-32 space-y-6">
//       <h2 className="text-3xl font-bold text-gray-800 text-center">Add New Story</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-lg font-semibold text-gray-700 mb-2">Title:</label>
//           <Input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter story title"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-lg font-semibold text-gray-700 mb-2">Description:</label>
//           <textarea
//             className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-blue-200"
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter story description"
//             required
//           ></textarea>
//         </div>
//         <div>
//           <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Documents:</label>
//           <Input type="file" multiple onChange={handleDocumentsChange} accept=".pdf,.doc,.docx" />
//         </div>
//         <div>
//           <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Images:</label>
//           <Input type="file" multiple onChange={handleImagesChange} accept="image/*" />
//         </div>
//         <div className="flex justify-center">
//           <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md">
//             Submit Story
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Story;




import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { createStory } from "../../../reducers/beneficiary/storyReducer";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

// RequestType enum
enum RequestType {
  FINANCIAL = "financial",
  BLOOD = "blood",
  ORGAN = "organ",
  OTHER = "other",
}

const AddStoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [requestType, setRequestType] = useState<RequestType>(RequestType.OTHER);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [organType, setOrganType] = useState<string>("");

  const [documentFiles, setDocumentFiles] = useState<FileList | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const handleDocumentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles(e.target.files);
    }
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("requestType", requestType);
    formData.append("title", title);
    formData.append("description", description);
    
    if (requestType === RequestType.FINANCIAL) {
      formData.append("amount", amount.toString());
    }
    
    if (requestType === RequestType.BLOOD) {
      formData.append("bloodGroup", bloodGroup);
    }
    
    if (requestType === RequestType.ORGAN) {
      formData.append("organType", organType);
      formData.append("bloodGroup", bloodGroup);
    }

    if (documentFiles) {
      Array.from(documentFiles).forEach((file) => {
        formData.append("documents", file);
      });
    }
    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        formData.append("images", file);
      });
    }
    try {
      await dispatch(createStory(formData)).unwrap()
      .then(()=>{console.log('succes')
        alert('success')
      }
      )
    //   navigate("/beneficiary"); // Redirect after successful submission
    } catch (error) {
      console.error("Error submitting story:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl border mt-32 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Submit Your Story/Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Request Type Selector */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Request Type</label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as RequestType)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          >
            <option value={RequestType.FINANCIAL}>Financial Help</option>
            <option value={RequestType.BLOOD}>Blood Donation</option>
            <option value={RequestType.ORGAN}>Organ Donation</option>
            <option value={RequestType.OTHER}>Other</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter story title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter story description"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-200"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Conditional Fields */}
        {requestType === RequestType.FINANCIAL && (
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Amount Required</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter required amount"
              required
            />
          </div>
        )}

        {requestType === RequestType.BLOOD && (
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Blood Group</label>
            <Input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="Enter blood group (e.g., O+, A-)"
              required
            />
          </div>
        )}

        {requestType === RequestType.ORGAN && (
          <>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Organ Type</label>
              <Input
                type="text"
                value={organType}
                onChange={(e) => setOrganType(e.target.value)}
                placeholder="Enter the organ needed (e.g., Kidney)"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Blood Group</label>
              <Input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="Enter blood group (e.g., O+, A-)"
                required
              />
            </div>
          </>
        )}

        {/* Upload Documents */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Documents</label>
          <Input type="file" multiple onChange={handleDocumentsChange} accept=".pdf,.doc,.docx" />
        </div>

        {/* Upload Images */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Images</label>
          <Input type="file" multiple onChange={handleImagesChange} accept="image/*" />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md">
            Submit Story
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStoryPage;
