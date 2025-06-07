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

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode, colors } = useTheme();
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

    // Logo pulse animation
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

    // Logo rotation
    const rotateAnimation = Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
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

      setIsLoading(true);
      // Simulate registration
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          t("common.success", "Başarılı"),
          t("login.registrationSuccess", "Hesabınız başarıyla oluşturuldu!"),
          [{ text: t("common.ok"), onPress: () => setIsLogin(true) }],
        );
      }, 2000);
    }
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword("demo123");

    // Quick animation
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderFormField = (
    placeholder: string,
    value: string,
    setValue: (text: string) => void,
    secureTextEntry: boolean = false,
    icon: string = "mail",
  ) => (
    <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
      <Ionicons name={icon as any} size={20} color={colors.textSecondary} />
      <TextInput
        style={[styles.textInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry && !showPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Background Shapes */}
      <Animated.View
        style={[
          styles.backgroundContainer,
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
      >
        <View
          style={[
            styles.backgroundShape1,
            { backgroundColor: `${colors.primary}10` },
          ]}
        />
        <View
          style={[
            styles.backgroundShape2,
            { backgroundColor: `${colors.secondary}08` },
          ]}
        />
        <View
          style={[
            styles.backgroundShape3,
            { backgroundColor: `${colors.success}06` },
          ]}
        />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            <View style={styles.headerTop}>
              <LanguageSwitch variant="button" style={styles.languageSwitch} />
            </View>

            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.logoGradient}
              >
                <Ionicons
                  name="code-slash"
                  size={isMobile ? 32 : 40}
                  color="white"
                />
              </LinearGradient>
            </Animated.View>

            <Text style={[styles.appTitle, { color: colors.text }]}>
              CodeMentor AI
            </Text>
            <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
              {t("login.subtitle", "C/C++ öğrenmenin en akıllı yolu")}
            </Text>
          </Animated.View>

          {/* Demo Users */}
          <Animated.View
            style={[
              styles.demoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.demoTitle, { color: colors.text }]}>
              ⚡ {t("login.demoUsers")} - {t("login.quickLogin")}
            </Text>
            <View style={styles.demoUsersContainer}>
              {demoUsers.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.demoUserCard,
                    { backgroundColor: colors.card },
                  ]}
                  onPress={() => handleQuickLogin(user)}
                >
                  <LinearGradient
                    colors={[`${user.color}20`, `${user.color}10`]}
                    style={styles.demoUserGradient}
                  >
                    <Text style={styles.demoUserAvatar}>{user.avatar}</Text>
                    <Text style={[styles.demoUserName, { color: colors.text }]}>
                      {user.name}
                    </Text>
                    <Chip
                      mode="outlined"
                      style={[
                        styles.demoUserLevel,
                        { borderColor: user.color },
                      ]}
                      textStyle={[
                        styles.demoUserLevelText,
                        { color: user.color },
                      ]}
                    >
                      {t(`userLevels.${user.level.toLowerCase()}`, user.level)}
                    </Chip>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Main Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <Card style={[styles.formCard, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={[`${colors.primary}05`, `${colors.secondary}03`]}
                style={styles.formGradient}
              >
                {/* Tabs */}
                <View style={styles.tabsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      {
                        backgroundColor: isLogin
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                    onPress={() => setIsLogin(true)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: isLogin ? "white" : colors.textSecondary },
                      ]}
                    >
                      {t("login.title")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      {
                        backgroundColor: !isLogin
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                    onPress={() => setIsLogin(false)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: !isLogin ? "white" : colors.textSecondary },
                      ]}
                    >
                      {t("login.register")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formFields}>
                  {!isLogin && (
                    <>
                      <View style={styles.nameRow}>
                        {renderFormField(
                          t("login.firstName", "Ad"),
                          firstName,
                          setFirstName,
                          false,
                          "person",
                        )}
                        {renderFormField(
                          t("login.lastName", "Soyad"),
                          lastName,
                          setLastName,
                          false,
                          "person",
                        )}
                      </View>
                    </>
                  )}

                  {renderFormField(
                    t("login.email"),
                    email,
                    setEmail,
                    false,
                    "mail",
                  )}

                  {renderFormField(
                    t("login.password"),
                    password,
                    setPassword,
                    true,
                    "lock-closed",
                  )}

                  {!isLogin && (
                    <>
                      {renderFormField(
                        t("login.confirmPassword"),
                        confirmPassword,
                        setConfirmPassword,
                        true,
                        "lock-closed",
                      )}
                    </>
                  )}

                  {/* Options */}
                  <View style={styles.optionsContainer}>
                    {isLogin ? (
                      <View style={styles.loginOptions}>
                        <View style={styles.checkboxContainer}>
                          <Checkbox
                            status={rememberMe ? "checked" : "unchecked"}
                            onPress={() => setRememberMe(!rememberMe)}
                            color={colors.primary}
                          />
                          <Text
                            style={[
                              styles.checkboxLabel,
                              { color: colors.text },
                            ]}
                          >
                            {t("login.rememberMe", "Beni hatırla")}
                          </Text>
                        </View>
                        <TouchableOpacity>
                          <Text
                            style={[
                              styles.forgotPassword,
                              { color: colors.primary },
                            ]}
                          >
                            {t("login.forgotPassword")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          status={acceptTerms ? "checked" : "unchecked"}
                          onPress={() => setAcceptTerms(!acceptTerms)}
                          color={colors.primary}
                        />
                        <Text
                          style={[styles.checkboxLabel, { color: colors.text }]}
                        >
                          {t(
                            "login.acceptTermsText",
                            "Kullanım şartlarını kabul ediyorum",
                          )}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { opacity: isLoading ? 0.7 : 1 },
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.secondary]}
                      style={styles.submitGradient}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View
                            style={[
                              styles.loadingSpinner,
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
                          >
                            <Ionicons name="refresh" size={20} color="white" />
                          </Animated.View>
                          <Text style={styles.loadingText}>
                            {t("common.loading")}...
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Ionicons
                            name={isLogin ? "log-in" : "person-add"}
                            size={20}
                            color="white"
                          />
                          <Text style={styles.submitText}>
                            {isLogin
                              ? t("login.loginButton")
                              : t("login.registerButton")}
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Social Login */}
                  <View style={styles.socialContainer}>
                    <View style={styles.dividerContainer}>
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                      <Text
                        style={[
                          styles.dividerText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {t("login.orContinueWith")}
                      </Text>
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    </View>

                    <View style={styles.socialButtons}>
                      <TouchableOpacity
                        style={[
                          styles.socialButton,
                          { backgroundColor: colors.card },
                        ]}
                      >
                        <Ionicons
                          name="logo-github"
                          size={24}
                          color={colors.text}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.socialButton,
                          { backgroundColor: colors.card },
                        ]}
                      >
                        <Ionicons
                          name="logo-google"
                          size={24}
                          color={colors.text}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.socialButton,
                          { backgroundColor: colors.card },
                        ]}
                      >
                        <Ionicons
                          name="logo-apple"
                          size={24}
                          color={colors.text}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Card>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: isTablet ? 400 : 300,
    height: isTablet ? 400 : 300,
    borderRadius: isTablet ? 200 : 150,
    top: -100,
    right: -100,
  },
  backgroundShape2: {
    position: "absolute",
    width: isTablet ? 300 : 200,
    height: isTablet ? 300 : 200,
    borderRadius: isTablet ? 150 : 100,
    bottom: 100,
    left: -50,
  },
  backgroundShape3: {
    position: "absolute",
    width: isTablet ? 200 : 150,
    height: isTablet ? 200 : 150,
    borderRadius: isTablet ? 100 : 75,
    top: height * 0.4,
    right: -30,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: isMobile ? 20 : isTablet ? 60 : 40,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTop: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  languageSwitch: {
    alignSelf: "flex-end",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: isMobile ? 80 : isTablet ? 100 : 90,
    height: isMobile ? 80 : isTablet ? 100 : 90,
    borderRadius: isMobile ? 40 : isTablet ? 50 : 45,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appTitle: {
    fontSize: isMobile ? 28 : isTablet ? 36 : 32,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: isMobile ? 14 : isTablet ? 18 : 16,
    textAlign: "center",
    maxWidth: isTablet ? 600 : 300,
  },
  demoSection: {
    marginBottom: 30,
  },
  demoTitle: {
    fontSize: isMobile ? 16 : isTablet ? 20 : 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  demoUsersContainer: {
    flexDirection: isTablet ? "row" : "column",
    gap: 12,
    justifyContent: "center",
  },
  demoUserCard: {
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
    flex: isTablet ? 1 : undefined,
    maxWidth: isTablet ? undefined : "100%",
  },
  demoUserGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  demoUserAvatar: {
    fontSize: isMobile ? 24 : 28,
    marginBottom: 8,
  },
  demoUserName: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  demoUserLevel: {
    backgroundColor: "transparent",
  },
  demoUserLevelText: {
    fontSize: 10,
    fontWeight: "600",
  },
  formContainer: {
    maxWidth: isTablet ? 500 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  formCard: {
    borderRadius: 24,
    elevation: 8,
    overflow: "hidden",
  },
  formGradient: {
    padding: isMobile ? 24 : isTablet ? 32 : 28,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: "600",
  },
  formFields: {
    gap: 16,
  },
  nameRow: {
    flexDirection: isTablet ? "row" : "column",
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 2,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: isMobile ? 14 : 16,
    paddingVertical: 12,
  },
  optionsContainer: {
    marginTop: 8,
  },
  loginOptions: {
    flexDirection: isTablet ? "row" : "column",
    justifyContent: "space-between",
    alignItems: isTablet ? "center" : "flex-start",
    gap: isTablet ? 0 : 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxLabel: {
    fontSize: isMobile ? 13 : 14,
    flex: 1,
  },
  forgotPassword: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },
  submitGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    color: "white",
    fontSize: isMobile ? 16 : 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingSpinner: {
    // No additional styles needed for rotation
  },
  loadingText: {
    color: "white",
    fontSize: isMobile ? 16 : 18,
    fontWeight: "700",
  },
  socialContainer: {
    marginTop: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

export default LoginScreen;
