
import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxiosInstance from "../../api/useraxios";
import { volunteerDetails } from "./volunteerReducer";


export interface Response_ChatsTypes{
    messageId?:string,
    sender:string,
    receiver:string,
    message:string,
    timestamp:string,
    isRead?:boolean,
    userType:"user"|"volunteer",
    attachment?: {
       type: string;   
       url: string;
       name: string;
       size: number;
   }
   

}

export interface CallData {
    senderId: string;
    senderName:string;
    receiverId: string;
    receiverName?:string;
    senderProfilePic:string;
    callType: "audio" | "video";
    roomId?:string
  }

export interface ErrorPayload {
    message: string;
    status?: number;
  }

export interface UserStateTypes {
    id: string;
    _id?:string;
    name: string;
    email: string;
    phone: string;
    isActive?: boolean;
    authSourse?: string;
    role?: string;
    profilePic: string | File;
  }


  export interface ToastMsg{
    action:boolean,
    message:string,
    type:"error"|"success"|"info"|'idle'
  }

export const submitVolunteerForm = async (formData: volunteerDetails) => {
    console.log(formData,'rdfgvh');
    
    return await userAxiosInstance.post("/volunteers", formData);
};


export const getVolunteerApi = async (id: string) => {
    console.log(id,'id');
    
    return await userAxiosInstance.get(`/volunteers/${id}`);
};


export const volunteer_get_MessagesvolunteerId= createAsyncThunk<

Response_ChatsTypes[],
string,
  { rejectValue: ErrorPayload }
>("/beneficiary/volunteer/chats-get", async (volunteerid, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get(
      `/beneficiary/chats-userId/${volunteerid}`
    
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

export const volunteer_get_UserDetails= createAsyncThunk<

UserStateTypes,
string,
  { rejectValue: ErrorPayload }
>("/volunteer/get/userdetails", async (userId, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/${userId}`
    
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
