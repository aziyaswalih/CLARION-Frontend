import axios from 'axios';
import userAxiosInstance from '../../api/useraxios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorPayload, Response_ChatsTypes } from '../volunteers/volunteerApicalls';
import { VolunteerState } from '../volunteers/volunteerReducer';

const API_ENDPOINT = 'http://localhost:5000/api'; 

export const submitBeneficiaryForm = async (formData: any) => { 
    try {
        // 1. Retrieve authToken from localStorage
        const authToken = localStorage.getItem('authToken');

        // 2. Include Authorization header in axios request
        const response = await axios.post(
            `${API_ENDPOINT}/beneficiary`, // ✅  Adjust endpoint if needed
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Add Authorization header with Bearer token
                    'Content-Type': 'application/json' // Or 'multipart/form-data' if you are uploading files. Adjust as needed.
                }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};


export const User_get_MessagesUserId= createAsyncThunk<

Response_ChatsTypes[],
string,
  { rejectValue: ErrorPayload }
>("/user/chats-get", async (userId, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get(
      `/beneficiary/chats-userId/${userId}`
    
    );
    if (response.data) {
      return response.data.chats;
    }
  } catch (error) {
 
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});

export const user_get_volunteerDetails= createAsyncThunk<

VolunteerState,
string,
  { rejectValue: ErrorPayload }
>("/user/get/volunteerDetails", async (volunteerId, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get(
      `/beneficiary/volunteers/${volunteerId}`
    
    );
    if (response.data) {
      return response.data.user;
    }
  } catch (error) {
  
    return rejectWithValue({
      message: "something wrong in geting chats ",
    });
  }
});
