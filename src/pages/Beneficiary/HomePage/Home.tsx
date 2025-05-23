import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/ui/button";
import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
// import {  Book, MessageSquare, User } from "lucide-react";
import { toast } from "react-toastify";
import {
  getBeneficiary,
  submitBeneficiaryDetails,
} from "../../../reducers/beneficiary/beneficiaryReducer";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Response_ChatsTypes } from "../../../reducers/volunteers/volunteerApicalls";
import { User_get_MessagesUserId } from "../../../reducers/beneficiary/beneficiaryApicalls";
// import ChatList from "../Chat/ChatListUserSide";

//  types for address and family details
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FamilyDetails {
  membersCount: string;
  incomeLevel: string;
}

// type for form data
interface BeneficiaryFormData {
  // details: string;
  // condition: string;
  dateOfBirth: string;
  gender: string;
  identificationType: string;
  identificationNumber: string;
  address: Address;
  familyDetails: FamilyDetails; //
  // uploadedFiles: File[];
  // submissionStatus:'idle' | 'loading' | 'succeeded' | 'failed';
  // submissionError:(string | null);
}

const BeneficiaryHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.users.user);
  const beneficiaryData = useSelector((state: RootState) => state.beneficiary);
  console.log(beneficiaryData, "beneficiary data");
  const navigate = useNavigate();
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  // const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // const [details, setDetails] = useState<string>("");
  // const [condition, setCondition] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [identificationType, setIdentificationType] = useState<string>(""); // ✅ State for identificationType
  const [identificationNumber, setIdentificationNumber] = useState<string>(""); // ✅ State for identificationNumber
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [familyDetails, setFamilyDetails] = useState<FamilyDetails>({
    membersCount: "",
    incomeLevel: "",
  });

  useEffect(() => {
    if (user?.id) {
      console.log(user.id, "user id");

      dispatch(User_get_MessagesUserId(user.id))
        .unwrap()
        .then(async (messages: Response_ChatsTypes[]) => {
          console.log(messages);

          // Extract unique connections based on sender and receiver
          //   const uniqueConnections = new Map<string, Response_ChatsTypes>();

          // Map over messages to build unique connections
          messages.forEach((message) => {
            if (message.isRead === false) {
              setTotalUnreadCount((prevCount) => prevCount + 1); // Increment unread count
            }
          });
        });
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(getBeneficiary());
  }, [dispatch, user]);
  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //     // commented because file upload logic not implemented in the backend
  //     if (event.target.files) {
  //         // comment below function after completing implementation
  //         setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from([])]);
  //         // setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files??[])]);
  //     }
  // };

  const goToProfile = () => {
    navigate("/account/profile");
  };

  // const goToStories = () => {
  //     navigate('/stories');
  // };

  // const goToChats = () => {
  //     navigate('/chats');
  // };

  const handleSubmit = (): void => {
    const formData: BeneficiaryFormData = {
      // details,
      // condition,
      dateOfBirth,
      gender,
      identificationType,
      identificationNumber,
      address,
      familyDetails,
      // uploadedFiles,
      // submissionStatus:'idle',
      // submissionError:null
    };

    dispatch(submitBeneficiaryDetails(formData));
    toast.success(
      "Your details and documents have been submitted successfully!"
    );
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f9ff]">
      <Header />
      <section className="flex items-center bg-[#e9f5ff]">
        <div className="w-1/2 h-full p-8">
          <h2 className="text-4xl md:text-6xl font-serif text-[#00509e] tracking-wider mb-6">
            Welcome, Beneficiary!
          </h2>
          <p className="text-xl md:text-2xl text-[#3b3b3b] mb-8 italic">
            "Hope is the bridge between your challenges and a better tomorrow."
          </p>
          <p className="text-lg md:text-xl text-[#555555] mb-8">
            Please upload your reports and provide details about your situation
            to help us understand your needs better.
          </p>
          <div className="container mx-auto flex ">
            {" "}
            {/* Centered content, spaced icons */}
            {/* Profile Icon */}
            {beneficiaryData.submissionStatus === "succeeded" && (
              <div
                className="flex flex-col items-center cursor-pointer text-[#00509e] hover:text-blue-700 transition-colors"
                onClick={goToProfile}
              >
                {/* <div className="p-3 bg-[#e9f5ff] rounded-full mb-2 shadow-sm"> {/* Icon background and styling 
                        <User size={28} /> 
                    </div> */}
                <span className="text-md font-bold underline">
                  Go to Profile
                </span>
              </div>
            )}
            {/* Stories Icon */}
            {/* <div
                    className="flex flex-col items-center cursor-pointer text-[#00509e] hover:text-blue-700 transition-colors"
                    onClick={goToStories}
                >
                    <div className="p-3 bg-[#e9f5ff] rounded-full mb-2 shadow-sm"> {/* Icon background and styling 
                        <Book size={28} /> {/* Lucide icon 
                    </div>
                    <span className="text-sm font-medium">Stories</span>
                </div>

                {/* Chats Icon with Unread Count 
                 <div
                    className="flex flex-col items-center cursor-pointer text-[#00509e] hover:text-blue-700 transition-colors relative" // Added relative for badge positioning
                    onClick={goToChats}
                >
                    <div className="p-3 bg-[#e9f5ff] rounded-full mb-2 shadow-sm"> {/* Icon background and styling 
                        <MessageSquare size={28} /> {/* Lucide icon 
                    </div>
                    <span className="text-sm font-medium">Chats</span>
                     {/* --- Unread Count Badge --- 
                     {totalUnreadCount > 0 && (
                        <span className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {totalUnreadCount}
                        </span>
                     )}
                     {/* --- END Unread Count Badge --- 
                </div> */}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/story")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Add Story +
            </button>
          </div>
        </div>

        <div className="w-1/2 h-full flex items-center justify-center">
          <img
            src="/images/featured-2.jpeg"
            alt="Beneficiary Help"
            className="w-4/5 h-full object-cover brightness-100 mt-20 m-16 p-4 bg-[#b2cbf986]"
          />
        </div>
      </section>
      {/* {beneficiaryData.details && <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg"><h3 className="text-2xl md:text-3xl font-semibold text-[#00509e] mb-6">Your submitted details</h3>
        <p>{beneficiaryData.details}</p>
        </div>
        } */}
      {/* trying to add something */}
      {/* <ChatList/> */}
      {beneficiaryData.submissionStatus !== "succeeded" && (
        <section className="bg-[#f4f9ff] py-16 px-4">
          <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl md:text-3xl font-semibold text-[#00509e] mb-6">
              Submit Your Details
            </h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg text-[#3b3b3b] mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-lg text-[#3b3b3b] mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Identification */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg text-[#3b3b3b] mb-2">
                    Identification Type
                  </label>
                  <input
                    type="text"
                    value={identificationType}
                    onChange={(e) => setIdentificationType(e.target.value)}
                    placeholder="e.g., National ID, Passport"
                    className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-lg text-[#3b3b3b] mb-2">
                    Identification Number
                  </label>
                  <input
                    type="text"
                    value={identificationNumber}
                    onChange={(e) => setIdentificationNumber(e.target.value)}
                    placeholder="Enter your ID number"
                    className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-lg text-[#3b3b3b] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg"
                />
              </div>

              {/* Family Details */}
              <div>
                <label className="block text-lg text-[#3b3b3b] mb-2">
                  Family Details
                </label>
                <input
                  type="text"
                  placeholder="Number of Family Members"
                  value={familyDetails.membersCount}
                  onChange={(e) =>
                    setFamilyDetails({
                      ...familyDetails,
                      membersCount: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <input
                  type="text"
                  placeholder="Approximate Family Income Level"
                  value={familyDetails.incomeLevel}
                  onChange={(e) =>
                    setFamilyDetails({
                      ...familyDetails,
                      incomeLevel: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-lg"
                />
              </div>

              {/* Upload Files */}
              {/* <div className="border border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center">
                        <Upload className="w-10 h-10 text-gray-500 mb-2" />
                        <input type="file" id="fileInput" multiple onChange={handleFileUpload} className="hidden" />
                        <label htmlFor="fileInput" className="text-[#00509e] cursor-pointer hover:underline">
                            Click to upload files
                        </label>
                    </div> */}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="bg-[#00509e] text-white w-full py-3 rounded-md"
              >
                Submit
              </Button>
            </form>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BeneficiaryHome;
