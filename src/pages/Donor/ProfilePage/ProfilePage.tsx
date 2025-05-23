import { ChangeEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDonor,
  updateDonorProfile,
} from "../../../reducers/donors/donorReducer";
import { RootState, AppDispatch } from "../../../store/store";
// import Header from "../../../components/beneficiary/Header/Header";
import { Upload } from "lucide-react";
import { fetchWallet } from "../../../reducers/users/walletReducer";

const DonorProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, email, profilePic, phone, role } = useSelector(
    (state: RootState) => state.donor.donorId
  );
  const { address, submissionStatus } = useSelector(
    (state: RootState) => state.donor
  );

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name,
    phone,
    profilePic,
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
  });
  const [preview, setPreview] = useState<string>("");
  const profilepicurl =
    preview === "" ? `${import.meta.env.VITE_BASE_URL}${profilePic}` : preview;
  const { walletBalance, walletLoading } = useSelector(
    (state: RootState) => state.wallet
  );

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getDonor());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedProfile({
      name,
      phone,
      profilePic,
      address: { ...address },
    });
  }, [name, phone, profilePic ?? "", address]);

  const handleEdit = () => setIsEditing(true);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //     const { name, value } = e.target;

  //     if (name.startsWith('address.')) {
  //         const field = name.split('.')[1];
  //         setUpdatedProfile({
  //             ...updatedProfile,
  //             address: {
  //                 ...updatedProfile.address,
  //                 [field]: value
  //             }
  //         });
  //     } else {
  //         setUpdatedProfile({
  //             ...updatedProfile,
  //             [name]: value
  //         });
  //     }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1]; // e.g., "street", "city", etc.
      setUpdatedProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setUpdatedProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProfilePic = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setUpdatedProfile((prevState) => ({
        ...prevState,
        profilePic: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    dispatch(updateDonorProfile(updatedProfile));
    setIsEditing(false);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-8 bg-gray-200 shadow-xl rounded-2xl border border-gray-200 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Donor Profile
        </h2>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <img
              src={profilepicurl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg transition duration-300 ease-in-out group-hover:brightness-75"
            />
            {isEditing && (
              <label
                htmlFor="file-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
              >
                <Upload className="w-6 h-6 text-white" />
              </label>
            )}
            {isEditing && (
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePic}
                className="hidden"
              />
            )}
          </div>
        </div>

        {submissionStatus === "loading" && (
          <p className="text-blue-500 text-center">Loading...</p>
        )}
        {submissionStatus === "failed" && (
          <p className="text-red-500 text-center">Failed to load profile</p>
        )}

        {/* Name */}
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-700 capitalize w-1/4">
            Name:
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={updatedProfile.name}
              onChange={handleChange}
              className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
            />
          ) : (
            <p className="w-3/4">{name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-700 capitalize w-1/4">
            Email:
          </label>
          <p className="w-3/4">{email}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-700 capitalize w-1/4">
            Phone:
          </label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={updatedProfile.phone}
              onChange={handleChange}
              className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
            />
          ) : (
            <p className="w-3/4">{phone}</p>
          )}
        </div>

        {/* Role */}
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-700 capitalize w-1/4">
            Role:
          </label>
          <p className="w-3/4">{role}</p>
        </div>

        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-700 capitalize w-1/4">
            Wallet Balance:
          </label>
          {walletLoading ? (
            <p className="w-3/4">Loading...</p>
          ) : (
            <p className="w-3/4">{walletBalance}</p>
          )}
        </div>

        {/* Address Fields */}
        {/* {["street", "city", "state", "zipCode", "country"].map((field) => (
                    <div key={field} className="flex items-center justify-between">
                        <label className="font-semibold text-gray-700 capitalize w-1/4">{field}:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name={`address?.${field}`}
                                value={updatedProfile?.address[field as keyof typeof updatedProfile.address]}
                                onChange={handleChange}
                                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
                            />
                        ) : (
                            <p className="w-3/4">{address?address[field as keyof typeof address]:""}</p>
                        )}
                    </div>
                ))} */}
        {["street", "city", "state", "zipCode", "country"].map((field) => (
          <div key={field} className="flex items-center justify-between">
            <label className="font-semibold text-gray-700 capitalize w-1/4">
              {field}:
            </label>
            {isEditing ? (
              <input
                type="text"
                name={`address.${field}`}
                value={
                  updatedProfile?.address?.[
                    field as keyof typeof updatedProfile.address
                  ] || ""
                }
                onChange={handleChange}
                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"
              />
            ) : (
              <p className="w-3/4">
                {address?.[field as keyof typeof address] || ""}
              </p>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md"
              >
                Update profile
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DonorProfilePage;
