import axios from 'axios';

const USER_API_URL = 'http://localhost:8081/profile';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER';
  imageUrl: string | null;
  providerProfile: any | null;
  clientProfile: any | null;
  createdAt: string;
  accountVerified: boolean;
}

class UserService {
  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await axios.get<UserProfile>(`${USER_API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch user profile';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Get multiple user profiles by user IDs
   */
  async getUserProfiles(userIds: string[]): Promise<UserProfile[]> {
    try {
      const profiles = await Promise.all(
        userIds.map(userId => this.getUserProfile(userId))
      );
      return profiles;
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      throw new Error('Failed to fetch user profiles');
    }
  }

  /**
   * Get user avatar URL with fallback
   */
  getUserAvatarUrl(imageUrl: string | null, userName: string): string {
    if (imageUrl) {
      return imageUrl;
    }
    // Fallback to a default avatar or initial-based avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=128`;
  }

  /**
   * Check if image URL is valid
   */
  isValidImageUrl(url: string | null): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
export const userService = new UserService();

// Export the class as well for dependency injection if needed
export default UserService;