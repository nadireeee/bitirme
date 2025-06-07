import { Dimensions, PixelRatio, Platform } from "react-native";

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Device types based on width
export const DEVICE_TYPES = {
  SMALL_PHONE: SCREEN_WIDTH < 375,
  PHONE: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768,
  TABLET: SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024,
  LARGE_TABLET: SCREEN_WIDTH >= 1024,
};

// Check device type
export const isSmallPhone = () => DEVICE_TYPES.SMALL_PHONE;
export const isPhone = () => DEVICE_TYPES.PHONE || DEVICE_TYPES.SMALL_PHONE;
export const isTablet = () => DEVICE_TYPES.TABLET || DEVICE_TYPES.LARGE_TABLET;
export const isLargeTablet = () => DEVICE_TYPES.LARGE_TABLET;

// Responsive width and height
export const wp = (percentage: number) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage: number) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font sizes
export const responsiveFontSize = (size: number) => {
  const scale = SCREEN_WIDTH / 375; // Base width (iPhone X)
  const newSize = size * scale;

  if (isSmallPhone()) {
    return Math.max(newSize * 0.9, size * 0.8);
  } else if (isTablet()) {
    return Math.min(newSize * 1.2, size * 1.5);
  }

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing
export const responsiveSpacing = (size: number) => {
  if (isSmallPhone()) {
    return size * 0.8;
  } else if (isTablet()) {
    return size * 1.4;
  }
  return size;
};

// Grid columns based on device type
export const getGridColumns = () => {
  if (isSmallPhone()) return 1;
  if (isPhone()) return 2;
  if (isTablet()) return 3;
  return 4;
};

// Card width for grids
export const getCardWidth = (
  columns: number = getGridColumns(),
  margin: number = 16,
) => {
  const totalMargin = margin * (columns + 1);
  return (SCREEN_WIDTH - totalMargin) / columns;
};

// Touch target sizes
export const getTouchTargetSize = () => {
  const minSize = 44; // iOS minimum
  return isTablet() ? minSize * 1.2 : minSize;
};

// Header heights
export const getHeaderHeight = () => {
  if (isTablet()) return hp(8);
  return hp(10);
};

// Container padding
export const getContainerPadding = () => {
  if (isSmallPhone()) return wp(4);
  if (isPhone()) return wp(5);
  return wp(6);
};

// Responsive typography scale
export const typography = {
  h1: responsiveFontSize(32),
  h2: responsiveFontSize(28),
  h3: responsiveFontSize(24),
  h4: responsiveFontSize(20),
  h5: responsiveFontSize(18),
  h6: responsiveFontSize(16),
  body1: responsiveFontSize(16),
  body2: responsiveFontSize(14),
  caption: responsiveFontSize(12),
  button: responsiveFontSize(14),
};

// Responsive spacing scale
export const spacing = {
  xs: responsiveSpacing(4),
  sm: responsiveSpacing(8),
  md: responsiveSpacing(16),
  lg: responsiveSpacing(24),
  xl: responsiveSpacing(32),
  xxl: responsiveSpacing(48),
};

// Common responsive styles
export const commonStyles = {
  container: {
    flex: 1,
    paddingHorizontal: getContainerPadding(),
  },
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  center: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  spaceBetween: {
    justifyContent: "space-between" as const,
  },
  card: {
    borderRadius: responsiveSpacing(12),
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  button: {
    minHeight: getTouchTargetSize(),
    borderRadius: responsiveSpacing(8),
    paddingHorizontal: spacing.md,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  input: {
    minHeight: getTouchTargetSize(),
    borderRadius: responsiveSpacing(8),
    paddingHorizontal: spacing.md,
    fontSize: typography.body1,
  },
  shadow: {
    ...(Platform.OS === "ios" || Platform.OS === "android"
      ? {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: isTablet() ? 4 : 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: isTablet() ? 6 : 3,
          elevation: isTablet() ? 6 : 3,
        }
      : {
          // Web fallback with box-shadow equivalent
          borderWidth: 0.5,
          borderColor: "rgba(0,0,0,0.1)",
        }),
  },
};

// Responsive layout helpers
export const getLayoutConfig = () => ({
  columns: getGridColumns(),
  cardWidth: getCardWidth(),
  headerHeight: getHeaderHeight(),
  containerPadding: getContainerPadding(),
  touchTargetSize: getTouchTargetSize(),
});

// Orientation helpers
export const isLandscape = () => SCREEN_WIDTH > SCREEN_HEIGHT;
export const isPortrait = () => SCREEN_HEIGHT > SCREEN_WIDTH;

// Update dimensions (call this in component that listens to orientation changes)
export const updateDimensions = () => {
  const { width, height } = Dimensions.get("window");
  return { width, height };
};

export default {
  wp,
  hp,
  responsiveFontSize,
  responsiveSpacing,
  getGridColumns,
  getCardWidth,
  typography,
  spacing,
  commonStyles,
  getLayoutConfig,
  isSmallPhone,
  isPhone,
  isTablet,
  isLargeTablet,
  isLandscape,
  isPortrait,
};
