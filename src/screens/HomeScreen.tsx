import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  Card,
  Button,
  FAB,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";
import SmartSuggestions from "../components/ai/SmartSuggestions";
import aiService from "../services/aiService";

const colors = {
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  outline: "#334155",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  card: "#0f172a",
};

const { width, height } = Dimensions.get("window");

interface QuickAction {
  id: string;
  title: string;
  titleTR: string;
  description: string;
  descriptionTR: string;
  icon: string;
  color: string;
  screen: string;
  aiPowered?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: "quiz",
    title: "Take Quiz",
    titleTR: "Quiz Çöz",
    description: "Test your knowledge",
    descriptionTR: "Bilginizi test edin",
    icon: "school",
    color: "#10b981",
    screen: "Quiz",
    aiPowered: true,
  },
  {
    id: "playground",
    title: "Code Playground",
    titleTR: "Kod Alanı",
    description: "Write and test code",
    descriptionTR: "Kod yazın ve test edin",
    icon: "code-slash",
    color: "#3b82f6",
    screen: "CodePlayground",
    aiPowered: true,
  },
  {
    id: "courses",
    title: "Learn Courses",
    titleTR: "Kurslar",
    description: "Structured learning",
    descriptionTR: "Yapılandırılmış öğrenme",
    icon: "book",
    color: "#8b5cf6",
    screen: "Courses",
    screen: "Main",
    params: { screen: "Courses" },
  },
  {
    id: "ai-chat",
    title: "AI Tutor",
    titleTR: "AI Öğretmen",
    description: "Get instant help",
    descriptionTR: "Anında yardım alın",
    icon: "sparkles",
    color: "#06b6d4",
    screen: "Main",
    params: { screen: "AIChat" },
    aiPowered: true,
  },
  {
    id: "forum",
    title: "Community",
    titleTR: "Topluluk",
    description: "Join discussions",
    descriptionTR: "Tartışmalara katılın",
    icon: "chatbubbles",
    color: "#f59e0b",
    screen: "Main",
    params: { screen: "Forum" },
  },
  {
    id: "progress",
    title: "Progress",
    titleTR: "İlerleme",
    description: "Track your growth",
    descriptionTR: "Gelişiminizi takip edin",
    icon: "trending-up",
    color: "#ef4444",
    screen: "Progress",
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [aiStatus, setAiStatus] = useState<"connected" | "disconnected">(
    "disconnected",
  );
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [userStats, setUserStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    streakCount: 0,
    completedCourses: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Check AI status
      const status = await aiService.getHealthStatus();
      setAiStatus(status.status);

      // Load user stats (you'd implement this based on your backend)
      // const stats = await userService.getUserStats();
      // setUserStats(stats);

      setUserStats({
        totalQuizzes: 12,
        averageScore: 85,
        streakCount: 5,
        completedCourses: 3,
      });
    } catch (error) {
      console.warn("Error loading initial data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.params) {
      navigation.navigate(action.screen as any, action.params);
    } else {
      navigation.navigate(action.screen as any);
    }
  };

  const handleAiFeatureInfo = () => {
    setShowAiDialog(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primary, colors.secondary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>CodeMentor AI</Text>
              <Text style={styles.heroSubtitle}>
                🤖 AI Destekli C/C++ Öğrenme Platformu
              </Text>
              <Text style={styles.heroDescription}>
                Yapay zeka ile kişiselleştirilmiş öğrenme deneyimi
              </Text>
            </View>

            <TouchableOpacity
              style={styles.aiStatusBadge}
              onPress={handleAiFeatureInfo}
            >
              <View
                style={[
                  styles.aiStatusIndicator,
                  {
                    backgroundColor:
                      aiStatus === "connected"
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              />
              <Text style={styles.aiStatusText}>
                {aiStatus === "connected" ? "AI Aktif" : "AI Bağlanıyor"}
              </Text>
              <Ionicons
                name="information-circle"
                size={wp(4)}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="trophy" size={wp(6)} color={colors.warning} />
              <Text style={styles.statNumber}>{userStats.totalQuizzes}</Text>
              <Text style={styles.statLabel}>Quiz Tamamlandı</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="star" size={wp(6)} color={colors.success} />
              <Text style={styles.statNumber}>{userStats.averageScore}%</Text>
              <Text style={styles.statLabel}>Ortalama Puan</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="flame" size={wp(6)} color={colors.error} />
              <Text style={styles.statNumber}>{userStats.streakCount}</Text>
              <Text style={styles.statLabel}>Günlük Seri</Text>
            </Card.Content>
          </Card>
        </View>

        {/* AI Smart Suggestions */}
        <SmartSuggestions
          userLevel="beginner"
          recentActivity={["variables", "functions"]}
          onNavigate={(screen: string, params?: any) => {
            if (params) {
              navigation.navigate(screen as any, params);
            } else {
              navigation.navigate(screen as any);
            }
          }}
        />

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content style={styles.actionsContent}>
            <View style={styles.actionsHeader}>
              <Text style={styles.actionsTitle}>Hızlı Eylemler</Text>
              <Text style={styles.actionsSubtitle}>
                Öğrenmeye hemen başlayın
              </Text>
            </View>

            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, { backgroundColor: action.color }]}
                  onPress={() => handleQuickAction(action)}
                >
                  <LinearGradient
                    colors={[action.color, `${action.color}CC`]}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionHeader}>
                      <Ionicons
                        name={action.icon as any}
                        size={wp(6)}
                        color={colors.text}
                      />
                      {action.aiPowered && (
                        <View style={styles.aiPoweredBadge}>
                          <Ionicons
                            name="sparkles"
                            size={wp(3)}
                            color={colors.accent}
                          />
                        </View>
                      )}
                    </View>
                    <Text style={styles.actionTitle}>{action.titleTR}</Text>
                    <Text style={styles.actionDescription}>
                      {action.descriptionTR}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content style={styles.activityContent}>
            <View style={styles.activityHeader}>
              <Ionicons name="time" size={wp(5)} color={colors.accent} />
              <Text style={styles.activityTitle}>Son Aktiviteler</Text>
            </View>

            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name="checkmark-circle"
                    size={wp(4)}
                    color={colors.success}
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    C++ Temelleri quizi tamamlandı
                  </Text>
                  <Text style={styles.activityTime}>2 saat önce</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name="code-slash"
                    size={wp(4)}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    Hello World programı çalıştırıldı
                  </Text>
                  <Text style={styles.activityTime}>5 saat önce</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name="sparkles"
                    size={wp(4)}
                    color={colors.accent}
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    AI asistanından değişkenler hakkında yardım alındı
                  </Text>
                  <Text style={styles.activityTime}>1 gün önce</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Learning Path */}
        <Card style={styles.pathCard}>
          <Card.Content style={styles.pathContent}>
            <View style={styles.pathHeader}>
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                style={styles.pathIcon}
              >
                <Ionicons name="map" size={wp(5)} color={colors.text} />
              </LinearGradient>
              <View style={styles.pathText}>
                <Text style={styles.pathTitle}>Öğrenme Yolunuz</Text>
                <Text style={styles.pathSubtitle}>
                  C++ ustası olmaya giden yol
                </Text>
              </View>
            </View>

            <View style={styles.pathProgress}>
              <View style={styles.pathStep}>
                <View
                  style={[
                    styles.pathStepIcon,
                    { backgroundColor: colors.success },
                  ]}
                >
                  <Ionicons name="checkmark" size={wp(4)} color={colors.text} />
                </View>
                <Text style={styles.pathStepText}>Temel Kavramlar ✓</Text>
              </View>

              <View style={styles.pathConnector} />

              <View style={styles.pathStep}>
                <View
                  style={[
                    styles.pathStepIcon,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.pathStepNumber}>2</Text>
                </View>
                <Text style={styles.pathStepText}>Fonksiyonlar (Aktif)</Text>
              </View>

              <View style={styles.pathConnector} />

              <View style={styles.pathStep}>
                <View
                  style={[
                    styles.pathStepIcon,
                    { backgroundColor: colors.outline },
                  ]}
                >
                  <Text style={styles.pathStepNumber}>3</Text>
                </View>
                <Text style={styles.pathStepText}>Nesne Yönelimli</Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={() => navigation.navigate("Main", { screen: "Courses" })}
              style={styles.pathButton}
              contentStyle={styles.pathButtonContent}
            >
              Devam Et
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* AI Feature Info Dialog */}
      <Portal>
        <Dialog visible={showAiDialog} onDismiss={() => setShowAiDialog(false)}>
          <Dialog.Title>🤖 AI Özellikleri</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>
              CodeMentor AI, öğrenme deneyiminizi geliştirmek için yapay zeka
              kullanır:
            </Paragraph>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>
                ✨ Akıllı kod analizi ve öneriler
              </Text>
              <Text style={styles.featureItem}>
                🎯 Kişiselleştirilmiş quiz ipuçları
              </Text>
              <Text style={styles.featureItem}>
                📚 Otomatik konu açıklamaları
              </Text>
              <Text style={styles.featureItem}>
                🚀 Hızlı problem çözme yardımı
              </Text>
              <Text style={styles.featureItem}>
                📈 Akıllı öğrenme önerileri
              </Text>
            </View>
            <Paragraph style={styles.dialogText}>
              Durum: {aiStatus === "connected" ? "🟢 Aktif" : "🟡 Bağlanıyor"}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAiDialog(false)}>Tamam</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Floating AI Assistant Button */}
      <FAB
        icon="sparkles"
        style={styles.aiFab}
        onPress={() => navigation.navigate("Main", { screen: "AIChat" })}
        label={aiStatus === "connected" ? "AI Asistan" : "AI"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  heroSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomLeftRadius: spacing.xl,
    borderBottomRightRadius: spacing.xl,
  },
  heroContent: {
    alignItems: "center",
  },
  heroText: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: isTablet() ? typography.h1 : typography.h2,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: typography.body1,
    color: colors.text,
    textAlign: "center",
    opacity: 0.9,
  },
  aiStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  aiStatusIndicator: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  aiStatusText: {
    fontSize: typography.body2,
    color: colors.text,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  statContent: {
    alignItems: "center",
    padding: spacing.md,
  },
  statNumber: {
    fontSize: typography.h4,
    fontWeight: "700",
    color: colors.text,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    margin: spacing.md,
  },
  actionsContent: {
    padding: spacing.lg,
  },
  actionsHeader: {
    marginBottom: spacing.lg,
  },
  actionsTitle: {
    fontSize: isTablet() ? typography.h4 : typography.h5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionsSubtitle: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionCard: {
    width: (width - spacing.md * 3 - spacing.lg * 2) / 2,
    borderRadius: spacing.md,
    overflow: "hidden",
  },
  actionGradient: {
    padding: spacing.md,
    minHeight: hp(15),
    justifyContent: "space-between",
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  aiPoweredBadge: {
    backgroundColor: "rgba(6, 182, 212, 0.3)",
    borderRadius: wp(2),
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  actionTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: typography.body2,
    color: colors.text,
    opacity: 0.9,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    margin: spacing.md,
  },
  activityContent: {
    padding: spacing.lg,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  activityTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
  },
  activityList: {
    gap: spacing.md,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  activityIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: typography.body2,
    color: colors.text,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  activityTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  pathCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    margin: spacing.md,
  },
  pathContent: {
    padding: spacing.lg,
  },
  pathHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  pathIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  pathText: {
    flex: 1,
  },
  pathTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pathSubtitle: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  pathProgress: {
    marginBottom: spacing.lg,
  },
  pathStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  pathStepIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  pathStepNumber: {
    fontSize: typography.body2,
    fontWeight: "700",
    color: colors.text,
  },
  pathStepText: {
    fontSize: typography.body2,
    color: colors.text,
    fontWeight: "500",
  },
  pathConnector: {
    width: 2,
    height: spacing.md,
    backgroundColor: colors.outline,
    marginLeft: wp(4) - 1,
    marginBottom: spacing.sm,
  },
  pathButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
  },
  pathButtonContent: {
    paddingVertical: spacing.sm,
  },
  dialogText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featureList: {
    marginBottom: spacing.md,
  },
  featureItem: {
    fontSize: typography.body2,
    color: colors.text,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  aiFab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.accent,
  },
});

export default HomeScreen;
