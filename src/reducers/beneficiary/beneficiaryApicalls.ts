import axios from 'axios';

const API_ENDPOINT = ''; // Replace with your actual API endpoint

export const submitBeneficiaryForm = async (formData: any) => { // ✅ Adjust type as needed or use 'any'
    try {
        const response = await axios.post(`${API_ENDPOINT}/beneficiaries`, formData); // ✅  Adjust endpoint if needed
        return response;
    } catch (error) {
        throw error;
    }
};