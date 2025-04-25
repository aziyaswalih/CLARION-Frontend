// // donorReducer.ts
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import userAxiosInstance from "../../api/useraxios";

// interface DonationState {
//   donation: any;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: DonationState = {
//   donation: null,
//   isLoading: false,
//   error: null,
// };

// // Create Donation Async Action
// export const createDonation = createAsyncThunk<
//   any,
//   { amount: number; currency: string },
//   { rejectValue: string }
// >("donor/createDonation", async ({ amount, currency }, { rejectWithValue }) => {
//   try {
//     const response = await userAxiosInstance.post("http://localhost:5000/api/payments/create-Donation", {
//       amount,
//       currency,
//     });
//     return response.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Failed to create Donation");
//   }
// });

// // Verify Payment Async Action
// export const verifyPayment = createAsyncThunk<
//   any,
//   { paymentResponse: any },
//   { rejectValue: string }
// >("donor/verifyPayment", async ( paymentResponse , { rejectWithValue }) => {
//   try {
//     console.log(paymentResponse,'payment response');
    
//     const response = await userAxiosInstance.post("http://localhost:5000/api/payments/verify-payment", paymentResponse);
//     return response.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Payment verification failed");
//   }
// });

// const donorSlice = createSlice({
//   name: "donor",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createDonation.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(createDonation.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.donation = action.payload;
//       })
//       .addCase(createDonation.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "Something went wrong";
//       })
//       .addCase(verifyPayment.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(verifyPayment.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(verifyPayment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || "Payment verification failed";
//       });
//   },
// });

// export default donorSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import userAxiosInstance from "../../api/useraxios";

// Address & Donor Profile Types
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface DonorProfile {
  donorId: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "donor" | "volunteer" | "user";
    is_verified: boolean;
    profilePic: string | File;
  };
  address: Address;
}

// Donation State + Donor Profile State Combined
interface DonationState {
  donation: any;
  isLoading: boolean;
  error: string | null;
  // Donor profile fields
  donorId: DonorProfile['donorId'];
  address: Address;
  submissionStatus: "idle" | "loading" | "succeeded" | "failed";
  userDonations: any[]; // <--- New
  donationsLoading: boolean; // <--- New
}

// Initial State
const initialState: DonationState = {
  donation: null,
  isLoading: false,
  error: null,
  donorId: {
    id: '',
    name: '',
    email: '',
    phone: '',
    role: "donor",
    is_verified: false,
    profilePic: '',
  },
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  submissionStatus: "idle",
  userDonations: [], // <--- New
  donationsLoading: false, // <--- New
};

export const fetchUserDonations = createAsyncThunk(
  "donor/fetchUserDonations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.get("/donor/donations");
      console.log(response.data.data, 'response from donations');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch donations");
    }
  }
);


// Create Donation Async Action
export const createDonation = createAsyncThunk<
  any,
  { amount: number; currency: string },
  { rejectValue: string }
>("donor/createDonation", async ({ amount, currency }, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.post(
      "/payments/create-Donation",
      {amount, currency }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create Donation"
    );
  }
});

// Verify Payment Async Action
export const verifyPayment = createAsyncThunk<
  any,
  { paymentResponse: any },
  { rejectValue: string }
>("donor/verifyPayment", async (paymentResponse, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.post(
      "/payments/verify-payment",
      paymentResponse
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Payment verification failed"
    );
  }
});

export const newDonation = createAsyncThunk(
  "donor/newDonation",
  async (donationData: {causeId:string; amount :number}) => {
    const response = await userAxiosInstance.post("/payments/donation", donationData);
    return response.data;
  }
);
// Donor Profile APIs
export const getDonor = createAsyncThunk("donor/getDonor", async () => {
  const response = await userAxiosInstance.get("/donor/profile");
  console.log(response);
  
  return response.data.data;
});


// export const updateDonorProfile = createAsyncThunk(
//   "volunteer/updateProfile",
//   async (updatedProfile: Partial<DonorProfile>, { rejectWithValue }) => {
//       try {
//           let headers: Record<string, string> = {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//           };

//           let payload: any;

//           if (updatedProfile.donorId?.profilePic instanceof File) {
//               payload = new FormData();
//               for (const key in updatedProfile) {
//                   payload.append(key, (updatedProfile as any)[key]);
//               }
//               headers["Content-Type"] = "multipart/form-data";
//           } else {
//               payload = updatedProfile;
//               headers["Content-Type"] = "application/json";
//           }

