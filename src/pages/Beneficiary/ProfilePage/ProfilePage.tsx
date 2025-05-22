import { ChangeEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import Header from "../../../components/beneficiary/Header/Header";
import { Upload } from "lucide-react";
import { getBeneficiary, updateBeneficiaryProfile } from "../../../reducers/beneficiary/beneficiaryReducer";

const BeneficiaryProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        name, email, phone, profilePic, role, 
        dateOfBirth, gender, identificationType, identificationNumber,
        address, familyDetails, submissionStatus
    } = useSelector((state: RootState) => state.beneficiary);

    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState<string>('');
    const profilepicurl = preview === '' ? `${import.meta.env.VITE_SOCKET_URL}${profilePic}` : preview;

    const [updatedProfile, setUpdatedProfile] = useState({
        name, phone,  dateOfBirth, gender, identificationType,
        identificationNumber, address, familyDetails, profilePic
    });

    useEffect(() => {
        dispatch(getBeneficiary());
    }, [dispatch]);

    useEffect(() => {
        setUpdatedProfile({
            name, phone, dateOfBirth, gender,
            identificationType, identificationNumber, address, familyDetails, profilePic
        });
    }, [name, phone, dateOfBirth, gender, identificationType, identificationNumber, address, familyDetails, profilePic]);

    const handleEdit = () => setIsEditing(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split('.')[1];
            setUpdatedProfile({
                ...updatedProfile,
                address: { ...updatedProfile.address, [key]: value }
            });
        } else if (name.startsWith("familyDetails.")) {
            const key = name.split('.')[1];
            setUpdatedProfile({
                ...updatedProfile,
                familyDetails: { ...updatedProfile.familyDetails, [key]: value }
            });
        }
        //  else if (name === "dateOfBirth") {
        //     setUpdatedProfile({ ...updatedProfile, dateOfBirth: new Date(value).toISOString() });
        // }
        else {
            setUpdatedProfile({ ...updatedProfile, [name]: value });
        }
    };

    const handleProfilePic = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setUpdatedProfile((prevState) => ({
                ...prevState,
                profilePic: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        dispatch(updateBeneficiaryProfile(updatedProfile))
        setIsEditing(false);
    };

    // const renderField = (
    //     label: string,
    //     name: string,
    //     value: string,
    //     handleChange: any,
    //     isEditing: boolean,
    //     isTextarea: boolean = false
    //   ): JSX.Element => {
    //     return (
    //       <div className="form-group">
    //         <label>{label}</label>
    //         {isEditing ? (
    //           isTextarea ? (
    //             <textarea
    //               name={name}
    //               value={value}
    //               onChange={handleChange}
    //               className="form-control"
    //             />
    //           ) : name === "dateOfBirth" ? (
    //             <input
    //               type="date"
    //               name={name}
    //               value={value} // should be yyyy-mm-dd
    //               onChange={handleChange}
    //               className="form-control"
    //             />
    //           ) : (
    //             <input
    //               type="text"
    //               name={name}
    //               value={value}
    //               onChange={handleChange}
    //               className="form-control"
    //             />
    //           )
    //         ) : (
    //           <div>{value}</div>
    //         )}
    //       </div>
    //     );
    //   };
      

    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto p-8 bg-gray-200 shadow-xl rounded-2xl border border-gray-200 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Beneficiary Profile</h2>
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <img
                            src={profilepicurl}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg transition duration-300 ease-in-out group-hover:brightness-75"
                        />
                        {isEditing && <label
                            htmlFor="file-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        >
                            <Upload className="w-6 h-6 text-white" />
                        </label>}
                        {isEditing && <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePic}
                            className="hidden"
                        />}
                    </div>
                </div>

                {submissionStatus === "loading" && <p className="text-blue-500 text-center">Loading...</p>}
                {submissionStatus === "failed" && <p className="text-red-500 text-center">Failed to load profile</p>}

                {/* Name */}
                {renderField("Name", "name", updatedProfile.name, handleChange, isEditing)}
                {/* Email */}
                {renderStaticField("Email", email)}
                {/* Phone */}
                {renderField("Phone", "phone", updatedProfile.phone, handleChange, isEditing)}
                {/* Role */}
                {renderStaticField("Role", role)}
                {/* Condition */}
                {/* {renderField("Condition", "condition", updatedProfile.condition, handleChange, isEditing)} */}
                {/* Details */}
                {/* {renderField("Details", "details", updatedProfile.details, handleChange, isEditing, true)} */}
                {/* Date of Birth */}
                {renderField(
                "Date of Birth",
                "dateOfBirth",
                isEditing
                    ? new Date(updatedProfile.dateOfBirth).toISOString().split("T")[0] // yyyy-mm-dd
                    : new Date(updatedProfile.dateOfBirth).toLocaleDateString("en-GB"), // dd/mm/yyyy
                handleChange,
                isEditing
                )}

                {/* {renderField("Date of Birth", "dateOfBirth", new Date (updatedProfile.dateOfBirth).toLocaleDateString(), handleChange, isEditing)} */}
                {/* Gender */}
                {renderField("Gender", "gender", updatedProfile.gender, handleChange, isEditing)}
                {/* ID Type */}
                {renderField("ID Type", "identificationType", updatedProfile.identificationType, handleChange, isEditing)}
                {/* ID Number */}
                {renderField("ID Number", "identificationNumber", updatedProfile.identificationNumber, handleChange, isEditing)}

                {/* Address Fields */}
                <h3 className="text-lg font-semibold text-gray-700 mt-4">Address</h3>
                {renderField("Street", "address.street", updatedProfile.address.street, handleChange, isEditing)}
                {renderField("City", "address.city", updatedProfile.address.city, handleChange, isEditing)}
                {renderField("State", "address.state", updatedProfile.address.state, handleChange, isEditing)}
                {renderField("Zip Code", "address.zipCode", updatedProfile.address.zipCode, handleChange, isEditing)}
                {renderField("Country", "address.country", updatedProfile.address.country, handleChange, isEditing)}

                {/* Family Details */}
                <h3 className="text-lg font-semibold text-gray-700 mt-4">Family Details</h3>
                {renderField("Members Count", "familyDetails.membersCount", updatedProfile.familyDetails.membersCount, handleChange, isEditing)}
                {renderField("Income Level", "familyDetails.incomeLevel", updatedProfile.familyDetails.incomeLevel, handleChange, isEditing)}

                {/* Buttons */}
                <div className="flex justify-center mt-6 space-x-4">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md">Update profile</button>
                            <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md">Cancel</button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md">Edit Profile</button>
                    )}
                </div>
            </div>
        </>
    );
};

