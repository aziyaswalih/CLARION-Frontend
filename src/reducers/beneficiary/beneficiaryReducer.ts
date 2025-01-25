import { createSlice } from "@reduxjs/toolkit";
import { userSignup } from "./beneficiaryApicalls";

const BeneficiaryInitialstate={
   beneficiary: "",
   isLoading:false,
   isError:false,
   message:"",
   isSuccess:false
}

const BeneficiaryState=createSlice({
    name:'beneficiary',
    initialState:BeneficiaryInitialstate,
    reducers:{

    },extraReducers(builder) {
        builder
        .addCase(userSignup.pending,(state)=>{
            state.isLoading=true
        }).addCase(userSignup.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
             state.beneficiary=action.payload
        }).addCase(userSignup.pending,(state,action)=>{
            state.isSuccess=false
            state.isError=true
            state.message='pending'
        })
    },
})