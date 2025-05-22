import { ChangeEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getVolunteer, updateVolunteerProfile } from "../../../reducers/volunteers/volunteerReducer";
import { RootState, AppDispatch } from "../../../store/store";
import Header from "../../../components/beneficiary/Header/Header";
import { Upload } from "lucide-react";
const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, email,profilePic, phone, role, skills, motivation, availability,submissionStatus } = useSelector((state: RootState) => state.volunteer);
    console.log(name,email,role,profilePic,"=====");
    
    
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({ name, phone, skills, profilePic, motivation, availability });
    const [preview, setPreview] = useState<string>('');
    const profilepicurl = preview===''?`http://localhost:5000${profilePic}` : preview
    // console.log(profilepicurl,'url');
    useEffect(() => {
        dispatch(getVolunteer());
    }, [dispatch]);

    useEffect(() => {
        setUpdatedProfile({ name, phone, skills, profilePic, motivation, availability });
    }, [name, phone, skills,profilePic??'', motivation, availability]);

    const handleEdit = () => setIsEditing(true);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (name === 'skills') {
            const skillArray = value.split(',').map(item => item.trim());
            setUpdatedProfile({ 
                ...updatedProfile, 
                skills: skillArray 
            });
        } else {
            setUpdatedProfile({ 
                ...updatedProfile, 
                [name]: value 
            });
        }
    };

    const handleProfilePic=(e:ChangeEvent<HTMLInputElement>)=>{
    
        const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            setUpdatedProfile((prevState) => ({ 
              ...prevState,
              profilePic: file 
              }
              ));
              
    
    
            // Display a preview
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
    
        }

    const handleSave = () => {
        dispatch(updateVolunteerProfile(updatedProfile));
        setIsEditing(false);
    };


    return (
        <>
        <Header/>
        <div className="max-w-2xl mx-auto p-8 bg-gray-200 shadow-xl rounded-2xl border  border-gray-200  space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Volunteer Profile</h2>
            {/* ========= */}
            <div className="flex flex-col items-center space-y-4">
  <div className="relative group">
    <img
      src={profilepicurl}
      alt="Profile"
      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg transition duration-300 ease-in-out group-hover:brightness-75"
    />
    {/* Overlay for edit icon */}
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
            {/* =============== */}
            {submissionStatus === "loading" && <p className="text-blue-500 text-center">Loading...</p>}
            {submissionStatus === "failed" && <p className="text-red-500 text-center">Failed to load profile</p>}

            <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Name:</label>
        {isEditing ? (
            <input type="text" name="name" value={updatedProfile.name} onChange={handleChange} 
                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200" />
        ) : (
            <p className="w-3/4">{name}</p>
        )}
    </div>

    {/* Email (Always visible, no input field) */}
    <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Email:</label>
        <p className="w-3/4">{email}</p>
    </div>

    {/* Phone */}
    <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Phone:</label>
        {isEditing ? (
            <input type="text" name="phone" value={updatedProfile.phone} onChange={handleChange} 
                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200" />
        ) : (
            <p className="w-3/4">{phone}</p>
        )}
    </div>

    {/* Role (Always visible) */}
    <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Role:</label>
        <p className="w-3/4">{role}</p>
    </div>

    {/* Skills */}
    <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Skills:</label>
        {isEditing ? (
            <input type="text" name="skills" value={updatedProfile.skills} onChange={handleChange} 
                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200" />
        ) : (
            // <p className="w-3/4">{skills.forEach(skill)=>{
            //     {skill ,}
            // }}</p>
            <p className="w-3/4">{skills.join(', ')}</p>

        )}
    </div>

    {/* Motivation */}
    <div className="flex items-start">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Why volunteer?</label>
        {isEditing ? (
            <textarea name="motivation" value={updatedProfile.motivation} onChange={handleChange} 
                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200"></textarea>
        ) : (
            <p className="w-3/4">{motivation}</p>
        )}
    </div>

    {/* Availability */}
    <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-700 capitalize w-1/4">Availability:</label>
        {isEditing ? (
            <input type="text" name="availability" value={updatedProfile.availability} onChange={handleChange} 
                className="border p-2 w-3/4 rounded-lg focus:ring focus:ring-blue-200" />
        ) : (
            <p className="w-3/4">{availability}</p>
        )}
    </div>

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

export default ProfilePage;
