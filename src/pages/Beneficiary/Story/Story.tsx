import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { createStory } from "../../../reducers/beneficiary/storyReducer";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Swal from "sweetalert2";

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
  const [location, setLocation] = useState<string>("");

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
      formData.append("location", location); 
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
      .then(()=>{console.log('success')
        // alert('success')

        Swal.fire({
          icon: 'success',
          title: 'Story Submitted Successfully',
          text: 'Your story has been submitted successfully.',
          timer: 2500,
          showConfirmButton: true,
        }).then(() => {
          navigate("/home"); // Redirect after successful submission
        });
      }
      )
    //   navigate("/beneficiary"); // Redirect after successful submission
    } catch (error) {
      console.error("Error submitting story:", error);
      Swal.fire({
        icon: 'error',
        title: 'Story Submission Failed',
        text: 'There was an error submitting your story. Please try again.',
        timer: 2500,
        showConfirmButton: true,
      });
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
          <>
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
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Location</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                required
              />
            </div>
          </>
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
