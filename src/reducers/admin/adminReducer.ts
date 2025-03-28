// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import userAxiosInstance from "../../api/useraxios";

// interface Beneficiary {
//   _id: string;
//   name: string;
//   isActive: boolean;
//   [key: string]: any; // For additional properties
// }

// interface AdminState {
//   beneficiaries: Beneficiary[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AdminState = {
//   beneficiaries: [],
//   loading: false,
//   error: null,
// };

// // Async thunk actions
// export const fetchBeneficiaries = createAsyncThunk<Beneficiary[], void, { rejectValue: string }>(
//   "admin/fetchBeneficiaries",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await userAxiosInstance.get<{ beneficiaries: Beneficiary[] }>(
//         "http://localhost:5000/api/admin/beneficiaries"
//       );
//       return response.data.beneficiaries;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

// export const blockBeneficiary = createAsyncThunk<{ id: string; success: boolean }, string, { rejectValue: string }>(
//   "admin/blockBeneficiary",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await userAxiosInstance.put<{ success: boolean }>(
//         `http://localhost:5000/api/admin/beneficiaries/block/${id}`
//       );
//       return { id, success: response.data.success };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

// export const unblockBeneficiary = createAsyncThunk<{ id: string; success: boolean }, string, { rejectValue: string }>(
//   "admin/unblockBeneficiary",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await userAxiosInstance.put<{ success: boolean }>(
//         `http://localhost:5000/api/admin/beneficiaries/unblock/${id}`
//       );
//       return { id, success: response.data.success };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

// const adminSlice = createSlice({
//   name: "admin",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBeneficiaries.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchBeneficiaries.fulfilled, (state, action: PayloadAction<Beneficiary[]>) => {
//         state.loading = false;
//         state.beneficiaries = action.payload;
//       })
//       .addCase(fetchBeneficiaries.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch beneficiaries";
//       })
//       .addCase(blockBeneficiary.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
//         state.beneficiaries = state.beneficiaries.map((beneficiary) =>
//           beneficiary._id === action.payload.id
//             ? { ...beneficiary, isActive: false }
//             : beneficiary
//         );
//       })
//       .addCase(unblockBeneficiary.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
//         state.beneficiaries = state.beneficiaries.map((beneficiary) =>
//           beneficiary._id === action.payload.id
//             ? { ...beneficiary, isActive: true }
//             : beneficiary
//         );
//       });
//   },
// });

// export default adminSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import userAxiosInstance from "../../api/useraxios";

// Types
interface UserCommon {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  isActive: boolean;
  [key: string]: any;
}

interface AdminState {
  volunteers: UserCommon[];
  beneficiaries: UserCommon[];
  donors: UserCommon[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AdminState = {
  volunteers: [],
  beneficiaries: [],
  donors: [],
  loading: false,
  error: null,
};

// ===== Volunteers =====
export const fetchVolunteers = createAsyncThunk<UserCommon[], void, { rejectValue: string }>(
  "admin/fetchVolunteers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.get<{ volunteers: UserCommon[] }>(
        "http://localhost:5000/api/admin/volunteers"
      );
      return response.data.volunteers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while fetching volunteers");
    }
  }
);

export const blockVolunteer = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "admin/blockVolunteer",
  async (id, { rejectWithValue }) => {
    try {
      await userAxiosInstance.put(`http://localhost:5000/api/admin/volunteers/block/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while blocking volunteer");
    }
  }
);

export const unblockVolunteer = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "admin/unblockVolunteer",
  async (id, { rejectWithValue }) => {
    try {
      await userAxiosInstance.put(`http://localhost:5000/api/admin/volunteers/unblock/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while unblocking volunteer");
    }
  }
);

// ===== Beneficiaries =====
export const fetchBeneficiaries = createAsyncThunk<UserCommon[], void, { rejectValue: string }>(
  "admin/fetchBeneficiaries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.get<{ beneficiaries: UserCommon[] }>(
        "http://localhost:5000/api/admin/beneficiaries"
      );
      return response.data.beneficiaries;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while fetching beneficiaries");
    }
  }
);

export const blockBeneficiary = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "admin/blockBeneficiary",
  async (id, { rejectWithValue }) => {
    try {
      await userAxiosInstance.put(`http://localhost:5000/api/admin/beneficiaries/block/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while blocking beneficiary");
    }
  }
);

export const unblockBeneficiary = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "admin/unblockBeneficiary",
  async (id, { rejectWithValue }) => {
    try {
      await userAxiosInstance.put(`http://localhost:5000/api/admin/beneficiaries/unblock/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while unblocking beneficiary");
    }
  }
);

// ===== Donors =====
export const fetchDonors = createAsyncThunk<UserCommon[], void, { rejectValue: string }>(
  "admin/fetchDonors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.get<{ donors: UserCommon[] }>(
        "http://localhost:5000/api/admin/donors"
      );
      return response.data.donors;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while fetching donors");
    }
  }
);

export const blockDonor = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "admin/blockDonor",
  async (id, { rejectWithValue }) => {
    try {
      await userAxiosInstance.put(`http://localhost:5000/api/admin/donors/block/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while blocking donor");
    }
  }
);

export const unblockDonor = createAsyncThunk<{ id: string }, string, { rejectValue: string }>(
  "admin/unblockDonor",
  async (id, { rejectWithValue }) => {
    try {
      await userAxiosInstance.put(`http://localhost:5000/api/admin/donors/unblock/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred while unblocking donor");
    }
  }
);

// ===== Slice =====
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Volunteers
      .addCase(fetchVolunteers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVolunteers.fulfilled, (state, action) => { state.loading = false; state.volunteers = action.payload; })
      .addCase(fetchVolunteers.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error fetching volunteers"; })
      .addCase(blockVolunteer.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.map((vol) => vol._id === action.payload.id ? { ...vol, isActive: false } : vol);
      })
      .addCase(unblockVolunteer.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.map((vol) => vol._id === action.payload.id ? { ...vol, isActive: true } : vol);
      })

      // Beneficiaries
      .addCase(fetchBeneficiaries.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => { state.loading = false; state.beneficiaries = action.payload; })
      .addCase(fetchBeneficiaries.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error fetching beneficiaries"; })
      .addCase(blockBeneficiary.fulfilled, (state, action) => {
        state.beneficiaries = state.beneficiaries.map((ben) => ben._id === action.payload.id ? { ...ben, isActive: false } : ben);
      })
      .addCase(unblockBeneficiary.fulfilled, (state, action) => {
        state.beneficiaries = state.beneficiaries.map((ben) => ben._id === action.payload.id ? { ...ben, isActive: true } : ben);
      })

      // Donors
      .addCase(fetchDonors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDonors.fulfilled, (state, action) => { state.loading = false; state.donors = action.payload; })
      .addCase(fetchDonors.rejected, (state, action) => { state.loading = false; state.error = action.payload || "Error fetching donors"; })
      .addCase(blockDonor.fulfilled, (state, action) => {
        state.donors = state.donors.map((donor) => donor._id === action.payload.id ? { ...donor, isActive: false } : donor);
      })
      .addCase(unblockDonor.fulfilled, (state, action) => {
        state.donors = state.donors.map((donor) => donor._id === action.payload.id ? { ...donor, isActive: true } : donor);
      });
  },
});

export default adminSlice.reducer;
