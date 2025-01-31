import { createSlice } from "@reduxjs/toolkit";

const AdminInitialState = {
    admin: "",
    isLoading: false,
    isError: false,
    message: "",
    isSuccess: false
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: AdminInitialState,
    reducers:{

    },
    extraReducers(builder){
       
    }
})