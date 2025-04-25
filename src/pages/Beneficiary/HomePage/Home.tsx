import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/ui/button";
import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
import {  Eye } from "lucide-react";
import { toast } from "react-toastify";
import { getBeneficiary, submitBeneficiaryDetails } from "../../../reducers/beneficiary/beneficiaryReducer";
import {  AppDispatch, RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";

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
    submissionStatus:'idle' | 'loading' | 'succeeded' | 'failed';
    submissionError:(string | null);
}

const BeneficiaryHome: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state:RootState) => state.users.user)
    const beneficiaryData = useSelector((state: RootState) => state.beneficiary);
    console.log(beneficiaryData,'beneficiary data');
    const navigate = useNavigate()
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

   useEffect(()=>{
    dispatch(getBeneficiary())
   },[dispatch,user])
    // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //     // commented because file upload logic not implemented in the backend
    //     if (event.target.files) {
    //         // comment below function after completing implementation
    //         setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from([])]);
    //         // setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files??[])]);
    //     }
    // };

    const goToProfile = () => {
        navigate('/profile');
      };

        const goToStories = () => {
            navigate('/stories');
        };
    
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
            submissionStatus:'idle',
            submissionError:null
        };

        dispatch(submitBeneficiaryDetails(formData));
        toast.success("Your details and documents have been submitted successfully!");
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
                    Please upload your reports and provide details about your situation to help us understand your needs better.
                </p>
                {beneficiaryData.submissionStatus ==='succeeded' && <div className="flex items-center space-x-4 cursor-pointer text-[#3c3630]" onClick={goToProfile}>
                <Eye className="w-6 h-6" />
                <span className="text-lg font-medium underline">Go to profile</span>
                
          </div>}
          <br></br>
          <div className="flex items-center space-x-4 cursor-pointer text-[#3c3630]" onClick={goToStories}>
                        <Eye className="w-6 h-6" />
                        <span className="text-lg font-medium underline">View Your Stories</span>
                      </div><br></br>
            <div className="flex justify-center">
            <button onClick={()=>navigate('/story')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
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
        {beneficiaryData.submissionStatus!=='succeeded' && <section className="bg-[#f4f9ff] py-16 px-4">
            <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl md:text-3xl font-semibold text-[#00509e] mb-6">
                    Submit Your Details
                </h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                    {/* Details */}
                    {/* <div>
                        <label className="block text-lg text-[#3b3b3b] mb-2">
                            Your Story
                        </label>
                        <textarea
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Provide details about your background and needs..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                        ></textarea>
                    </div> */}

                    {/* Condition */}
                    {/* <div>
                        <label className="block text-lg text-[#3b3b3b] mb-2">
                            Your Condition
                        </label>
                        <textarea
                            rows={3}
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            placeholder="Describe your current condition or situation..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                        ></textarea>
                    </div> */}

                    {/* Date of Birth & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg text-[#3b3b3b] mb-2">Date of Birth</label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-lg text-[#3b3b3b] mb-2">Gender</label>
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
                            <label className="block text-lg text-[#3b3b3b] mb-2">Identification Type</label>
                            <input
                                type="text"
                                value={identificationType}
                                onChange={(e) => setIdentificationType(e.target.value)}
                                placeholder="e.g., National ID, Passport"
                                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-lg text-[#3b3b3b] mb-2">Identification Number</label>
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
                        <label className="block text-lg text-[#3b3b3b] mb-2">Address</label>
                        <input
                            type="text"
                            placeholder="Street"
                            value={address.street}
                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Zip Code"
                            value={address.zipCode}
                            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={address.country}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg"
                        />
                    </div>

                    {/* Family Details */}
                    <div>
                        <label className="block text-lg text-[#3b3b3b] mb-2">Family Details</label>
                        <input
                            type="text"
                            placeholder="Number of Family Members"
                            value={familyDetails.membersCount}
                            onChange={(e) => setFamilyDetails({ ...familyDetails, membersCount: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-lg mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Approximate Family Income Level"
                            value={familyDetails.incomeLevel}
                            onChange={(e) => setFamilyDetails({ ...familyDetails, incomeLevel: e.target.value })}
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
                    <Button onClick={handleSubmit} className="bg-[#00509e] text-white w-full py-3 rounded-md">
                        Submit
                    </Button>
                </form>
            </div>
        </section>}

        <Footer />
    </div>
);
};

export default BeneficiaryHome;