// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { AxiosError } from 'axios';
// import userAxiosInstance from '../../api/useraxios';

// // Define the Story interface based on your model
// export interface Story {
//   _id: string;
//   beneficiary: string; // You might change this to mongoose.Types.ObjectId if needed
//   title: string;
//   description: string;
//   documents?: string[];
//   images?: string[];
//   status: 'pending' | 'processing' | 'approved' | 'rejected';
//   submittedAt: string;
//   reviewedAt?: string;
//   reviewedBy?: string; // volunteer id or name
// }

// // Define the slice state type
// interface StoryState {
//   stories: Story[];
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: StoryState = {
//   stories: [],
//   loading: false,
//   error: null,
// };

// // Async thunk to fetch stories from the backend
// export const fetchStories = createAsyncThunk<
//   Story[], // Return type
//   void,    // Parameter type (none)
//   { rejectValue: string } // reject value type
// >(
//   'stories/fetchStories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await userAxiosInstance.get<Story[]>('/beneficiary/stories'); // Adjust API URL if needed
//       return response.data;
//     } catch (error: any) {
//       const err: AxiosError = error;
//       return rejectWithValue(err.response?.data as string|| 'An error occurred while fetching stories');
//     }
//   }
// );

// const storySlice = createSlice({
//   name: 'stories',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStories.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
//         state.loading = false;
//         state.stories = action.payload;
//       })
//       .addCase(fetchStories.rejected, (state, action: PayloadAction<string | undefined>) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch stories';
//       });
//   },
// });

// export default storySlice.reducer;


// In your storySlice.ts (or a similar file)
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import userAxiosInstance from "../../api/useraxios";
// import { AxiosError } from "axios";


// enum RequestType {
//     FINANCIAL = "financial",
//     BLOOD = "blood",
//     ORGAN = "organ",
//     OTHER = "other",
//   }

// export interface Story {
//   _id: string;
//   beneficiary: string;
//   requestType: RequestType;
//   title: string;
//   description: string;
//   amount?: number; // Required if requestType is "financial"
//   bloodGroup?: string; // Required if requestType is "blood" (or optionally for organ)
//   organType?: string;  // Required if requestType is "organ"
//   documents?: string[];
//   images?: string[];
//   status: "pending" | "processing" | "approved" | "rejected";
//   submittedAt: string;
//   reviewedAt?: string;
//   reviewedBy?: string;
// }

// interface StoryState {
//   stories: Story[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: StoryState = {
//   stories: [],
//   loading: false,
//   error: null,
// };

// export const createStory = createAsyncThunk<
//   Story,
//   FormData,
//   { rejectValue: string }
// >("stories/createStory", async (formData, { rejectWithValue }) => {
//   try {
//     const response = await userAxiosInstance.post("/beneficiary/story", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data.story; // assuming the response contains { story: ... }
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Failed to submit story");
//   }
// });

// // Async thunk to fetch stories from the backend
// export const fetchStories = createAsyncThunk<
//   Story[], // Return type
//   void,    // Parameter type (none)
//   { rejectValue: string } // reject value type
// >(
//   'stories/fetchStories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await userAxiosInstance.get<Story[]>('/beneficiary/stories');
//       console.log(response,'response from fetch stories');
      
//       return response.data;
//     } catch (error: any) {
//       const err: AxiosError = error;
//       return rejectWithValue(err.response?.data as string|| 'An error occurred while fetching stories');
//     }
//   }
// );

// const storySlice = createSlice({
//   name: "stories",
//   initialState,
//   reducers: {
//     // ...other reducers if needed
//   },
//   extraReducers: (builder) => {
//     builder
//             .addCase(createStory.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(createStory.fulfilled, (state, action: PayloadAction<Story>) => {
//                 state.loading = false;
//                 state.stories.push(action.payload);
//             })
//             .addCase(createStory.rejected, (state, action: PayloadAction<string | undefined>) => {
//                 state.loading = false;
//                 state.error = action.payload || "Story creation failed";
//             })
//             .addCase(fetchStories.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//               })
//               .addCase(fetchStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
//                 state.loading = false;
//                 state.stories = action.payload;
//               })
//               .addCase(fetchStories.rejected, (state, action: PayloadAction<string | undefined>) => {
//                 state.loading = false;
//                 state.error = action.payload || 'Failed to fetch stories';
//               });
//   },
// });

// export default storySlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import  { AxiosError } from "axios";
import userAxiosInstance from "../../api/useraxios";

// Enum for request types
export enum RequestType {
  FINANCIAL = "financial",
  BLOOD = "blood",
  ORGAN = "organ",
  OTHER = "other",
}

// User interface based on your model
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profilePic: string;
}

// Story interface based on your model
export interface Story {
  _id: string ;
  beneficiary: User;
  requestType: RequestType;
  title: string;
  description: string;
  amount?: number;
  bloodGroup?: string;
  organType?: string;
  documents?: string[];
  images?: string[];
  status: "pending" | "processing" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: null | User;
}

interface StoryState {
  stories: Story[];
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  stories: [],
  loading: false,
  error: null,
};

// Async thunk to create a story
export const createStory = createAsyncThunk<
  Story,
  FormData,
  { rejectValue: string }
>("stories/createStory", async (formData, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.post("/beneficiary/story", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.story; // adjust based on your API response structure
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to submit story");
  }
});

// Async thunk to fetch stories
export const fetchStories = createAsyncThunk<
  Story[],
  void,
  { rejectValue: string }
>(
  "stories/fetchStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.get<Story[]>("/beneficiary/stories");
      console.log(response, "response from fetch stories");
      return response.data;
    } catch (error: any) {
      const err: AxiosError = error;
      return rejectWithValue(err.response?.data as string || "An error occurred while fetching stories");
    }
  }
);

// Async thunk to update a story
export const updateStory = createAsyncThunk<
  Story,
  { id: string; updatedData: Partial<Story> },
  { rejectValue: string }
>(
  "stories/updateStory",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      // console.log(updatedData, "updated data from story reducer");
      
      const response = await userAxiosInstance.put(`/beneficiary/story/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.story; // adjust based on your API response structure
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update story");
    }
  }
);

// Async thunk to add reviewer of a story
export const updateReviewer = createAsyncThunk<
  Story,
  { id: string },
  { rejectValue: string }>(
    "stories/updateReviewer",
    async ({ id }, { rejectWithValue }) => {
      try {
        const response = await userAxiosInstance.put(`/beneficiary/story/${id}/review`);
        return response.data.story;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update reviewer");
      }
    }
  )


const storySlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Create Story
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.loading = false;
        state.stories.push(action.payload);
      })
      .addCase(createStory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Story creation failed";
      })
      // Fetch Stories
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch stories";
      })
      // Update Story
      .addCase(updateStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.loading = false;
        // Replace the updated story in the state
        state.stories = state.stories.map((story) =>
          story._id === action.payload._id ? action.payload : story
        );
      })
      .addCase(updateStory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to update story";
      });
  },
});

export default storySlice.reducer;
