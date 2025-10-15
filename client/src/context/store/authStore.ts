import { create } from "zustand";
import axios, { AxiosError } from "axios";

//const API_URL = "http://localhost:8080/api/auth";

 //const API_URL = "https://auth-service-production-8859.up.railway.app";

const API_URL = "http://localhost:8081";

axios.defaults.withCredentials = true;

// Interfaces
interface User {
	
	email: string;
	name: string;
	userId : string;
	role : string;
	imageUrl?: string;
	providerProfile?: ProviderProfile;
  	clientProfile?: ClientProfile;

}

interface ProfileResponse {
	email: string;
	name: string;
	role: string;
	accountVerified: boolean;
	userId: string;
	imageUrl?: string;
	providerProfile?: ProviderProfile;
  	clientProfile?: ClientProfile;

}

interface AuthResponse {
	email: string;
	jwt: string;
}

interface ProviderProfile {
  title: string;
  location: string;
  description: string;
  languages: string[];
  skills: string[];
  certifications: string[];
}

interface ClientProfile {
  location: string;
  preferences: string;
  description: string;
}

interface ProfileNoteResponse {
  note: string;
  fileUrl?: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isVerified: boolean; 
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
	uploadProfileImage: (image: File) => Promise<ProfileResponse>;
	updateProviderProfile: (profileData: ProviderProfile) => Promise<ProfileResponse>;
	updateClientProfile: (profileData: ClientProfile) => Promise<ProfileResponse>;
	getProfile: () => Promise<ProfileResponse>;
	getAllUsers: () => Promise<ProfileResponse[]>;
	getProfileById: (userId: string) => Promise<ProfileResponse>;
	createOrUpdateNote: (providerEmail: string, note: string, file?: File) => Promise<ProfileNoteResponse>;
	getNoteByProvider: (providerEmail: string) => Promise<ProfileNoteResponse>;

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
				user: { email: response.data.email, name: response.data.name, userId: response.data.userId, role: response.data.role, imageUrl: response.data.imageUrl }, 
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
				//user: { email: profileResponse.data.email, name: profileResponse.data.name, userId: profileResponse.data.userId, role: profileResponse.data.role, imageUrl: profileResponse.data.imageUrl },
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
				//user: { email: profileResponse.data.email, name: profileResponse.data.name, userId: profileResponse.data.userId, role: profileResponse.data.role, imageUrl: profileResponse.data.imageUrl },
				error: null,
				isVerified: profileResponse.data.accountVerified,
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
					user: { email: profileResponse.data.email, name: profileResponse.data.name, userId: profileResponse.data.userId, role: profileResponse.data.role , imageUrl: profileResponse.data.imageUrl },
					isAuthenticated: true,
					isVerified: profileResponse.data.accountVerified,
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
			console.log("Profile data:", response.data);
			set({
				user: { 
					email: response.data.email, 
					name: response.data.name, 
					userId: response.data.userId, 
					role: response.data.role, 
					imageUrl: response.data.imageUrl,
					providerProfile: response.data.providerProfile,
					clientProfile: response.data.clientProfile
					},
				isLoading: false,
			});
			return response.data;
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
	},

	uploadProfileImage: async (image: File) => {
		set({ isLoading: true, error: null });
		try {
			const formData = new FormData();
			formData.append("image", image);

			const response = await axios.put<ProfileResponse>(`${API_URL}/profile/image`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			set((state) => ({
				user: state.user
					? {
						...state.user,
						imageUrl: response.data.imageUrl
					}
					: null,
				isLoading: false,
				message: "Profile image uploaded successfully"
			}));

			return response.data;
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			set({
				isLoading: false,
				error: error.response?.data?.message || "Failed to upload profile image"
			});
			throw error;
		}
	},
	
	updateProviderProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<ProfileResponse>(`${API_URL}/provider/profile`, profileData);
      set((state) => ({
        user: state.user ? {
          ...state.user,
          providerProfile: {
            title: profileData.title,
            location: profileData.location,
            description: profileData.description,
            languages: profileData.languages,
            skills: profileData.skills,
            certifications: profileData.certifications
          }
        } : null,
        isLoading: false,
        message: "Provider profile updated successfully"
      }));
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update provider profile"
      });
      throw error;
    }
  },

  updateClientProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<ProfileResponse>(`${API_URL}/client/profile`, profileData);
      set((state) => ({
        user: state.user ? {
          ...state.user,
          clientProfile: {
            location: profileData.location,
            preferences: profileData.preferences,
            description: profileData.description
          }
        } : null,
        isLoading: false,
        message: "Client profile updated successfully"
      }));
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update client profile"
      });
      throw error;
    }
  },

  // Add to your useAuthStore implementation
	getAllUsers: async () => {
	set({ isLoading: true, error: null });
	try {
		const response = await axios.get<ProfileResponse[]>(`${API_URL}/users`);
		set({ isLoading: false });
		return response.data;
	} catch (err: unknown) {
		const error = err as AxiosError<{ message: string }>;
		set({
		error: error.response?.data?.message || "Error fetching users",
		isLoading: false,
		});
		throw error;
	}
	},

	// Add to your useAuthStore implementation
	getProfileById: async (userId: string) => {
	set({ isLoading: true, error: null });
	try {
		const response = await axios.get<ProfileResponse>(`${API_URL}/profile/${userId}`);
		set({ isLoading: false });
		return response.data;
	} catch (err: unknown) {
		const error = err as AxiosError<{ message: string }>;
		set({
		error: error.response?.data?.message || "Error fetching profile",
		isLoading: false,
		});
		throw error;
	}
	},

	createOrUpdateNote: async (providerEmail, note, file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("providerEmail", providerEmail);
      formData.append("note", note);
      if (file) formData.append("file", file);

      const response = await axios.post<ProfileNoteResponse>(
        `${API_URL}/provider/request-note`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      set({ isLoading: false, message: "Note saved successfully" });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Failed to save note",
        isLoading: false,
      });
      throw error;
    }
  },

  getNoteByProvider: async (providerEmail) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<ProfileNoteResponse>(
        `${API_URL}/provider/note`,
        { params: { providerEmail } }
      );
      set({ isLoading: false });
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      set({
        error: error.response?.data?.message || "Failed to fetch note",
        isLoading: false,
      });
      throw error;
    }
  },
}));
