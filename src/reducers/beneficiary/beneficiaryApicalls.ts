import { createAsyncThunk } from "@reduxjs/toolkit";
import { useraxiosInstance } from "../../api/useraxios";
// import axios from "axios";

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
  