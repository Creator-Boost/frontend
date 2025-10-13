import { create } from "zustand";
import axios, { AxiosError } from "axios";

//const API_URL = "http://localhost:8080/api/auth"; // adjust for API Gateway if needed
const API_URL = "http://localhost:8081";
axios.defaults.withCredentials = true; // send/receive JWT cookies automatically



interface AdminUser {
	
	email: string;
	name: string;
	userId : string;
	role : string;
	imageUrl?: string;
	

}
interface ProfileResponse {
	email: string;
	name: string;
	role: string;
	accountVerified: boolean;
	userId: string;
	imageUrl?: string;
    createdAt: string;
    suspended: boolean;
	

}

interface ProviderProfile {
  userId: string;
  name: string;
  email: string;
  imageUrl?: string;
  isApprovalRequested: boolean;
  isApprovedByAdmin: boolean;
  title?: string;
  location?: string;
  description?: string;
  note?: string;
  fileUrl?: string;
  fileType?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
    getAllUsers: () => Promise<ProfileResponse[]>;
  toggleUserSuspension: (userId: string, suspend: boolean) => Promise<void>;
  getPendingProviders: () => Promise<ProviderProfile[]>;
  approveProvider: (userId: string) => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,

  // 🟢 Login (cookie-based)
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      console.log("Login response:", response.data);

      const { email: userEmail, role, name, userId, imageUrl } = response.data;

      if (role !== "ADMIN") {
        set({ error: "Access denied. Not an admin account.", isLoading: false });
        return;
      }

      set({
        user: { email: userEmail, role, name, userId, imageUrl },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  // 🔴 Logout (if backend supports endpoint)
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch {
      // ignore errors silently
    }
    set({ user: null, isAuthenticated: false });
  },

  // 🟢 Check authentication via cookie
  checkAuth: async () => {
  const currentAuth = useAdminAuthStore.getState().isAuthenticated;
  if (currentAuth) return; // ✅ skip check if already logged in (prevents immediate override)

  try {
    const response = await axios.get(`${API_URL}/is-authenticated`);
    if (response.data === true) {
      const profile = await axios.get(`${API_URL}/profile`);
      if (profile.data.role === "ADMIN") {
        set({
          user: { email: profile.data.email, role: profile.data.role, name: profile.data.name, userId: profile.data.userId, imageUrl: profile.data.imageUrl },
          isAuthenticated: true,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } else {
      set({ user: null, isAuthenticated: false });
    }
  } catch {
    set({ user: null, isAuthenticated: false });
  }
},
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

toggleUserSuspension: async (userId: string, suspend: boolean) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}/${suspend ? "suspend" : "activate"}`,
      {},
      { withCredentials: true }
    );
    console.log("User suspension updated:", response.data);
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    throw new Error(error.response?.data?.message || "Failed to update user status");
  }
},

getPendingProviders: async () => {
    try {
      const res = await axios.get<ProviderProfile[]>(`${API_URL}/providers/pending`);
      console.log("Pending providers:", res.data);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || "Failed to fetch pending providers");
    }
  },

  // ✅ NEW: approve a provider
  approveProvider: async (userId: string) => {
    try {
      const res = await axios.post(`${API_URL}/providers/${userId}/approve`);
      
      console.log(res.data.message);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || "Failed to approve provider");
    }
  },

}));
