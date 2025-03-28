
import userAxiosInstance from "../../api/useraxios";
import { volunteerDetails } from "./volunteerReducer";

export const submitVolunteerForm = async (formData: volunteerDetails) => {
    console.log(formData,'rdfgvh');
    
    return await userAxiosInstance.post("/volunteers", formData);
};


export const getVolunteerApi = async (id: string) => {
    console.log(id,'id');
    
    return await userAxiosInstance.get(`/volunteers/${id}`);
};
