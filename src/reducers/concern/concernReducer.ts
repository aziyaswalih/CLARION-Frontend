// // features/concern/concernSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import userAxiosInstance from '../../api/useraxios';

// interface Concern {
//   reportedMemberId: string;
//   subject: string;
//   description: string;
//   reporterId: string;
// }

// interface Member {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface ConcernState {
//   loading: boolean;
//   error: string | null;
//   success: boolean;
//   members: Member[];
// }

// const initialState: ConcernState = {
//   loading: false,
//   error: null,
//   success: false,
//   members: [],
// };



// export const submitConcern = createAsyncThunk(
//   'concern/submit',
//   async (data: Concern) => {
//     const res = await userAxiosInstance.post('/concerns',data, {
//       headers: { 'Content-Type': 'application/json' },
//     });
//     if (!res) throw new Error('Failed to submit concern');
//     return res
//   }
// );

// const concernSlice = createSlice({
//   name: 'concern',
//   initialState,
//   reducers: {
//     clearStatus: (state) => {
//       state.success = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(submitConcern.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(submitConcern.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(submitConcern.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Submission failed';
//       });
//   },
// });

// export const { clearStatus } = concernSlice.actions;
// export default concernSlice.reducer;


// features/concern/concernSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAxiosInstance from '../../api/useraxios';

interface Concern {
  reportedMemberId: Member | string;
  subject: string;
  description: string;
  reporterId: Member | string;
}

interface ConcernFull extends Concern {
  _id: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected';
  resolutionNote?: string;
  reporterId: Member;
  reportedMemberId: Member;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface ConcernState {
  loading: boolean;
  error: string | null;
  success: boolean;
  members: Member[];
  allConcerns: ConcernFull[];
  selectedConcern: ConcernFull | null;
}

const initialState: ConcernState = {
  loading: false,
  error: null,
  success: false,
  members: [],
  allConcerns: [],
  selectedConcern: null,
};

export const fetchMembers = createAsyncThunk('concern/members', async () => {
  const res = await userAxiosInstance.get('/members');
  return res.data;
});

export const submitConcern = createAsyncThunk('concern/submit', async (data: Concern) => {
  const res = await userAxiosInstance.post('/concerns', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
});

// Admin: fetch all concerns
export const fetchAllConcerns = createAsyncThunk('admin/concerns', async () => {
  const res = await userAxiosInstance.get('/concerns');
  return res.data;
});

// Admin: fetch a specific concern
export const fetchConcernById = createAsyncThunk('admin/concernById', async (id: string) => {
  const res = await userAxiosInstance.get(`/concerns/${id}`);
  return res.data;
});

// Admin: update concern
export const updateConcernStatus = createAsyncThunk(
  'admin/updateConcern',
  async ({ id, status, resolutionNote }: { id: string; status: string; resolutionNote: string }) => {
    const res = await userAxiosInstance.put(`/concerns/${id}`, { status, resolutionNote });
    return res.data;
  }
);

const concernSlice = createSlice({
  name: 'concern',
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit concern
      .addCase(submitConcern.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitConcern.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitConcern.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Submission failed';
      })

      // Fetch members
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })

      // Fetch all concerns (admin)
      .addCase(fetchAllConcerns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllConcerns.fulfilled, (state, action) => {
        state.loading = false;
        state.allConcerns = action.payload;
      })
      .addCase(fetchAllConcerns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch concerns';
      })

      // Fetch one concern (admin)
      .addCase(fetchConcernById.pending, (state) => {
        state.loading = true;
        state.selectedConcern = null;
      })
      .addCase(fetchConcernById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedConcern = action.payload;
      })
      .addCase(fetchConcernById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load concern';
      })

      // Update status
      .addCase(updateConcernStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConcernStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedConcern = action.payload;
      })
      .addCase(updateConcernStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update concern';
      });
  },
});

export const { clearStatus } = concernSlice.actions;
export default concernSlice.reducer;
