import axios from "axios";

export const useraxiosInstance=await axios.create({
    baseURL:'http://localhost:5000/api/user',
    timeout:10000,
        headers:{
            "Content-Type":"application/json"
        }    
    })