//           const response = await userAxiosInstance.put("/donor/profile", payload, {
//               headers,
//           });
//           console.log(response.data, response.data.donor, 'response from update profile');

//           return response.data;
//       } catch (error: any) {
//           return rejectWithValue(error.response?.data?.message || "Error updating profile");
//       }
//   }
// );



export const updateDonorProfile = createAsyncThunk(
  "donor/updateDonorProfile",
  async (updatedData: any) => {
    const formData = new FormData();
    console.log(updatedData, 'data from update donor profile');

    if (updatedData) {
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key === 'name' || key === 'phone') {
          formData.append(`${key}`, value as unknown as string);
        }
      });
    }

    if (updatedData.address) {
      // Object.entries(updatedData.address).forEach(([key, value]) => {
        formData.append(`address`, JSON.stringify(updatedData.address));
      // });
    }

    if (updatedData.profilePic instanceof File) {
      formData.append('profilePic', updatedData.profilePic);
    }

    const response = await userAxiosInstance.put(
      "/donor/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data, 'response from update donor');
    return response.data;
  }
);


// export const updateDonorProfile = createAsyncThunk(
//   "donor/updateDonorProfile",
//   async (updatedData:any) => {
//     const formData = new FormData();
//     console.log(updatedData,'data from update donor profile');
    
//     if (updatedData) {
//       Object.entries(updatedData).forEach(([key, value]) => {
//         if (key === 'name' || key === 'phone')
//           {        
//             formData.append(`donorId.${key}`, value as unknown as string);
//           }      
//         });
//     }
//     if (updatedData.address) {
//       Object.entries(updatedData.address).forEach(([key, value]) => {
//         formData.append(`address.${key}`, value as string);
//       });
//     }
//     // if (updatedData.address) {
//     //   formData.append('address', JSON.stringify(updatedData.address));
//     // }
//     if (updatedData.profilePic instanceof File) {
//       formData.append('profilePic', updatedData.donorId.profilePic);
//     }
//     const response = await userAxiosInstance.put("/donor/profile", formData);
//     console.log(response.data,'response from update donor');
    
//     return response.data;
//   }
// );

const donorSlice = createSlice({
  name: "donor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Donation and Payment
    builder
      .addCase(createDonation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.donation = action.payload;
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Payment verification failed";
      });

    // Donor Profile
    builder
      .addCase(getDonor.pending, (state) => {
        state.submissionStatus = "loading";
        state.error = null;
      })
      .addCase(getDonor.fulfilled, (state, action: PayloadAction<DonorProfile>) => {
        state.submissionStatus = "succeeded";
        state.donorId = action.payload.donorId;
        state.address = action.payload.address;
      })
      .addCase(getDonor.rejected, (state, action) => {
        state.submissionStatus = "failed";
        state.error = action.error.message || "Failed to fetch donor";
      })
      .addCase(fetchUserDonations.pending, (state) => {
        state.donationsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDonations.fulfilled, (state, action) => {
        state.donationsLoading = false;
        state.userDonations = action.payload.data;
      })
      .addCase(fetchUserDonations.rejected, (state, action) => {
        state.donationsLoading = false;
        state.error = action.payload as string || "Failed to load donations";
      })
      .addCase(updateDonorProfile.pending, (state) => {
        state.submissionStatus = "loading";
        state.error = null;
      })
      .addCase(updateDonorProfile.fulfilled, (state, action) => {
        state.submissionStatus = "succeeded";
        console.log(action.payload);
        
        state.donorId.name = action.payload.data.updatedUser.name;
        state.donorId.phone = action.payload.data.updatedUser.phone;
        state.address.city = action.payload.data.updatedDonor.address.city;
        state.address.street = action.payload.data.updatedDonor.address.street;
        state.address.state = action.payload.data.updatedDonor.address.state;
        state.address.zipCode = action.payload.data.updatedDonor.address.zipCode;
        state.address.country = action.payload.data.updatedDonor.address.country;
        
      })
      .addCase(updateDonorProfile.rejected, (state, action) => {
        state.submissionStatus = "failed";
        state.error = action.error.message || "Failed to update donor profile";
      });
  },
});

export default donorSlice.reducer;
