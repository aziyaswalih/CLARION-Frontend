// volunteerSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { submitVolunteerForm } from "./volunteerApicalls"; 
import userAxiosInstance from "../../api/useraxios";



export interface VolunteerState {
    id: string;
    _id?: string;
    name: string;
    email: string;
    phone: string;
    profilePic: string | File;
    role: string;
    skills: string[];
    motivation: string;
    availability: string;
    submissionStatus: "idle" | "loading" | "succeeded" | "failed";
    submissionError: string | null;
}

export interface volunteerDetails {
    skills: string[];
    motivation: string;
    availability: string;
}

const initialState: VolunteerState = {
    id: "",
    _id: "",
    name: "",
    email: "",
    phone: "",
    profilePic: "" ,
    role: "",
    skills:[],
    motivation:"",
    availability: "",
    submissionStatus: 'idle',
    submissionError: null,
};

export const submitVolunteerDetails = createAsyncThunk(
    'volunteer/submitVolunteerDetails',
    async (formData:volunteerDetails, { rejectWithValue }) => {
        try {
            const response = await submitVolunteerForm(formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit volunteer details');
        }
    }
);


export const getVolunteer = createAsyncThunk("volunteer/fetchProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await userAxiosInstance.get("/volunteers/profile");
        console.log(response.data,'fgyhgfdd5');
        
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Error fetching profile");
    }
});


export const updateVolunteerProfile = createAsyncThunk(
    "volunteer/updateProfile",
    async (updatedProfile: Partial<VolunteerState>, { rejectWithValue }) => {
        try {
            let headers: Record<string, string> = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            };

            let payload: any;

            if (updatedProfile.profilePic instanceof File) {
                payload = new FormData();
                for (const key in updatedProfile) {
                    payload.append(key, (updatedProfile as any)[key]);
                }
                headers["Content-Type"] = "multipart/form-data";
            } else {
                payload = updatedProfile;
                headers["Content-Type"] = "application/json";
            }

            const response = await userAxiosInstance.put("/volunteers/profile", payload, {
                headers,
            });
            console.log(response.data, response.data.volunteer, 'response from update profile');

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error updating profile");
        }
    }
);



const volunteerSlice = createSlice({
    name: "volunteer",
    initialState,
    reducers: {
        updateField: (state, action: PayloadAction<{ field: keyof VolunteerState; value: any }>) => {
            state[action.payload.field] = action.payload.value;
        },
        resetForm: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitVolunteerDetails.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
            })
            .addCase(submitVolunteerDetails.fulfilled, (state) => {
                state.submissionStatus = 'succeeded';
                state.submissionError = null;
            })
            .addCase(submitVolunteerDetails.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Submission failed';
            })
            .addCase(getVolunteer.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
            })
            .addCase(getVolunteer.fulfilled, (state,action) => {
                state.submissionStatus = 'succeeded';
                state.submissionError = null;
                state.email = action.payload.data.volunteerId.email;
                state.name = action.payload.data.volunteerId.name;
                state.profilePic = action.payload.data.volunteerId.profilePic;
                state.role = action.payload.data.volunteerId.role;
                state.phone = action.payload.data.volunteerId.phone;
                state.skills = action.payload.data.skills;
                state.availability = action.payload.data.availability;
                state.motivation = action.payload.data.motivation;
                console.log(action.payload.data);
                
                
            })
            .addCase(getVolunteer.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Submission failed';
            })
            .addCase(updateVolunteerProfile.pending, (state) => {
                state.submissionStatus = 'loading';
                state.submissionError = null;
            })
            .addCase(updateVolunteerProfile.fulfilled, (state,action) => {
                state.submissionStatus = 'succeeded';
                state.submissionError = null;
                console.log('update profile payload',action.payload.data);
                state.profilePic = action.payload.data.updatedUser.profilePic;
                state.skills = action.payload.data.updatedVolunteer.skills;
                state.availability = action.payload.data.updatedVolunteer.availability;
                state.motivation = action.payload.data.updatedVolunteer.motivation;
                state.name = action.payload.data.updatedUser.name;
                state.phone = action.payload.data.updatedUser.phone;

            })
            .addCase(updateVolunteerProfile.rejected, (state, action) => {
                state.submissionStatus = 'failed';
                state.submissionError = action.payload as string || 'Submission failed';
            });
    },
});

export const {
    updateField,
    resetForm,
} = volunteerSlice.actions;

export default volunteerSlice.reducer;
