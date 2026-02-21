import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

const { width, height } = Dimensions.get("window");

const colors = {
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
};

const SplashScreen = () => {
  const navigation = useNavigation();

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(50)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const backgroundPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Background pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundPulse, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Main sequence
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),

      // Title fade in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      // Subtitle slide up
      Animated.parallel([
        Animated.timing(subtitleSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotsOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Navigate to main app after animations
      setTimeout(() => {
        navigation.replace("Login" as any);
      }, 1500);
    });
  };

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Animated Background */}
      <LinearGradient
        colors={[colors.background, colors.surface, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background shapes */}
      <Animated.View
        style={[
          styles.backgroundShape1,
          {
            transform: [{ scale: backgroundPulse }],
          },
        ]}
      />
      <View style={styles.backgroundShape2} />
      <View style={styles.backgroundShape3} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }, { rotate: rotateInterpolate }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.logoGradient}
          >
            <Ionicons
              name="code-slash"
              size={isTablet() ? 60 : 50}
              color="white"
            />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
            },
          ]}
        >
          CodeMentor AI
        </Animated.Text>

        {/* Subtitle */}
        <Animated.View
          style={[
            {
              opacity: titleOpacity,
              transform: [{ translateY: subtitleSlide }],
            },
          ]}
        >
          <Text style={styles.subtitle}>C ve C++ Programlamayı Öğrenmenin</Text>
          <Text style={styles.subtitle}>En İyi Yolu</Text>
        </Animated.View>

        {/* Loading dots */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: dotsOpacity,
            },
          ]}
        >
          <LoadingDots />
        </Animated.View>
      </View>

      {/* Bottom Info */}
      <Animated.View
        style={[
          styles.bottomInfo,
          {
            opacity: dotsOpacity,
          },
        ]}
      >
        <Text style={styles.version}>v1.0.0</Text>
        <Text style={styles.copyright}>© 2024 CodeMentor AI</Text>
      </Animated.View>
    </View>
  );
};

const LoadingDots = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dot1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundShape1: {
    position: "absolute",
    width: wp(150),
    height: wp(150),
    borderRadius: wp(75),
    backgroundColor: `${colors.primary}08`,
    top: -wp(25),
    right: -wp(25),
  },
  backgroundShape2: {
    position: "absolute",
    width: wp(100),
    height: wp(100),
    borderRadius: wp(50),
    backgroundColor: `${colors.secondary}06`,
    bottom: hp(20),
    left: -wp(25),
  },
  backgroundShape3: {
    position: "absolute",
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
    backgroundColor: `${colors.success}04`,
    top: hp(60),
    left: wp(70),
  },
  content: {
    flex: 1,
    ...commonStyles.center,
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoGradient: {
    width: isTablet() ? wp(25) : wp(30),
    height: isTablet() ? wp(25) : wp(30),
    borderRadius: isTablet() ? wp(12.5) : wp(15),
    ...commonStyles.center,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: isTablet() ? typography.h1 * 1.5 : typography.h1 * 1.2,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: isTablet() ? typography.h5 * 1.4 : typography.h6 * 1.4,
  },
  loadingContainer: {
    marginTop: spacing.xxl,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  bottomInfo: {
    position: "absolute",
    bottom: spacing.xl,
    alignSelf: "center",
    alignItems: "center",
  },
  version: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  copyright: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
});

export default SplashScreen;
