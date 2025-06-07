import { Dimensions, PixelRatio } from "react-native";
import {
  typography,
  spacing,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base responsive theme
export const responsiveTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#030712",
    surface: "#0f172a",
    surfaceVariant: "#1e293b",
    outline: "#334155",
    onBackground: "#f9fafb",
    onSurface: "#f9fafb",
    textSecondary: "#94a3b8",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    border: "#1e293b",
  },

  // Responsive layout values
  layout: {
    containerPadding: isTablet() ? 32 : isSmallPhone() ? 16 : 20,
    cardPadding: isTablet() ? 24 : 16,
    headerHeight: isTablet() ? 80 : 64,
    tabBarHeight: isTablet() ? 90 : 80,
    buttonHeight: isTablet() ? 56 : 48,
    touchTarget: isTablet() ? 52 : 44,
  },

  // Responsive breakpoints
  breakpoints: {
    xs: 0,
    sm: 375,
    md: 768,
    lg: 1024,
    xl: 1200,
  },

  // Grid system
  grid: {
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    gutters: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
  },

  // Typography scale that adapts to screen size
  typography: {
    ...typography,
    // Override with responsive specific values
    heroTitle: isTablet() ? typography.h1 * 1.4 : typography.h1,
    heroSubtitle: isTablet() ? typography.h4 : typography.h5,
    cardTitle: isTablet() ? typography.h5 : typography.h6,
    cardBody: isTablet() ? typography.body1 : typography.body2,
  },

  // Spacing scale
  spacing: {
    ...spacing,
    // Additional responsive spacings
    component: isTablet() ? 20 : 16,
    section: isTablet() ? 40 : 32,
    page: isTablet() ? 32 : 20,
  },

  // Border radius scale
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },

  // Shadow depths
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
  },

  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Z-index scale
  zIndex: {
    base: 0,
    overlay: 1000,
    modal: 2000,
    toast: 3000,
    tooltip: 4000,
  },
};

// Helper functions for responsive design
export const getResponsiveValue = (values: {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
}) => {
  if (SCREEN_WIDTH >= 1200 && values.xl !== undefined) return values.xl;
  if (SCREEN_WIDTH >= 1024 && values.lg !== undefined) return values.lg;
  if (SCREEN_WIDTH >= 768 && values.md !== undefined) return values.md;
  if (SCREEN_WIDTH >= 375 && values.sm !== undefined) return values.sm;
  return values.xs;
};

export const getGridColumns = () => {
  return getResponsiveValue(responsiveTheme.grid.columns);
};

export const getGutterSize = () => {
  return getResponsiveValue(responsiveTheme.grid.gutters);
};

// Common responsive component styles
export const createResponsiveStyles = (baseStyles: any) => {
  return {
    ...baseStyles,
    // Add responsive utilities
    container: {
      ...baseStyles.container,
      paddingHorizontal: responsiveTheme.layout.containerPadding,
    },
    card: {
      ...baseStyles.card,
      padding: responsiveTheme.layout.cardPadding,
      borderRadius: responsiveTheme.borderRadius.lg,
    },
    button: {
      ...baseStyles.button,
      height: responsiveTheme.layout.buttonHeight,
      borderRadius: responsiveTheme.borderRadius.md,
    },
  };
};

export default responsiveTheme;
