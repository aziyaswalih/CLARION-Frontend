// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

// interface FamilyDetails {
//   membersCount: string;
//   incomeLevel: string;
// }

// interface BeneficiaryState {
//   details: string;
//   condition: string;
//   dateOfBirth: string;
//   gender: string;
//   identificationType: string;
//   identificationNumber: string;
//   address: Address;
//   familyDetails: FamilyDetails;
//   uploadedFiles: File[];
// }

// const initialState: BeneficiaryState = {
//   details: "",
//   condition: "",
//   dateOfBirth: "",
//   gender: "",
//   identificationType: "",
//   identificationNumber: "",
//   address: {
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//   },
//   familyDetails: {
//     membersCount: "",
//     incomeLevel: "",
//   },
//   uploadedFiles: [],
// };

// const beneficiarySlice = createSlice({
//   name: "beneficiary",
//   initialState,
//   reducers: {
//     updateField: (state, action: PayloadAction<{ field: keyof BeneficiaryState; value: any }>) => {
//       state[action.payload.field] = action.payload.value;
//     },
//     updateAddress: (state, action: PayloadAction<{ field: keyof Address; value: string }>) => {
//       state.address[action.payload.field] = action.payload.value;
//     },
//     updateFamilyDetails: (state, action: PayloadAction<{ field: keyof FamilyDetails; value: string }>) => {
//       state.familyDetails[action.payload.field] = action.payload.value;
//     },
//     uploadFiles: (state, action: PayloadAction<File[]>) => {
//       state.uploadedFiles = [...state.uploadedFiles, ...action.payload];
//     },
//     resetForm: () => initialState,
//     submitBeneficiaryDetails: (state) => {
//       console.log("Submitting Beneficiary Details:", state);
//     },
//   },
// });

// export const {
//   updateField,
//   updateAddress,
//   updateFamilyDetails,
//   uploadFiles,
//   resetForm,
//   submitBeneficiaryDetails,
// } = beneficiarySlice.actions;

// export default beneficiarySlice.reducer;
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // ✅ Define interfaces for structured data
// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

// interface FamilyDetails {
//   membersCount: string;
//   incomeLevel: string;
// }

// // ✅ Define the state interface
// interface BeneficiaryState {
//   details: string;
//   condition: string;
//   dateOfBirth: string;
//   gender: string;
//   identificationType: string;
//   identificationNumber: string;
//   address: Address;
//   familyDetails: FamilyDetails;
//   uploadedFiles: File[];
// }

// // ✅ Initial state
// const initialState: BeneficiaryState = {
//   details: "",
//   condition: "",
//   dateOfBirth: "",
//   gender: "",
//   identificationType: "",
//   identificationNumber: "",
//   address: {
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//   },
//   familyDetails: {
//     membersCount: "",
//     incomeLevel: "",
//   },
//   uploadedFiles: [],
// };

// const beneficiarySlice = createSlice({
//   name: "beneficiary",
//   initialState,
//   reducers: {
//     updateField: (state, action: PayloadAction<{ field: keyof BeneficiaryState; value: any }>) => {
//       state[action.payload.field] = action.payload.value;
//     },
//     updateAddress: (state, action: PayloadAction<{ field: keyof Address; value: string }>) => {
//       state.address[action.payload.field] = action.payload.value;
//     },
//     updateFamilyDetails: (state, action: PayloadAction<{ field: keyof FamilyDetails; value: string }>) => {
//       state.familyDetails[action.payload.field] = action.payload.value;
//     },
//     uploadFiles: (state, action: PayloadAction<File[]>) => {
//       state.uploadedFiles = [...state.uploadedFiles, ...action.payload];
//     },
//     resetForm: () => initialState,

//     // ✅ Accepts formData instead of using state directly
//     submitBeneficiaryDetails: (state, action: PayloadAction<BeneficiaryState>) => {
//       console.log("Submitting Beneficiary Details:", action.payload);
//       return action.payload; // This updates the state with submitted data
//     },
//   },
// });

// // ✅ Export actions and reducer
// export const {
//   updateField,
//   updateAddress,
//   updateFamilyDetails,
//   uploadFiles,
//   resetForm,
//   submitBeneficiaryDetails,
// } = beneficiarySlice.actions;

// export default beneficiarySlice.reducer;

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { submitBeneficiaryForm } from "./beneficiaryApicalls"; // ✅ Import API function

// ✅ Define interfaces for structured data
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

// ✅ Define the state interface
interface BeneficiaryState {
    details: string;
    condition: string;
    dateOfBirth: string;
    gender: string;
    identificationType: string;
    identificationNumber: string;
    address: Address;
    familyDetails: FamilyDetails;
    uploadedFiles: File[];
    submissionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // ✅ Add submission status
    submissionError: string | null; // ✅ Add submission error
}

// ✅ Initial state
const initialState: BeneficiaryState = {
    details: "",
    condition: "",
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
    submissionStatus: 'idle', // ✅ Initial status is idle
    submissionError: null,     // ✅ Initial error is null
};

// ✅ Async thunk for submitting beneficiary details
export const submitBeneficiaryDetails = createAsyncThunk(
    'beneficiary/submitBeneficiaryDetails',
    async (formData: BeneficiaryState, { rejectWithValue }) => {
        try {
            const response = await submitBeneficiaryForm(formData); // ✅ Call API function
            return response.data; // ✅ Return data on success
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit beneficiary details'); // ✅ Return error message on failure
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
            state.uploadedFiles = [...state.uploadedFiles, ...action.payload];
        },
        resetForm: (state) => {
            // Reset all fields to initial state except submission status and error
            state.details = initialState.details;
            state.condition = initialState.condition;
            state.dateOfBirth = initialState.dateOfBirth;
            state.gender = initialState.gender;
            state.identificationType = initialState.identificationType;
            state.identificationNumber = initialState.identificationNumber;
            state.address = initialState.address;
            state.familyDetails = initialState.familyDetails;
            state.uploadedFiles = initialState.uploadedFiles;
            state.submissionStatus = 'idle'; // Reset submission status to idle on form reset
            state.submissionError = null;     // Clear any previous submission errors
        },
    },
    extraReducers: (builder) => { // ✅ Handle async thunk lifecycle
        builder
            .addCase(submitBeneficiaryDetails.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null; // Clear any previous errors when starting a new submission
            })
            .addCase(submitBeneficiaryDetails.fulfilled, (state) => {
                state.submissionStatus = 'succeeded';
                state.submissionError = null;
                // Optionally reset the form after successful submission:
                // beneficiarySlice.caseReducers.resetForm(state);
            })
            .addCase(submitBeneficiaryDetails.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Submission failed'; // Use payload as error message
            });
    },
});

// ✅ Export actions and reducer
export const {
    updateField,
    updateAddress,
    updateFamilyDetails,
    uploadFiles,
    resetForm,
} = beneficiarySlice.actions;

export default beneficiarySlice.reducer;
