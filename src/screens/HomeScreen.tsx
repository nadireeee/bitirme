import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button, Avatar, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
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
  }, []);

  const quickActions = [
    {
      title: t("navigation.courses", "Kurslar"),
      description: "C ve C++ kurslarını keşfet",
      icon: "book",
      color: colors.primary,
      route: "Courses",
    },
    {
      title: t("navigation.exercises", "Alıştırmalar"),
      description: "Kod pratiği yap",
      icon: "code-slash",
      color: colors.secondary,
      route: "Exercises",
    },
    {
      title: t("navigation.forum", "Forum"),
      description: "Topluluğa katıl",
      icon: "chatbubbles",
      color: colors.success,
      route: "Forum",
    },
    {
      title: t("navigation.aiChat", "AI Mentor"),
      description: "AI ile öğren",
      icon: "chatbubble-ellipses",
      color: colors.warning,
      route: "AIChat",
    },
  ];

  const stats = [
    {
      label: "Aktif Kullanıcı",
      value: "12K+",
      icon: "people",
      color: colors.primary,
    },
    {
      label: "Kurs Sayısı",
      value: "25+",
      icon: "book",
      color: colors.secondary,
    },
    {
      label: "Alıştırma",
      value: "500+",
      icon: "code-slash",
      color: colors.success,
    },
    {
      label: "Başarı Oranı",
      value: "%95",
      icon: "trophy",
      color: colors.warning,
    },
  ];

  const popularCourses = [
    {
      id: 1,
      title: "C Programlama Temelleri",
      level: "Başlangıç",
      students: 1247,
      rating: 4.8,
      color: colors.success,
      progress: 0,
    },
    {
      id: 2,
      title: "C++ OOP",
      level: "Orta",
      students: 892,
      rating: 4.9,
      color: colors.primary,
      progress: 65,
    },
  ];

  const renderQuickAction = (action: any, index: number) => (
    <Animated.View
      key={index}
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.actionCard, { borderLeftColor: action.color }]}
        onPress={() => navigation.navigate(action.route as any)}
      >
        <View style={styles.actionContent}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: `${action.color}20` },
            ]}
          >
            <Ionicons
              name={action.icon as any}
              size={24}
              color={action.color}
            />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStat = (stat: any, index: number) => (
    <Animated.View
      key={index}
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
        <Ionicons name={stat.icon as any} size={20} color={stat.color} />
      </View>
      <Text style={[styles.statValue, { color: stat.color }]}>
        {stat.value}
      </Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Animated.View>
  );

  const renderCourseCard = (course: any, index: number) => (
    <Animated.View
      key={course.id}
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CourseDetail", { courseId: course.id })
        }
      >
        <Card style={styles.courseCard}>
          <LinearGradient
            colors={[`${course.color}20`, `${course.color}10`]}
            style={styles.courseGradient}
          >
            <View style={styles.courseContent}>
              <View style={styles.courseHeader}>
                <Chip
                  mode="outlined"
                  style={[styles.levelChip, { borderColor: course.color }]}
                  textStyle={[styles.levelText, { color: course.color }]}
                >
                  {course.level}
                </Chip>
                <View style={styles.courseRating}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={styles.ratingText}>{course.rating}</Text>
                </View>
              </View>

              <Text style={styles.courseTitle}>{course.title}</Text>

              <View style={styles.courseStats}>
                <View style={styles.courseStat}>
                  <Ionicons
                    name="people"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.courseStatText}>{course.students}</Text>
                </View>
              </View>

              {course.progress > 0 && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    İlerleme: %{course.progress}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${course.progress}%`,
                          backgroundColor: course.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Merhaba! 👋</Text>
              <Text style={styles.headerTitle}>CodeMentor AI</Text>
            </View>
            <View style={styles.headerActions}>
              <LanguageSwitch />
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topluluk İstatistikleri</Text>
          <View style={styles.statsGrid}>{stats.map(renderStat)}</View>
        </View>

        {/* Popular Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popüler Kurslar</Text>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: "#8b5cf6" }]}
              onPress={() => navigation.navigate("Main", { screen: "Forum" })}
            >
              <Ionicons name="chatbubbles" size={wp(6)} color="#fff" />
              <Text style={styles.quickActionText}>Forum</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: "#f59e0b" }]}
              onPress={() => navigation.navigate("Quiz")}
            >
              <Ionicons name="help-circle" size={wp(6)} color="#fff" />
              <Text style={styles.quickActionText}>Sınavlar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesScrollContent}
          >
            {popularCourses.map(renderCourseCard)}
          </ScrollView>
        </View>

        {/* CTA Section */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Card style={styles.ctaCard}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Öğrenmeye Başla!</Text>
                <Text style={styles.ctaDescription}>
                  C ve C++ programlama dünyasına adım at
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => navigation.navigate("Courses" as any)}
                >
                  <Text style={styles.ctaButtonText}>Kurslara Göz At</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: isTablet() ? spacing.xl : spacing.xxl + 20,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  headerTitle: {
    fontSize: isTablet() ? typography.h1 : typography.h2,
    fontWeight: "800",
    color: colors.text,
  },
  headerActions: {
    ...commonStyles.row,
    gap: spacing.sm,
  },
  notificationButton: {
    padding: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: `${colors.surface}80`,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: isTablet() ? typography.h4 : typography.h5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.body1,
    fontWeight: "600",
  },
  actionsGrid: {
    gap: spacing.sm,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    borderLeftWidth: 4,
    ...commonStyles.shadow,
    marginBottom: spacing.sm,
  },
  actionContent: {
    ...commonStyles.row,
    padding: spacing.md,
    alignItems: "center",
  },
  actionIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    ...commonStyles.center,
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  actionDescription: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    width: getCardWidth(2, spacing.lg),
    ...commonStyles.center,
    ...commonStyles.shadow,
  },
  statIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    ...commonStyles.center,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.h5,
    fontWeight: "800",
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  coursesScrollContent: {
    paddingRight: spacing.lg,
  },
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    marginRight: spacing.md,
    width: wp(70),
    ...commonStyles.shadow,
  },
  courseGradient: {
    borderRadius: spacing.md,
    overflow: "hidden",
  },
  courseContent: {
    padding: spacing.md,
  },
  courseHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.sm,
  },
  levelChip: {
    backgroundColor: "transparent",
  },
  levelText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  courseRating: {
    ...commonStyles.row,
    gap: spacing.xs / 2,
  },
  ratingText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  courseTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  courseStats: {
    ...commonStyles.row,
    marginBottom: spacing.sm,
  },
  courseStat: {
    ...commonStyles.row,
    gap: spacing.xs / 2,
  },
  courseStatText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: `${colors.border}50`,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  ctaCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    margin: spacing.lg,
    overflow: "hidden",
    ...commonStyles.shadow,
  },
  ctaGradient: {
    padding: spacing.xl,
  },
  ctaContent: {
    ...commonStyles.center,
  },
  ctaTitle: {
    fontSize: isTablet() ? typography.h3 : typography.h4,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  ctaDescription: {
    fontSize: typography.body1,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  ctaButton: {
    backgroundColor: "white",
    ...commonStyles.row,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
    gap: spacing.xs,
  },
  ctaButtonText: {
    fontSize: typography.body1,
    fontWeight: "700",
    color: colors.primary,
  },
});

export default HomeScreen;
