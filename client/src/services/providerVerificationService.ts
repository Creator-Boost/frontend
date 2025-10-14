import axios from "axios";

const API_URL = "http://localhost:8081"; // backend URL

export type VerificationRequest = {
  userId: string;
  name: string;

};

// ✅ Send provider verification request to backend
export async function requestApproval(data: VerificationRequest) {
    try {
        const response = await axios.post(`${API_URL}/provider/request-approval`, data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with a status other than 2xx
                throw new Error(error.response.data?.message || "Request failed with status " + error.response.status);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error("No response received from server.");
            } else {
                // Something else happened
                throw new Error(error.message || "An unknown error occurred.");
            }
        } else if (error instanceof Error) {
            throw new Error(error.message || "An unknown error occurred.");
        } else {
            throw new Error("An unknown error occurred.");
        }
    }
}
