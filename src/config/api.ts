import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000/api" // Development
    : "https://your-production-api.com/api", // Production
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@access_token",
  USER_DATA: "@user_data",
  LANGUAGE: "@language",
  THEME: "@theme",
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Users
  USERS: {
    PROFILE: "/users/profile",
    PROFILE_DETAILS: "/users/profile/details",
    STATS: "/users/stats",
    DEACTIVATE: "/users/account",
  },

  // Quiz
  QUIZ: {
    CATEGORIES: "/quiz/categories",
    CATEGORY_BY_ID: (id: string) => `/quiz/categories/${id}`,
    QUESTIONS: (categoryId: string) =>
      `/quiz/categories/${categoryId}/questions`,
    SUBMIT: "/quiz/submit",
    RESULTS: "/quiz/results",
    RESULT_BY_ID: (id: string) => `/quiz/results/${id}`,
    STATS: "/quiz/stats",
  },

  // Achievements
  ACHIEVEMENTS: {
    ALL: "/achievements",
    USER: "/achievements/user",
    LEADERBOARD: "/achievements/leaderboard",
  },

  // Courses
  COURSES: {
    ALL: "/courses",
    BY_ID: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    USER_ENROLLMENTS: "/courses/user/enrollments",
  },

  // Forum
  FORUM: {
    CATEGORIES: "/forum/categories",
    POSTS: "/forum/posts",
    POST_BY_ID: (id: string) => `/forum/posts/${id}`,
    CREATE_POST: "/forum/posts",
    CREATE_COMMENT: (postId: string) => `/forum/posts/${postId}/comments`,
  },

  // AI Chat
  AI: {
    SESSIONS: "/ai/sessions",
    SESSION_BY_ID: (id: string) => `/ai/sessions/${id}`,
    CREATE_SESSION: "/ai/sessions",
    SEND_MESSAGE: (sessionId: string) => `/ai/sessions/${sessionId}/messages`,
    DELETE_SESSION: (sessionId: string) => `/ai/sessions/${sessionId}`,
  },
};

// Helper functions
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const removeStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const getStoredUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting stored user data:", error);
    return null;
  }
};

export const setStoredUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData),
    );
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};
