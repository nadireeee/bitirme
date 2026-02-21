// Universal colors utility with fallbacks for mobile compatibility

export const defaultColors = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  border: "#1e293b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  card: "#0f172a",
  outline: "#334155",
};

export const lightColors = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  card: "#ffffff",
  outline: "#e2e8f0",
};

// Safe colors getter function
export const getColors = (isDarkMode: boolean = true) => {
  return isDarkMode ? defaultColors : lightColors;
};

// Hook replacement for safe colors access
export const useSafeColors = () => {
  try {
    // Try to import and use the theme context
    const { useTheme } = require("../contexts/ThemeContext");
    const theme = useTheme();
    return theme?.colors || defaultColors;
  } catch (error) {
    // Fallback to default colors if context fails
    return defaultColors;
  }
};

export default defaultColors;
