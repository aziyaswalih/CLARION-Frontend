
// import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import { submitBeneficiaryForm } from "./beneficiaryApicalls"; // ✅ Import API function

// // ✅ Define interfaces for structured data
// interface Address {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
// }

// interface FamilyDetails {
//     membersCount: string;
//     incomeLevel: string;
// }

// // ✅ Define the state interface
// interface BeneficiaryState {
//     details: string;
//     condition: string;
//     dateOfBirth: string;
//     gender: string;
//     identificationType: string;
//     identificationNumber: string;
//     address: Address;
//     familyDetails: FamilyDetails;
//     uploadedFiles: File[];
//     submissionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // ✅ Add submission status
//     submissionError: string | null; // ✅ Add submission error
// }

// // ✅ Initial state
// const initialState: BeneficiaryState = {
//     details: "",
//     condition: "",
//     dateOfBirth: "",
//     gender: "",
//     identificationType: "",
//     identificationNumber: "",
//     address: {
//         street: "",
//         city: "",
//         state: "",
//         zipCode: "",
//         country: "",
//     },
//     familyDetails: {
//         membersCount: "",
//         incomeLevel: "",
//     },
//     uploadedFiles: [],
//     submissionStatus: 'idle', // ✅ Initial status is idle
//     submissionError: null,     // ✅ Initial error is null
// };

// // ✅ Async thunk for submitting beneficiary details
// export const submitBeneficiaryDetails = createAsyncThunk(
//     'beneficiary/submitBeneficiaryDetails',
//     async (formData: BeneficiaryState, { rejectWithValue }) => {
//         try {
//             const response = await submitBeneficiaryForm(formData); // ✅ Call API function
//             return response.data; // ✅ Return data on success
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || 'Failed to submit beneficiary details'); // ✅ Return error message on failure
//         }
//     }
// );


// const beneficiarySlice = createSlice({
//     name: "beneficiary",
//     initialState,
//     reducers: {
//         updateField: (state, action: PayloadAction<{ field: keyof BeneficiaryState; value: any }>) => {
//             state[action.payload.field] = action.payload.value;
//         },
//         updateAddress: (state, action: PayloadAction<{ field: keyof Address; value: string }>) => {
//             state.address[action.payload.field] = action.payload.value;
//         },
//         updateFamilyDetails: (state, action: PayloadAction<{ field: keyof FamilyDetails; value: string }>) => {
//             state.familyDetails[action.payload.field] = action.payload.value;
//         },
//         uploadFiles: (state, action: PayloadAction<File[]>) => {
//             state.uploadedFiles = [...state.uploadedFiles, ...action.payload];
//         },
//         resetForm: (state) => {
//             // Reset all fields to initial state except submission status and error
//             state.details = initialState.details;
//             state.condition = initialState.condition;
//             state.dateOfBirth = initialState.dateOfBirth;
//             state.gender = initialState.gender;
//             state.identificationType = initialState.identificationType;
//             state.identificationNumber = initialState.identificationNumber;
//             state.address = initialState.address;
//             state.familyDetails = initialState.familyDetails;
//             state.uploadedFiles = initialState.uploadedFiles;
//             state.submissionStatus = 'idle'; // Reset submission status to idle on form reset
//             state.submissionError = null;     // Clear any previous submission errors
//         },
//     },
//     extraReducers: (builder) => { // ✅ Handle async thunk lifecycle
//         builder
//             .addCase(submitBeneficiaryDetails.pending, (state) => {
//                 state.submissionStatus = 'loading';
//                 state.submissionError = null; // Clear any previous errors when starting a new submission
//             })
//             .addCase(submitBeneficiaryDetails.fulfilled, (state) => {
//                 state.submissionStatus = 'succeeded';
//                 state.submissionError = null;
//                 // Optionally reset the form after successful submission:
//                 // beneficiarySlice.caseReducers.resetForm(state);
//             })
//             .addCase(submitBeneficiaryDetails.rejected, (state, action) => {
//                 state.submissionStatus = 'failed';
//                 state.submissionError = action.payload as string || 'Submission failed'; // Use payload as error message
//             });
//     },
// });

// // ✅ Export actions and reducer
// export const {
//     updateField,
//     updateAddress,
//     updateFamilyDetails,
//     uploadFiles,
//     resetForm,
// } = beneficiarySlice.actions;

// export default beneficiarySlice.reducer;
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { submitBeneficiaryForm } from "./beneficiaryApicalls";
import userAxiosInstance from "../../api/useraxios";

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

interface BeneficiaryState {
    name: string;
    email: string;
    phone: string;
    profilePic: string | File;
    role: string;
    // details: string;
    // condition: string;
    dateOfBirth: string;
    gender: string;
    identificationType: string;
    identificationNumber: string;
    address: Address;
    familyDetails: FamilyDetails;
    uploadedFiles: File[] | string[]; 
    submissionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    submissionError: string | null;
}

