import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

interface OrientationData {
  width: number;
  height: number;
  isLandscape: boolean;
  isPortrait: boolean;
  isTablet: boolean;
  isSmallPhone: boolean;
}

export const useOrientation = (): OrientationData => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get("window");
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  return {
    width,
    height,
    isLandscape: width > height,
    isPortrait: height > width,
    isTablet: width >= 768,
    isSmallPhone: width < 375,
  };
};

export default useOrientation;
