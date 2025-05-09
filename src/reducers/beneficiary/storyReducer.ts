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
  location?: string;
  raisedAmount?: number;
  bloodGroup?: string;
  organType?: string;
  documents?: string[];
  images?: string[];
  status: "pending" | "processing" | "approved" | "rejected";
  reason?: string;
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
      const response = await userAxiosInstance.get<Story[]>("/story/stories");
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
  { id: string; updatedData: FormData },
  { rejectValue: string }
>(
  "stories/updateStory",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      console.log(updatedData, "updated data from story reducer");
      
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


  export const fetchMyStories = createAsyncThunk(
    'story/fetchMyStories',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await userAxiosInstance.get('/api/story/mystories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch stories');
      }
    }
  );


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
      })
      .addCase(fetchMyStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchMyStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default storySlice.reducer;
