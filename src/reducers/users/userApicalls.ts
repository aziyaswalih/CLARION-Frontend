import { createAsyncThunk } from "@reduxjs/toolkit";
import  useraxiosInstance  from "../../api/useraxios";


export const userSignup = createAsyncThunk('/user/signup',async(signupdata,{rejectWithValue})=>{
    try {
        const response = await useraxiosInstance.post('/register',signupdata)
        if (response.data) {
            return response.data           
        }
        
    } catch (error) {
        rejectWithValue(error)
    }
})


export const userLogin = createAsyncThunk('/user/login', async (loginData : { email:string; password:string}, {rejectWithValue}) => {
    try {
        const response = await useraxiosInstance.post('/login', loginData);
        if(response.data) {
            return response.data
        }
    } catch (error : any) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const UserGoogle_post = createAsyncThunk("/user/google/login", async (credential: string, { rejectWithValue }) => {
  try {
    const response = await useraxiosInstance.post("/user/google", { credential });
    if (response.data && response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data.user));

      localStorage.setItem("authToken", JSON.stringify(response.data.token))
      console.log(response.data.user);
      
      return response.data;
    }
  } catch (error:any) {
    if (error) {
      return rejectWithValue({
        message: error.response?.data || error.message,
      });
    }
    return rejectWithValue({
      message: "something error for google login",
    });
  }
});

// Async thunk to fetch beneficiaries
// export const fetchBeneficiaries = createAsyncThunk(
//     'beneficiaries/fetchBeneficiaries',
//     async (_, { rejectWithValue }) => {
//       try {
//         const response = await axios.get('/api/beneficiaries'); // Replace with your API endpoint
//         return response.data.filter((beneficiary: Beneficiary) => beneficiary.role === 'user');
//       } catch (error) {
//         return rejectWithValue('Failed to fetch beneficiaries');
//       }
//     }
//   );
  