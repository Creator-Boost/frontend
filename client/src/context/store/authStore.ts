import { create } from "zustand";
import axios, { AxiosError } from "axios";

const API_URL ="http://localhost:8081/api/v1";


axios.defaults.withCredentials = true;

// Interfaces
interface User {
	
	email: string;
	name: string;
	userId : string;
	role : string;

}

interface ProfileResponse {
	email: string;
	name: string;
	role: string;
	accountVerified: boolean;
	userId: string;

}

interface AuthResponse {
	email: string;
	jwt: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	error: string | null;
	isLoading: boolean;
	isCheckingAuth: boolean;
	message: string | null;
	

	register: (email: string, password: string, name: string, role: string) => Promise<void>;
	login: (email: string, password: string) => Promise<ProfileResponse>;
	logout: () => Promise<void>;
	sendVerifyOtp: () => Promise<void>;
	verifyOtp: (otp: string) => Promise<ProfileResponse>;
	checkAuth: () => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	resetPassword: (resetOtp: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	isVerified: false,

	register: async (email, password, name, role) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post<ProfileResponse>(`${API_URL}/register`, {
				email,
				password,
				name,
				role
			});
			set({ 
				user: { email: response.data.email, name: response.data.name, userId: response.data.userId, role: response.data.role }, 
				isAuthenticated: false, 
				isLoading: false,
				message: "Registration successful! Please verify your email."
			});
		} catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
			set({
				error: axiosError.response?.data?.message || "Error signing up",
				isLoading: false,
			});
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			await axios.post<AuthResponse>(`${API_URL}/login`, {
				email,
				password,
			});

			// After successful login, get the user profile
			const profileResponse = await axios.get<ProfileResponse>(`${API_URL}/profile`);

			set({
				isAuthenticated: true,
				user: { email: profileResponse.data.email, name: profileResponse.data.name, userId: profileResponse.data.userId, role: profileResponse.data.role },
				error: null,
				isLoading: false,
				
			});
			return profileResponse.data;
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
                
				error: error.response?.data?.message || "Error logging in",
				isLoading: false,
			});
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	sendVerifyOtp: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/send-otp`);
			set({ 
				isLoading: false,
				message: "OTP sent to your email"
			});
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
				error: error.response?.data?.message || "Error sending OTP",
				isLoading: false,
			});
			throw error;
		}
	},

	verifyOtp: async (otp: string) => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/verify-otp`, { otp });
			set({ 
				isLoading: false,
				message: "Email verified successfully"
			});
			const profileResponse = await axios.get<ProfileResponse>(`${API_URL}/profile`);

			set({
				isAuthenticated: true,
				user: { email: profileResponse.data.email, name: profileResponse.data.name, userId: profileResponse.data.userId, role: profileResponse.data.role },
				error: null,
				isLoading: false,
				
			});
			return profileResponse.data;
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
				error: error.response?.data?.message || "Invalid OTP",
				isLoading: false,
			});
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get<boolean>(`${API_URL}/is-authenticated`);
			
			if (response.data) {
				// If authenticated, get the user profile
				const profileResponse = await axios.get<ProfileResponse>(`${API_URL}/profile`);
				set({
					user: { email: profileResponse.data.email, name: profileResponse.data.name, userId: profileResponse.data.userId, role: profileResponse.data.role },
					isAuthenticated: true,
					isCheckingAuth: false,
				});
			} else {
				set({ 
					user: null,
					isAuthenticated: false,
					isCheckingAuth: false 
				});
			}
		} catch {
			set({ 
				error: null, 
				isCheckingAuth: false, 
				isAuthenticated: false,
				user: null
			});
		}
	},

	getProfile: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get<ProfileResponse>(`${API_URL}/profile`);
			set({
				user: { email: response.data.email, name: response.data.name, userId: response.data.userId, role: response.data.role },
				isLoading: false,
			});
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
				error: error.response?.data?.message || "Error fetching profile",
				isLoading: false,
			});
			throw error;
		}
	},

	forgotPassword: async (email: string) => {
		set({ isLoading: true, error: null });
		try {
			// Note: Your backend endpoint expects email as a query parameter
			await axios.post(`${API_URL}/send-reset-otp?email=${encodeURIComponent(email)}`);
			set({ 
				message: "Reset OTP sent to your email",
				isLoading: false 
			});
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error sending reset OTP",
			});
			throw error;
		}
	},

	resetPassword: async ( resetOtp: string, newPassword: string) => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/reset-password`, {
				resetOtp,
				newPassword,
			});
			set({ 
				message: "Password reset successful",
				isLoading: false 
			});
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error resetting password",
			});
			throw error;
		}
	}
}));
