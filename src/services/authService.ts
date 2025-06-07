import apiClient from "./api";
import {
  API_ENDPOINTS,
  setStoredToken,
  setStoredUserData,
  removeStoredToken,
  getStoredUserData,
} from "../config/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role: string;
    profile?: {
      id: string;
      bio?: string;
      location?: string;
      website?: string;
      experienceLevel: string;
      totalScore: number;
      totalQuizzes: number;
      averageScore: number;
      streakCount: number;
      lastQuizDate?: string;
      preferences?: any;
    };
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
  profile?: {
    id: string;
    bio?: string;
    location?: string;
    website?: string;
    experienceLevel: string;
    totalScore: number;
    totalQuizzes: number;
    averageScore: number;
    streakCount: number;
    lastQuizDate?: string;
    preferences?: any;
  };
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    // Store token and user data
    await setStoredToken(response.access_token);
    await setStoredUserData(response.user);

    return response;
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
    );

    // Store token and user data
    await setStoredToken(response.access_token);
    await setStoredUserData(response.user);

    return response;
  }

  // Refresh access token
  async refreshToken(): Promise<{ access_token: string }> {
    const response = await apiClient.post<{ access_token: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
    );

    // Store new token
    await setStoredToken(response.access_token);

    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Clear stored data
      await removeStoredToken();
      await setStoredUserData(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  // Get current user from storage
  async getCurrentUser(): Promise<User | null> {
    return getStoredUserData();
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    );
  }

  // Reset password
  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password },
    );
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // Validate token by making a test request
  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
