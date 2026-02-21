import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  wp,
  hp,
  isSmallDevice,
} from "../styles/designSystem";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  screen: string;
  params?: any;
}

const quickActions: QuickAction[] = [
  {
    id: "quiz",
    title: "Quiz",
    icon: "help-circle",
    color: COLORS.success,
    screen: "Quiz",
  },
  {
    id: "playground",
    title: "Kod Editörü",
    icon: "code-slash",
    color: COLORS.primary,
    screen: "CodePlayground",
  },
  {
    id: "courses",
    title: "Kurslar",
    icon: "book",
    color: COLORS.info,
    screen: "Main",
    params: { screen: "Courses" },
  },
  {
    id: "ai-chat",
    title: "AI Asistan",
    icon: "sparkles",
    color: COLORS.warning,
    screen: "Main",
    params: { screen: "AIChat" },
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    totalQuizzes: 12,
    averageScore: 85,
    streakCount: 5,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.params) {
      navigation.navigate(action.screen as any, action.params);
    } else {
      navigation.navigate(action.screen as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Merhaba! 👋</Text>
              <Text style={styles.titleText}>CodeMentor AI</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("Main", { screen: "Profile" })}
            >
              <Ionicons name="person-circle" size={32} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalQuizzes}</Text>
            <Text style={styles.statLabel}>Quiz</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.averageScore}%</Text>
            <Text style={styles.statLabel}>Başarı</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.streakCount}</Text>
            <Text style={styles.statLabel}>Seri</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Başlat</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: action.color }]}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={24}
                    color={COLORS.white}
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Hedef</Text>
          <Card style={styles.goalCard}>
            <View style={styles.goalContent}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>C++ Fonksiyonları</Text>
                <Text style={styles.goalSubtitle}>15 dakikalık ders</Text>
              </View>
              <TouchableOpacity style={styles.goalButton}>
                <Ionicons name="play" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>3/5 tamamlandı</Text>
          </Card>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Öğrenmeye Devam Et</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesContainer}
          >
            {[1, 2, 3].map((item) => (
              <Card key={item} style={styles.courseCard}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.info]}
                  style={styles.courseGradient}
                >
                  <Text style={styles.courseTitle}>C++ Temelleri</Text>
                  <Text style={styles.courseProgress}>Bölüm {item}/10</Text>
                </LinearGradient>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          <View style={styles.activityList}>
            {[
              {
                icon: "checkmark-circle",
                text: "Variables quiz tamamlandı",
                time: "2s önce",
                color: COLORS.success,
              },
              {
                icon: "code-slash",
                text: "Hello World yazdın",
                time: "1s önce",
                color: COLORS.primary,
              },
              {
                icon: "sparkles",
                text: "AI'dan yardım aldın",
                time: "5d önce",
                color: COLORS.warning,
              },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: activity.color },
                  ]}
                >
                  <Ionicons
                    name={activity.icon as any}
                    size={16}
                    color={COLORS.white}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{activity.text}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING[20],
  },
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[6],
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING[1],
  },
  titleText: {
    fontSize: TYPOGRAPHY["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  profileButton: {
    padding: SPACING[1],
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[8],
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING[4],
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  statNumber: {
    fontSize: TYPOGRAPHY["2xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING[8],
    paddingHorizontal: SPACING[4],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING[4],
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[4],
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING[3],
  },
  actionCard: {
    width: (wp(100) - SPACING[4] * 2 - SPACING[3]) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    alignItems: "center",
    ...SHADOWS.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING[3],
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    textAlign: "center",
  },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    ...SHADOWS.sm,
  },
  goalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING[3],
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  goalSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  goalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginBottom: SPACING[2],
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "60%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  coursesContainer: {
    paddingRight: SPACING[4],
  },
  courseCard: {
    width: wp(70),
    marginRight: SPACING[3],
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  courseGradient: {
    padding: SPACING[4],
    height: 100,
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },
  courseProgress: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  activityList: {
    gap: SPACING[3],
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING[3],
    borderRadius: RADIUS.base,
    ...SHADOWS.sm,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING[3],
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING[1],
  },
  activityTime: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
