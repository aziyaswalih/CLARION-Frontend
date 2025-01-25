import { createAsyncThunk } from "@reduxjs/toolkit";
import { useraxiosInstance } from "../../api/useraxios";


export const userSignup=createAsyncThunk('/user/signup',async(signupdata,{rejectWithValue})=>{
    try {
        const response=await useraxiosInstance.post('/signup',signupdata)
        if (response.data) {
            return response.data
            
        }
        
    } catch (error) {

        rejectWithValue(error)
        
    }
})