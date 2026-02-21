import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
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
import {
  getUserProgress,
  getQuizResults,
  getAchievementInfo,
  UserProgress,
  clearQuizData,
} from "../utils/quizStorage";
import { quizCategories } from "../data/quizData";

const QuizStatsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const userProgress = await getUserProgress();
      setProgress(userProgress);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    try {
      await clearQuizData();
      await loadProgress();
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  if (loading || !progress) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>İstatistikler yükleniyor...</Text>
      </View>
    );
  }

  const completionRate =
    quizCategories.length > 0
      ? Math.round(
          (progress.completedQuizzes.length / quizCategories.length) * 100,
        )
      : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={wp(6)} color="#f9fafb" />
          </TouchableOpacity>
          <Text style={styles.title}>Quiz İstatistikleri</Text>
        </View>

        {/* Overall Stats */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <Text style={styles.cardTitle}>Genel İstatistikler</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={wp(8)} color="#f59e0b" />
                <Text style={styles.statValue}>{progress.totalQuizzes}</Text>
                <Text style={styles.statLabel}>Tamamlanan Quiz</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="star" size={wp(8)} color="#10b981" />
                <Text style={styles.statValue}>{progress.averageScore}</Text>
                <Text style={styles.statLabel}>Ortalama Puan</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={wp(8)}
                  color="#3b82f6"
                />
                <Text style={styles.statValue}>%{completionRate}</Text>
                <Text style={styles.statLabel}>Tamamlanma Oranı</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="flame" size={wp(8)} color="#ef4444" />
                <Text style={styles.statValue}>{progress.streakCount}</Text>
                <Text style={styles.statLabel}>Günlük Seri</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Best Scores */}
        <Card style={styles.scoresCard}>
          <Card.Content style={styles.scoresContent}>
            <Text style={styles.cardTitle}>En İyi Puanlar</Text>

            {Object.keys(progress.bestScores).length > 0 ? (
              <View style={styles.scoresContainer}>
                {Object.entries(progress.bestScores).map(([quizId, score]) => {
                  const category = quizCategories.find(
                    (cat) => cat.id === quizId,
                  );
                  if (!category) return null;

                  return (
                    <View key={quizId} style={styles.scoreItem}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: category.color },
                        ]}
                      >
                        <Ionicons
                          name={category.icon as any}
                          size={wp(5)}
                          color="#fff"
                        />
                      </View>
                      <View style={styles.scoreInfo}>
                        <Text style={styles.scoreCategoryName}>
                          {category.titleTR}
                        </Text>
                        <Text style={styles.scoreDescription}>
                          {category.descriptionTR}
                        </Text>
                      </View>
                      <View style={styles.scoreValue}>
                        <Text
                          style={[
                            styles.scorePercentage,
                            { color: category.color },
                          ]}
                        >
                          %{score}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={wp(12)} color="#64748b" />
                <Text style={styles.emptyText}>Henüz quiz tamamlanmamış</Text>
                <Text style={styles.emptySubtext}>
                  İlk quizinizi çözün ve puanınızı görün!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Card.Content style={styles.achievementsContent}>
            <Text style={styles.cardTitle}>Başarılar</Text>

            {progress.achievements.length > 0 ? (
              <View style={styles.achievementsContainer}>
                {progress.achievements.map((achievementId) => {
                  const achievement = getAchievementInfo(achievementId);
                  return (
                    <View key={achievementId} style={styles.achievementItem}>
                      <View
                        style={[
                          styles.achievementIcon,
                          { backgroundColor: achievement.color },
                        ]}
                      >
                        <Ionicons
                          name={achievement.icon as any}
                          size={wp(6)}
                          color="#fff"
                        />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>
                          {achievement.title}
                        </Text>
                        <Text style={styles.achievementDescription}>
                          {achievement.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="medal-outline" size={wp(12)} color="#64748b" />
                <Text style={styles.emptyText}>Henüz başarı kazanılmadı</Text>
                <Text style={styles.emptySubtext}>
                  Quiz çözerek başarılar kazanın!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Quiz")}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
          >
            Quizlere Dön
          </Button>

          <Button
            mode="contained"
            onPress={handleClearData}
            style={[styles.actionButton, styles.clearButton]}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
          >
            Verileri Temizle
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  title: {
    fontSize: isTablet() ? typography.h3 : typography.h4,
    fontWeight: "700",
    color: "#f9fafb",
  },
  loadingText: {
    fontSize: typography.body1,
    color: "#64748b",
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  statsContent: {
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: "#1e293b",
    borderRadius: spacing.sm,
  },
  statValue: {
    fontSize: isTablet() ? typography.h4 : typography.h5,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.caption,
    color: "#64748b",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  scoresCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  scoresContent: {
    padding: spacing.lg,
  },
  scoresContainer: {
    gap: spacing.sm,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: "#1e293b",
    borderRadius: spacing.sm,
  },
  categoryIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreCategoryName: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: "#f9fafb",
  },
  scoreDescription: {
    fontSize: typography.caption,
    color: "#64748b",
  },
  scoreValue: {
    alignItems: "flex-end",
  },
  scorePercentage: {
    fontSize: typography.h6,
    fontWeight: "700",
  },
  achievementsCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  achievementsContent: {
    padding: spacing.lg,
  },
  achievementsContainer: {
    gap: spacing.sm,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: "#1e293b",
    borderRadius: spacing.sm,
  },
  achievementIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: typography.body2,
    color: "#64748b",
    lineHeight: typography.body2 * 1.3,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: "#f9fafb",
    marginTop: spacing.md,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: typography.body2,
    color: "#64748b",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: spacing.sm,
  },
  clearButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonContent: {
    paddingVertical: spacing.sm,
  },
  actionButtonLabel: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
});

export default QuizStatsScreen;
