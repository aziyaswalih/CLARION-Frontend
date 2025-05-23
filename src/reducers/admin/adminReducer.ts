import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

interface DonationReport {
  totalAmount: number;
  totalRaised: number;
  totalRemaining: number;
  totalCompleted: number;
}

interface AdminState {
  report: DonationReport;
  volunteers: UserCommon[];
  beneficiaries: UserCommon[];
  donors: UserCommon[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AdminState = {
  report: {
    totalAmount: 0,
    totalRaised: 0,
    totalRemaining: 0,
    totalCompleted: 0,
  },
  loading: false,
  error: null,
  volunteers: [],
  beneficiaries: [],
  donors: [],
  // loading: false,
  // error: null,
};

// ===== Volunteers =====
export const fetchVolunteers = createAsyncThunk<
  UserCommon[],
  void,
  { rejectValue: string }
>("admin/fetchVolunteers", async (_, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get<{ volunteers: UserCommon[] }>(
      `${import.meta.env.VITE_BASE_URL}/admin/volunteers`
    );
    return response.data.volunteers;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while fetching volunteers"
    );
  }
});

export const fetchDonationReport = createAsyncThunk(
  "admin/fetchDonationReport",
  async (_, thunkAPI) => {
    try {
      const res = await userAxiosInstance.get("/admin/reports");
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const blockVolunteer = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("admin/blockVolunteer", async (id, { rejectWithValue }) => {
  try {
    await userAxiosInstance.put(
      `${import.meta.env.VITE_BASE_URL}/admin/volunteers/block/${id}`
    );
    return { id };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while blocking volunteer"
    );
  }
});

export const unblockVolunteer = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("admin/unblockVolunteer", async (id, { rejectWithValue }) => {
  try {
    await userAxiosInstance.put(
      `${import.meta.env.VITE_BASE_URL}/admin/volunteers/unblock/${id}`
    );
    return { id };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while unblocking volunteer"
    );
  }
});

// ===== Beneficiaries =====
export const fetchBeneficiaries = createAsyncThunk<
  UserCommon[],
  void,
  { rejectValue: string }
>("admin/fetchBeneficiaries", async (_, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get<{
      beneficiaries: UserCommon[];
    }>(`${import.meta.env.VITE_BASE_URL}/admin/beneficiaries`);
    return response.data.beneficiaries;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while fetching beneficiaries"
    );
  }
});

export const blockBeneficiary = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("admin/blockBeneficiary", async (id, { rejectWithValue }) => {
  try {
    await userAxiosInstance.put(
      `${import.meta.env.VITE_BASE_URL}/admin/beneficiaries/block/${id}`
    );
    return { id };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while blocking beneficiary"
    );
  }
});

export const unblockBeneficiary = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("admin/unblockBeneficiary", async (id, { rejectWithValue }) => {
  try {
    await userAxiosInstance.put(
      `${import.meta.env.VITE_BASE_URL}/admin/beneficiaries/unblock/${id}`
    );
    return { id };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while unblocking beneficiary"
    );
  }
});

// ===== Donors =====
export const fetchDonors = createAsyncThunk<
  UserCommon[],
  void,
  { rejectValue: string }
>("admin/fetchDonors", async (_, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get<{ donors: UserCommon[] }>(
      `${import.meta.env.VITE_BASE_URL}/admin/donors`
    );
    return response.data.donors;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while fetching donors"
    );
  }
});

export const blockDonor = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("admin/blockDonor", async (id, { rejectWithValue }) => {
  try {
    await userAxiosInstance.put(
      `${import.meta.env.VITE_BASE_URL}/admin/donors/block/${id}`
    );
    return { id };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while blocking donor"
    );
  }
});

export const unblockDonor = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("admin/unblockDonor", async (id, { rejectWithValue }) => {
  try {
    await userAxiosInstance.put(
      `${import.meta.env.VITE_BASE_URL}/admin/donors/unblock/${id}`
    );
    return { id };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred while unblocking donor"
    );
  }
});

// ===== Slice =====
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Volunteers
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload;
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching volunteers";
      })
      .addCase(blockVolunteer.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.map((vol) =>
          vol._id === action.payload.id ? { ...vol, isActive: false } : vol
        );
      })
      .addCase(unblockVolunteer.fulfilled, (state, action) => {
        state.volunteers = state.volunteers.map((vol) =>
          vol._id === action.payload.id ? { ...vol, isActive: true } : vol
        );
      })

      // Beneficiaries
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching beneficiaries";
      })
      .addCase(blockBeneficiary.fulfilled, (state, action) => {
        state.beneficiaries = state.beneficiaries.map((ben) =>
          ben._id === action.payload.id ? { ...ben, isActive: false } : ben
        );
      })
      .addCase(unblockBeneficiary.fulfilled, (state, action) => {
        state.beneficiaries = state.beneficiaries.map((ben) =>
          ben._id === action.payload.id ? { ...ben, isActive: true } : ben
        );
      })

      // Donors
      .addCase(fetchDonors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.loading = false;
        state.donors = action.payload;
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching donors";
      })
      .addCase(blockDonor.fulfilled, (state, action) => {
        state.donors = state.donors.map((donor) =>
          donor._id === action.payload.id
            ? { ...donor, isActive: false }
            : donor
        );
      })
      .addCase(unblockDonor.fulfilled, (state, action) => {
        state.donors = state.donors.map((donor) =>
          donor._id === action.payload.id ? { ...donor, isActive: true } : donor
        );
      })
      .addCase(fetchDonationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchDonationReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