const initialState: BeneficiaryState = {
    name: "",
    email: "",
    phone: "",
    profilePic: "" ,
    role: "",
    // details: "",
    // condition: "",
    dateOfBirth: "",
    gender: "",
    identificationType: "",
    identificationNumber: "",
    address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    },
    familyDetails: {
        membersCount: "",
        incomeLevel: "",
    },
    uploadedFiles: [],
    submissionStatus: 'idle',
    submissionError: null,
};

// Submit Beneficiary Details
export const submitBeneficiaryDetails = createAsyncThunk(
    'beneficiary/submitBeneficiaryDetails',
    async (formData: Partial<BeneficiaryState>, { rejectWithValue }) => {
        try {
            const response = await submitBeneficiaryForm(formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit beneficiary details');
        }
    }
);

// Get Beneficiary Profile
export const getBeneficiary = createAsyncThunk(
    "beneficiary/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userAxiosInstance.get("/beneficiary/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            console.log(response,'response from get beneficiary');
            
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error fetching profile");
        }
    }
);

// Update Beneficiary Profile
export const updateBeneficiaryProfile = createAsyncThunk(
    "beneficiary/updateProfile",
    async (updatedProfile: Partial<BeneficiaryState>, { rejectWithValue }) => {
        try {
            let headers: Record<string, string> = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            };

            let payload: any;

            // Handling file uploads
            if (updatedProfile.profilePic instanceof File) {
                payload = new FormData();
                for (const key in updatedProfile) {
                    console.log(updatedProfile,'updatedprofile');
                    
                    if (key === 'profilePic') {
                        (updatedProfile.uploadedFiles as File[]).forEach((file) => {
                            payload.append("uploadedFiles", file);
                        });
                    } else {
                        payload.append(key, (updatedProfile as any)[key]);
                    }
                }
                headers["Content-Type"] = "multipart/form-data";
            } else {
                payload = updatedProfile;
                headers["Content-Type"] = "application/json";
            }

            const response = await userAxiosInstance.put("/beneficiary/profile", payload, {
                headers,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error updating profile");
        }
    }
);

const beneficiarySlice = createSlice({
    name: "beneficiary",
    initialState,
    reducers: {
        updateField: (state, action: PayloadAction<{ field: keyof BeneficiaryState; value: any }>) => {
            state[action.payload.field] = action.payload.value;
        },
        updateAddress: (state, action: PayloadAction<{ field: keyof Address; value: string }>) => {
            state.address[action.payload.field] = action.payload.value;
        },
        updateFamilyDetails: (state, action: PayloadAction<{ field: keyof FamilyDetails; value: string }>) => {
            state.familyDetails[action.payload.field] = action.payload.value;
        },
        uploadFiles: (state, action: PayloadAction<File[]>) => {
            state.uploadedFiles  = [...state.uploadedFiles, ...action.payload] as File[];
        },
        resetForm: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitBeneficiaryDetails.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
            })
            .addCase(submitBeneficiaryDetails.fulfilled, (state) => {
                state.submissionStatus = 'succeeded';
                state.submissionError = null;
            })
            .addCase(submitBeneficiaryDetails.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Submission failed';
            })
            .addCase(getBeneficiary.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
            })
            .addCase(getBeneficiary.fulfilled, (state, action) => {
                const data = action.payload;
                state.submissionStatus = 'succeeded';
                state.submissionError = null;
                console.log(action.payload,'case get beneficiary');
                state.name = data.user.name
                state.email = data.user.email
                state.phone = data.user.phone
                state.profilePic = data.user.profilePic
                state.role = data.user.role
                // state.details = data.details;
                // state.condition = data.condition;
                state.dateOfBirth = data.dateOfBirth;
                state.gender = data.gender;
                state.identificationType = data.identificationType;
                state.identificationNumber = data.identificationNumber;
                state.address = data.address;
                state.familyDetails = data.familyDetails;
                state.uploadedFiles = data.uploadedFiles;
            })
            .addCase(getBeneficiary.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Fetching profile failed';
            })
            .addCase(updateBeneficiaryProfile.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
            })
            .addCase(updateBeneficiaryProfile.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.submissionStatus = 'succeeded';
                state.submissionError = null;

                // state.details = data.updatedBeneficiary.details;
                // state.condition = data.updatedBeneficiary.condition;
                state.dateOfBirth = data.updatedBeneficiary.dateOfBirth;
                state.gender = data.updatedBeneficiary.gender;
                state.identificationType = data.updatedBeneficiary.identificationType;
                state.identificationNumber = data.updatedBeneficiary.identificationNumber;
                state.address = data.updatedBeneficiary.address;
                state.familyDetails = data.updatedBeneficiary.familyDetails;
                state.uploadedFiles = data.updatedBeneficiary.uploadedFiles;
            })
            .addCase(updateBeneficiaryProfile.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Update profile failed';
            });
    },
});

export const {
    updateField,
    updateAddress,
    updateFamilyDetails,
    uploadFiles,
    resetForm,
} = beneficiarySlice.actions;

export default beneficiarySlice.reducer;