// Helper functions for rendering fields
// const renderField = (label: string, name: string, value:string , handleChange: any, isEditing: boolean, isTextarea = false) => (
//     <div className="flex items-start justify-between">
//         <label className="font-semibold text-gray-700 capitalize w-1/4">{label}:</label>
//         {isEditing ? (
//             isTextarea ? (
//                 <textarea name={name} value={value} onChange={handleChange} 
//                     className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"></textarea>
//             ) : (
//                 <input type="text" name={name} value={value} onChange={handleChange} 
//                     className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200" />
//             )
//         ) : (
//             <p className="w-3/4">{value}</p>
//         )}
//     </div>
// );

const renderField = (
    label: string,
    name: string,
    value: string,
    handleChange: any,
    isEditing: boolean,
    isTextarea = false
  ) => (
    <div className="flex items-start justify-between mb-4">
      <label className="font-semibold text-gray-700 capitalize w-1/4">{label}:</label>
      {isEditing ? (
        isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
          />
        ) : name === "dateOfBirth" ? (
          <input
            type="date"
            name={name}
            value={value} // must be in yyyy-mm-dd format
            onChange={handleChange}
            className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
          />
        ) : (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleChange}
            className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
          />
        )
      ) : (
        <p className="w-3/4">{value}</p>
      )}
    </div>
  );
  

const renderStaticField = (label: string, value: string) => (
    <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">{label}:</label>
        <p className="w-3/4">{value}</p>
    </div>
);

export default BeneficiaryProfilePage;
