import React from "react";
import { Text, TextStyle } from "react-native";
import { responsiveTheme } from "../../styles/responsiveTheme";
import { isTablet, isSmallPhone } from "../../utils/responsive";

interface ResponsiveTextProps {
  children: React.ReactNode;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption"
    | "button";
  style?: TextStyle;
  color?: keyof typeof responsiveTheme.colors;
  numberOfLines?: number;
  center?: boolean;
  bold?: boolean;
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = "body1",
  style,
  color = "onSurface",
  numberOfLines,
  center = false,
  bold = false,
}) => {
  const textStyle: TextStyle = {
    fontSize: responsiveTheme.typography[variant],
    color: responsiveTheme.colors[color],
    ...(center && { textAlign: "center" }),
    ...(bold && { fontWeight: "bold" }),

    // Responsive line height
    lineHeight:
      responsiveTheme.typography[variant] *
      (variant.startsWith("h") ? 1.2 : 1.5),

    // Responsive letter spacing for tablets
    ...(isTablet() && {
      letterSpacing: variant.startsWith("h") ? 0.5 : 0.2,
    }),

    ...style,
  };

  return (
    <Text style={textStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

export default ResponsiveText;
