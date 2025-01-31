import { createSlice } from "@reduxjs/toolkit";
import { userSignup } from "./beneficiaryApicalls";

const BeneficiaryInitialstate = {
   beneficiary: "",
   isLoading:false,
   isError:false,
   message:"",
   isSuccess:false
}

const BeneficiaryState = createSlice({
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
        }).addCase(userSignup.pending,(state)=>{
            state.isSuccess=false
            state.isError=true
            state.message='pending'
        })
    },
})


// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface Beneficiary {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   role: string;
// }

// interface BeneficiaryState {
//   beneficiaries: Beneficiary[];
//   loading: boolean;
//   error: string | null;
// }

// Initial state
// const initialState: BeneficiaryState = {
//   beneficiaries: [],
//   loading: false,
//   error: null,
// };


// Slice
// const beneficiarySlice = createSlice({
//   name: 'beneficiaries',
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
//       .addCase(fetchBeneficiaries.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

export default BeneficiaryState.reducer;
