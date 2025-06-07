import React from "react";
import { View, ViewStyle } from "react-native";
import { responsiveTheme } from "../../styles/responsiveTheme";
import { isTablet, isSmallPhone } from "../../utils/responsive";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: boolean;
  centerContent?: boolean;
  padding?: keyof typeof responsiveTheme.spacing;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  maxWidth = false,
  centerContent = false,
  padding = "lg",
}) => {
  const containerStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: responsiveTheme.spacing[padding],
    ...(maxWidth && {
      maxWidth: isTablet() ? 1200 : "100%",
      alignSelf: "center",
      width: "100%",
    }),
    ...(centerContent && {
      justifyContent: "center",
      alignItems: "center",
    }),
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
};

export default ResponsiveContainer;
