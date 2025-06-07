import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  Chip,
  Button,
  Avatar,
  ProgressBar,
  Switch,
  Divider,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
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

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("achievements");

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [parallaxAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animations - simplified for web compatibility
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations - simplified
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
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

  const user = {
    name: "Ethan Carter",
    email: "ethan.carter@example.com",
    level: "Intermediate",
    joinDate: "Ocak 2024",
    coursesCompleted: 12,
    exercisesSolved: 247,
    totalPoints: 2456,
    currentStreak: 15,
    rank: 1834,
    avatar: "https://i.pravatar.cc/150?img=5",
  };

  const achievements = [
    {
      id: 1,
      title: t("profile.achievements.cppMaster", "C++ Master"),
      description: t(
        "profile.achievements.cppMasterDesc",
        "Completed all C++ courses",
      ),
      icon: "code-slash",
      color: "#3b82f6",
      earned: true,
      date: "2024",
      progress: 100,
    },
    {
      id: 2,
      title: t("profile.achievements.algorithmExpert", "Algorithm Expert"),
      description: t(
        "profile.achievements.algorithmExpertDesc",
        "Solved 100+ algorithm challenges",
      ),
      icon: "bulb",
      color: "#8b5cf6",
      earned: true,
      date: "2024",
      progress: 100,
    },
    {
      id: 3,
      title: t("profile.achievements.codeReviewer", "Code Reviewer"),
      description: t(
        "profile.achievements.codeReviewerDesc",
        "Reviewed 50+ code submissions",
      ),
      icon: "checkmark-circle",
      color: "#10b981",
      earned: true,
      date: "2024",
      progress: 100,
    },
    {
      id: 4,
      title: t("profile.achievements.streakMaster", "Streak Master"),
      description: t(
        "profile.achievements.streakMasterDesc",
        "15 day learning streak",
      ),
      icon: "flame",
      color: "#f59e0b",
      earned: true,
      date: "2024",
      progress: 100,
    },
    {
      id: 5,
      title: t("profile.achievements.mentor", "Mentor"),
      description: t("profile.achievements.mentorDesc", "Helped 25+ students"),
      icon: "people",
      color: "#ef4444",
      earned: false,
      date: "2024",
      progress: 75,
    },
    {
      id: 6,
      title: t("profile.achievements.debugger", "Debug Master"),
      description: t(
        "profile.achievements.debuggerDesc",
        "Fixed 50+ code bugs",
      ),
      icon: "bug",
      color: "#3b82f6",
      earned: false,
      date: "2024",
      progress: 45,
    },
  ];

  const activities = [
    {
      id: 1,
      type: "course_completed",
      title: t("profile.activity.courseCompleted", "Course completed"),
      description: "Advanced C++ Programming",
      time: "2 saat önce",
      icon: "book",
      color: "#10b981",
    },
    {
      id: 2,
      type: "exercise_solved",
      title: t("profile.activity.exerciseSolved", "Exercise solved"),
      description: "Binary Tree Traversal",
      time: "5 saat önce",
      icon: "code-slash",
      color: "#3b82f6",
    },
    {
      id: 3,
      type: "achievement_earned",
      title: t("profile.activity.achievementEarned", "Achievement earned"),
      description: "Streak Master",
      time: "1 gün önce",
      icon: "trophy",
      color: "#f59e0b",
    },
  ];

  const handleTabPress = (tabId: string) => {
    // Animate tab change
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(tabId);
  };

  const AnimatedAchievementCard = ({ achievement, index }) => {
    const [cardScale] = useState(new Animated.Value(1));
    const [cardRotate] = useState(new Animated.Value(0));

    const handlePress = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(cardScale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(cardRotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(cardScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(cardRotate, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    const rotateInterpolate = cardRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "5deg"],
    });

    return (
      <Animated.View
        style={[
          {
            transform: [{ scale: cardScale }, { rotate: rotateInterpolate }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.achievementCard,
            {
              backgroundColor: colors.card,
              shadowColor: achievement.color,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: achievement.earned ? 0.3 : 0.1,
              shadowRadius: 16,
              elevation: achievement.earned ? 8 : 4,
            },
            !achievement.earned && styles.achievementLocked,
          ]}
        >
          <LinearGradient
            colors={
              achievement.earned
                ? [`${achievement.color}20`, `${achievement.color}10`]
                : [`${colors.border}20`, `${colors.border}10`]
            }
            style={styles.achievementGradient}
          >
            <View style={styles.achievementContent}>
              <Animated.View
                style={[
                  styles.achievementIcon,
                  {
                    backgroundColor: achievement.earned
                      ? achievement.color
                      : colors.border,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Ionicons
                  name={achievement.icon as any}
                  size={28}
                  color={achievement.earned ? "white" : colors.textSecondary}
                />
              </Animated.View>

              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                {achievement.title}
              </Text>

              <Text
                style={[
                  styles.achievementDesc,
                  { color: colors.textSecondary },
                ]}
              >
                {achievement.description}
              </Text>

              {!achievement.earned && (
                <View style={styles.progressContainer}>
                  <ProgressBar
                    progress={achievement.progress / 100}
                    color={achievement.color}
                    style={styles.achievementProgress}
                  />
                  <Text
                    style={[
                      styles.progressText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    %{achievement.progress}
                  </Text>
                </View>
              )}

              {achievement.earned && (
                <Chip
                  mode="filled"
                  style={[
                    styles.earnedChip,
                    { backgroundColor: achievement.color },
                  ]}
                  textStyle={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "600",
                  }}
                >
                  ✨ {achievement.date}
                </Chip>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAchievements = () => (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.achievementsGrid}>
        {achievements.map((achievement, index) => (
          <AnimatedAchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
          />
        ))}
      </View>
    </Animated.View>
  );

  const renderActivity = () => (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {activities.map((activity, index) => (
        <Animated.View
          key={activity.id}
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={[styles.activityCard, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={[`${activity.color}15`, `${activity.color}05`]}
              style={styles.activityGradient}
            >
              <View style={styles.activityContent}>
                <Animated.View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor: activity.color,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Ionicons
                    name={activity.icon as any}
                    size={20}
                    color="white"
                  />
                </Animated.View>
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {activity.title}
                  </Text>
                  <Text
                    style={[
                      styles.activityDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {activity.description}
                  </Text>
                  <Text
                    style={[
                      styles.activityTime,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {activity.time}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderSettings = () => (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={[`${colors.primary}10`, `${colors.secondary}05`]}
          style={styles.settingsGradient}
        >
          <View style={styles.settingsContent}>
            <Text style={[styles.settingsSection, { color: colors.text }]}>
              {t("profile.settings.appearance", "Görünüm")} ✨
            </Text>

            <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
              <View style={styles.settingInfo}>
                <Animated.View
                  style={[
                    styles.settingIconContainer,
                    {
                      transform: [
                        {
                          rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons
                    name={isDarkMode ? "moon" : "sunny"}
                    size={20}
                    color={colors.text}
                  />
                </Animated.View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t("profile.settings.darkMode", "Koyu Mod")}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={colors.primary}
              />
            </TouchableOpacity>

            <Divider
              style={{ backgroundColor: colors.border, marginVertical: 15 }}
            />

            <Text style={[styles.settingsSection, { color: colors.text }]}>
              {t("profile.settings.language", "Dil")} 🌍
            </Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="language" size={20} color={colors.text} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t("profile.settings.appLanguage", "Uygulama Dili")}
                </Text>
              </View>
              <LanguageSwitch variant="button" showLabel={true} />
            </View>

            <Divider
              style={{ backgroundColor: colors.border, marginVertical: 15 }}
            />

            <Text style={[styles.settingsSection, { color: colors.text }]}>
              {t("profile.settings.notifications", "Bildirimler")} 🔔
            </Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Ionicons
                    name="notifications"
                    size={20}
                    color={colors.text}
                  />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t("profile.settings.pushNotifications", "Push Bildirimleri")}
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                color={colors.primary}
              />
            </View>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "achievements":
        return renderAchievements();
      case "activity":
        return renderActivity();
      case "settings":
        return renderSettings();
      default:
        return renderAchievements();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Background */}
      <Animated.View
        style={[
          styles.backgroundContainer,
          {
            transform: [
              {
                rotate: rotateAnim.interpolate({
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Glassmorphism */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary, `${colors.primary}80`]}
            style={styles.header}
          >
            <View style={styles.profileSection}>
              <Animated.View
                style={[
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Avatar.Image
                  size={90}
                  source={{ uri: user.avatar }}
                  style={[
                    styles.avatar,
                    {
                      borderWidth: 4,
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.3,
                      shadowRadius: 20,
                      elevation: 10,
                    },
                  ]}
                />
              </Animated.View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Chip
                  mode="outlined"
                  style={styles.levelChip}
                  textStyle={styles.levelText}
                >
                  ✨ {t(`userLevels.${user.level.toLowerCase()}`, user.level)}
                </Chip>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats with enhanced animations */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsGrid}>
            {[
              {
                label: t("profile.coursesCompleted"),
                value: user.coursesCompleted,
                color: colors.primary,
                icon: "book",
              },
              {
                label: t("profile.exercisesSolved"),
                value: user.exercisesSolved,
                color: colors.secondary,
                icon: "code-slash",
              },
              {
                label: t("profile.totalPoints"),
                value: user.totalPoints,
                color: colors.success,
                icon: "trophy",
              },
              {
                label: t("profile.rank"),
                value: `#${user.rank}`,
                color: colors.warning,
                icon: "star",
              },
            ].map((stat, index) => (
              <Animated.View
                key={index}
                style={[
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Card
                  style={[styles.statCard, { backgroundColor: colors.card }]}
                >
                  <LinearGradient
                    colors={[`${stat.color}15`, `${stat.color}05`]}
                    style={styles.statGradient}
                  >
                    <View style={styles.statContent}>
                      <Animated.View
                        style={[
                          styles.statIcon,
                          {
                            backgroundColor: stat.color,
                            transform: [{ scale: pulseAnim }],
                          },
                        ]}
                      >
                        <Ionicons
                          name={stat.icon as any}
                          size={20}
                          color="white"
                        />
                      </Animated.View>
                      <Text style={[styles.statValue, { color: stat.color }]}>
                        {stat.value}
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {stat.label}
                      </Text>
                    </View>
                  </LinearGradient>
                </Card>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Enhanced Tabs */}
        <Animated.View
          style={[
            styles.tabsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollView}
          >
            {[
              {
                id: "achievements",
                label: t("profile.achievements"),
                icon: "trophy",
              },
              { id: "activity", label: t("profile.activity"), icon: "time" },
              {
                id: "settings",
                label: t("profile.settings.title", "Ayarlar"),
                icon: "settings",
              },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      activeTab === tab.id
                        ? `${colors.primary}20`
                        : "transparent",
                    borderBottomColor: colors.border,
                  },
                  activeTab === tab.id && [
                    styles.activeTab,
                    { borderBottomColor: colors.primary },
                  ],
                ]}
                onPress={() => handleTabPress(tab.id)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={
                    activeTab === tab.id ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color:
                        activeTab === tab.id
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
                {activeTab === tab.id && (
                  <Animated.View
                    style={[
                      styles.tabIndicator,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Tab Content */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {renderTabContent()}
        </Animated.View>
      </ScrollView>
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
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -100,
  },
  backgroundShape2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 100,
    left: -50,
  },
  backgroundShape3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: height * 0.4,
    right: -30,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  levelChip: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  levelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    padding: 20,
    marginTop: -20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  statGradient: {
    padding: 20,
  },
  statContent: {
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabsScrollView: {
    flexDirection: "row",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 15,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    borderRadius: 25,
    position: "relative",
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -3,
    left: 20,
    right: 20,
    height: 3,
    borderRadius: 2,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  achievementCard: {
    width: (width - 56) / 2,
    borderRadius: 20,
    overflow: "hidden",
  },
  achievementGradient: {
    padding: 20,
  },
  achievementLocked: {
    opacity: 0.7,
  },
  achievementContent: {
    alignItems: "center",
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  achievementDesc: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 16,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 8,
  },
  achievementProgress: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 10,
    textAlign: "right",
  },
  earnedChip: {
    paddingHorizontal: 8,
  },
  activityCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  activityGradient: {
    padding: 16,
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  settingsCard: {
    borderRadius: 20,
    elevation: 4,
    overflow: "hidden",
  },
  settingsGradient: {
    padding: 20,
  },
  settingsContent: {
    paddingVertical: 10,
  },
  settingsSection: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});

export default ProfileScreen;
