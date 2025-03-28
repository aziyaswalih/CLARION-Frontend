import axios from 'axios';

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