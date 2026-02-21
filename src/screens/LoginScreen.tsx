import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Card, Chip, Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { authService } from "../services/authService";
import LanguageSwitch from "../components/common/LanguageSwitch";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  getGridColumns,
  getCardWidth,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

// Direct colors object to avoid context issues
const colors = {
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  outline: "#334155",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  border: "#1e293b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  card: "#0f172a",
};

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [logoRotate] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    const rotateAnimation = Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    rotateAnimation.start();
    pulseAnimation.start();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const demoUsers = [
    {
      name: "Ethan Carter",
      email: "ethan.carter@example.com",
      level: "Intermediate",
      avatar: "👨‍💻",
      color: "#3b82f6",
    },
    {
      name: "Demo User",
      email: "demo@example.com",
      level: "Beginner",
      avatar: "👩‍🎓",
      color: "#10b981",
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      level: "Expert",
      avatar: "👨‍🏫",
      color: "#f59e0b",
    },
  ];

  const handleSubmit = async () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert(
          t("common.error"),
          t("login.fillAllFields", "Lütfen tüm alanları doldurun."),
        );
        return;
      }

      setIsLoading(true);
      try {
        const result = await authService.login(email, password);
        if (result.success) {
          // Success animation
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            navigation.navigate("Main");
          });
        } else {
          Alert.alert(
            t("login.loginError", "Giriş Hatası"),
            result.error || t("login.loginFailed", "Giriş yapılamadı."),
          );
        }
      } catch (error) {
        Alert.alert(
          t("common.error"),
          t(
            "login.loginErrorOccurred",
            "Giriş işlemi sırasında bir hata oluştu.",
          ),
        );
      }
      setIsLoading(false);
    } else {
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        Alert.alert(
          t("common.error"),
          t("login.fillAllFields", "Lütfen tüm alanları doldurun."),
        );
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(
          t("common.error"),
          t("login.passwordMismatch", "Şifreler eşleşmiyor."),
        );
        return;
      }
      if (!acceptTerms) {
        Alert.alert(
          t("common.error"),
          t("login.acceptTerms", "Kullanım şartlarını kabul etmelisiniz."),
        );
        return;
      }

      setIsLoading(false);
      Alert.alert(
        t("login.success", "Başarılı"),
        t("login.registrationSuccess", "Kayıt işlemi başarılı!"),
      );
    }
  };

  const handleDemoLogin = (user: any) => {
    setEmail(user.email);
    setPassword("demo123");
    Alert.alert(
      t("login.demoLogin", "Demo Giriş"),
      t("login.demoLoginMessage", `${user.name} olarak giriş yapılıyor...`),
      [
        {
          text: t("common.cancel", "İptal"),
          style: "cancel",
        },
        {
          text: t("common.ok", "Tamam"),
          onPress: () => {
            setTimeout(() => {
              navigation.navigate("Main");
            }, 1000);
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Animated Background */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.backgroundShape1,
            {
              transform: [
                {
                  rotate: logoRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.backgroundShape2} />
        <View style={styles.backgroundShape3} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoGradient,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(59, 130, 246, 0.8)", "rgba(139, 92, 246, 0.8)"]}
                style={styles.logoGradient}
              >
                <Ionicons
                  name="code-slash"
                  size={isSmallPhone() ? 32 : 40}
                  color="white"
                />
              </LinearGradient>
            </Animated.View>
          </View>
          <Text style={styles.title}>{t("login.welcome", "Hoş Geldiniz")}</Text>
          <Text style={styles.subtitle}>
            {t(
              "login.subtitle",
              "CodeMentor AI'ya giriş yapın veya hesap oluşturun",
            )}
          </Text>
        </Animated.View>

        {/* Language Switch */}
        <View style={styles.languageContainer}>
          <LanguageSwitch />
        </View>

        {/* Demo Users */}
        <Animated.View
          style={[
            styles.demoSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.demoTitle}>
            {t("login.quickDemo", "Hızlı Demo Girişi")}
          </Text>
          <View style={styles.demoUsers}>
            {demoUsers.map((user, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.demoUser,
                  { backgroundColor: colors.surface, borderColor: user.color },
                ]}
                onPress={() => handleDemoLogin(user)}
              >
                <Text style={styles.demoAvatar}>{user.avatar}</Text>
                <Text style={[styles.demoName, { color: colors.text }]}>
                  {user.name}
                </Text>
                <Chip
                  mode="outlined"
                  style={[styles.demoLevel, { borderColor: user.color }]}
                  textStyle={[styles.demoLevelText, { color: user.color }]}
                >
                  {user.level}
                </Chip>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Login/Register Form */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.formContent}>
              {/* Tab Switcher */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    isLogin && styles.activeTab,
                    { borderColor: colors.primary },
                  ]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isLogin ? colors.primary : colors.textSecondary,
                      },
                    ]}
                  >
                    {t("login.signIn", "Giriş Yap")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    !isLogin && styles.activeTab,
                    { borderColor: colors.primary },
                  ]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: !isLogin ? colors.primary : colors.textSecondary,
                      },
                    ]}
                  >
                    {t("login.signUp", "Kayıt Ol")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              {!isLogin && (
                <View style={styles.nameRow}>
                  <View style={[styles.nameField, { marginRight: 8 }]}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      {t("login.firstName", "Ad")}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderColor: colors.outline,
                        },
                      ]}
                      placeholder={t("login.firstName", "Ad")}
                      placeholderTextColor={colors.textSecondary}
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={[styles.nameField, { marginLeft: 8 }]}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      {t("login.lastName", "Soyad")}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderColor: colors.outline,
                        },
                      ]}
                      placeholder={t("login.lastName", "Soyad")}
                      placeholderTextColor={colors.textSecondary}
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {t("login.email", "E-posta")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.outline,
                    },
                  ]}
                  placeholder={t("login.emailPlaceholder", "ornek@email.com")}
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {t("login.password", "Şifre")}
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.outline,
                      },
                    ]}
                    placeholder={t("login.passwordPlaceholder", "Şifreniz")}
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {t("login.confirmPassword", "Şifre Tekrar")}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.outline,
                      },
                    ]}
                    placeholder={t(
                      "login.confirmPasswordPlaceholder",
                      "Şifrenizi tekrar girin",
                    )}
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              )}

              {/* Options */}
              <View style={styles.optionsContainer}>
                {isLogin ? (
                  <View style={styles.rememberMe}>
                    <Checkbox
                      status={rememberMe ? "checked" : "unchecked"}
                      onPress={() => setRememberMe(!rememberMe)}
                    />
                    <Text style={[styles.checkboxText, { color: colors.text }]}>
                      {t("login.rememberMe", "Beni hatırla")}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.termsContainer}>
                    <Checkbox
                      status={acceptTerms ? "checked" : "unchecked"}
                      onPress={() => setAcceptTerms(!acceptTerms)}
                    />
                    <Text style={[styles.checkboxText, { color: colors.text }]}>
                      {t(
                        "login.acceptTerms",
                        "Kullanım şartlarını kabul ediyorum",
                      )}
                    </Text>
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.primary },
                ]}
                labelStyle={styles.submitButtonText}
              >
                {isLogin
                  ? t("login.signIn", "Giriş Yap")
                  : t("login.signUp", "Kayıt Ol")}
              </Button>

              {/* Forgot Password */}
              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text
                    style={[
                      styles.forgotPasswordText,
                      { color: colors.primary },
                    ]}
                  >
                    {t("login.forgotPassword", "Şifremi unuttum")}
                  </Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundShape1: {
    position: "absolute",
    width: wp(100),
    height: wp(100),
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderRadius: wp(50),
    top: -wp(25),
    right: -wp(25),
  },
  backgroundShape2: {
    position: "absolute",
    width: wp(80),
    height: wp(80),
    backgroundColor: "rgba(139, 92, 246, 0.03)",
    borderRadius: wp(40),
    bottom: hp(20),
    left: -wp(20),
  },
  backgroundShape3: {
    position: "absolute",
    width: wp(60),
    height: wp(60),
    backgroundColor: "rgba(16, 185, 129, 0.02)",
    borderRadius: wp(30),
    top: hp(60),
    right: -wp(15),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl + 20
        : spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoGradient: {
    width: isSmallPhone() ? wp(20) : isTablet() ? wp(15) : wp(18),
    height: isSmallPhone() ? wp(20) : isTablet() ? wp(15) : wp(18),
    borderRadius: isSmallPhone() ? wp(10) : isTablet() ? wp(7.5) : wp(9),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: isSmallPhone()
      ? typography.h2
      : isTablet()
        ? typography.h1 * 1.2
        : typography.h1,
    fontWeight: "800",
    color: "#f9fafb",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isSmallPhone()
      ? typography.body2
      : isTablet()
        ? typography.h6
        : typography.body1,
    color: "#94a3b8",
    textAlign: "center",
    maxWidth: isTablet() ? wp(60) : wp(80),
  },
  languageContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  demoSection: {
    marginBottom: spacing.xl,
  },
  demoTitle: {
    fontSize: isSmallPhone() ? typography.h4 : typography.h3,
    fontWeight: "700",
    color: "#f9fafb",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  demoUsers: {
    flexDirection: isSmallPhone() ? "column" : "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  demoUser: {
    padding: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xl
        : spacing.lg + 4,
    borderRadius: spacing.md,
    borderWidth: 2,
    alignItems: "center",
    minWidth: isSmallPhone() ? wp(80) : wp(25),
    marginBottom: isSmallPhone() ? spacing.sm : 0,
  },
  demoAvatar: {
    fontSize: isTablet() ? 32 : 24,
    marginBottom: spacing.xs,
  },
  demoName: {
    fontSize: isSmallPhone() ? typography.body2 : typography.body1,
    fontWeight: "600",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  demoLevel: {
    backgroundColor: "transparent",
  },
  demoLevelText: {
    fontSize: isSmallPhone() ? typography.caption : typography.body2,
  },
  formCard: {
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: "#334155",
    maxWidth: isTablet() ? wp(70) : "100%",
    alignSelf: "center",
    width: "100%",
  },
  formContent: {
    padding: isSmallPhone()
      ? spacing.lg
      : isTablet()
        ? spacing.xxl
        : spacing.xl - 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: spacing.xl,
    borderRadius: spacing.sm,
    backgroundColor: "#1e293b",
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: spacing.xs,
  },
  activeTab: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: isSmallPhone() ? typography.body2 : typography.body1,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: isSmallPhone() ? "column" : "row",
    marginBottom: spacing.md,
  },
  nameField: {
    flex: isSmallPhone() ? undefined : 1,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: isSmallPhone() ? typography.body2 : typography.body1,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body1,
  },
  eyeButton: {
    position: "absolute",
    right: spacing.md,
    padding: spacing.xs,
  },
  optionsContainer: {
    marginBottom: spacing.lg,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxText: {
    fontSize: isSmallPhone() ? typography.body2 : typography.body1,
    marginLeft: spacing.xs,
    flex: 1,
  },
  submitButton: {
    borderRadius: spacing.sm,
    paddingVertical: spacing.xs,
  },
  submitButtonText: {
    fontSize: isSmallPhone() ? typography.body1 : typography.h6,
    fontWeight: "700",
    color: "white",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  forgotPasswordText: {
    fontSize: isSmallPhone() ? typography.body2 : typography.body1,
    fontWeight: "600",
  },
});

export default LoginScreen;
