import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Device breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1200,
};

// Check device type
export const isSmallDevice = () => SCREEN_WIDTH < BREAKPOINTS.sm;
export const isMediumDevice = () =>
  SCREEN_WIDTH >= BREAKPOINTS.sm && SCREEN_WIDTH < BREAKPOINTS.md;
export const isLargeDevice = () => SCREEN_WIDTH >= BREAKPOINTS.md;

// Responsive dimensions
export const wp = (percentage: number) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage: number) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Minimal Color Palette
export const COLORS = {
  // Primary colors
  primary: "#2563EB",
  primaryLight: "#3B82F6",
  primaryDark: "#1D4ED8",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Semantic colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#06B6D4",

  // Background colors
  background: "#FFFFFF",
  surface: "#F9FAFB",
  card: "#FFFFFF",

  // Text colors
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Border colors
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Dark mode colors
  dark: {
    background: "#0F172A",
    surface: "#1E293B",
    card: "#334155",
    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    border: "#475569",
  },
};

// Typography scale
export const TYPOGRAPHY = {
  // Font sizes
  xs: isSmallDevice() ? 10 : 12,
  sm: isSmallDevice() ? 12 : 14,
  base: isSmallDevice() ? 14 : 16,
  lg: isSmallDevice() ? 16 : 18,
  xl: isSmallDevice() ? 18 : 20,
  "2xl": isSmallDevice() ? 22 : 24,
  "3xl": isSmallDevice() ? 26 : 30,
  "4xl": isSmallDevice() ? 32 : 36,
  "5xl": isSmallDevice() ? 40 : 48,

  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    "2xl": 36,
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
};

// Spacing scale (4px base)
export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Radius scale
export const RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadow presets
export const SHADOWS = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
};

// Component variants
export const COMPONENTS = {
  button: {
    height: {
      sm: 32,
      base: 40,
      lg: 48,
    },
    padding: {
      sm: SPACING[3],
      base: SPACING[4],
      lg: SPACING[5],
    },
  },
  input: {
    height: {
      sm: 36,
      base: 44,
      lg: 52,
    },
  },
  card: {
    padding: SPACING[4],
    radius: RADIUS.lg,
  },
};

// Layout helpers
export const LAYOUT = {
  headerHeight: isSmallDevice() ? 56 : 64,
  tabBarHeight: isSmallDevice() ? 60 : 70,
  safeAreaTop: 44, // Default, will be overridden by SafeAreaProvider
  containerPadding: SPACING[4],
  sectionSpacing: SPACING[6],
  itemSpacing: SPACING[4],
};

// Animation constants
export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: "ease-in-out",
    easeOut: "ease-out",
    easeIn: "ease-in",
  },
};

// Grid system
export const GRID = {
  columns: 12,
  gutter: SPACING[4],
  margin: SPACING[4],
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  COMPONENTS,
  LAYOUT,
  ANIMATIONS,
  GRID,
  wp,
  hp,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
};
