import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, Button, ProgressBar, Chip } from "react-native-paper";
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
  quizCategories,
  QuizCategory,
  QuizQuestion,
  getQuestionsByCategory,
  getCategoriesByLevel,
} from "../data/quizData";

type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const QuizScreen = () => {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("all");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizCategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const levels = [
    { key: "all", label: "Tümü", labelEN: "All", color: "#64748b" },
    {
      key: "beginner",
      label: "Başlangıç",
      labelEN: "Beginner",
      color: "#10b981",
    },
    {
      key: "intermediate",
      label: "Orta",
      labelEN: "Intermediate",
      color: "#f59e0b",
    },
    { key: "advanced", label: "İleri", labelEN: "Advanced", color: "#ef4444" },
  ];

  const filteredCategories =
    selectedLevel === "all"
      ? quizCategories
      : getCategoriesByLevel(
          selectedLevel as "beginner" | "intermediate" | "advanced",
        );

  const startQuiz = (category: QuizCategory) => {
    const questions = getQuestionsByCategory(category.id);
    if (questions.length === 0) {
      Alert.alert(
        "Quiz Bulunamadı",
        "Bu kategori için henüz sorular eklenmemiş.",
        [{ text: "Tamam" }],
      );
      return;
    }

    setSelectedQuiz(category);
    setQuizQuestions(questions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setUserAnswers([]);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect =
      selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + quizQuestions[currentQuestion].points);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizQuestions([]);
    setShowResult(false);
    setUserAnswers([]);
  };

  const calculatePercentage = () => {
    if (quizQuestions.length === 0) return 0;
    const totalPoints = quizQuestions.reduce((sum, q) => sum + q.points, 0);
    return Math.round((score / totalPoints) * 100);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "#10b981";
    if (percentage >= 70) return "#f59e0b";
    return "#ef4444";
  };

  if (selectedQuiz && !showResult) {
    const question = quizQuestions[currentQuestion];
    const progress = (currentQuestion + 1) / quizQuestions.length;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Quiz Header */}
          <View style={styles.quizHeader}>
            <TouchableOpacity style={styles.backButton} onPress={resetQuiz}>
              <Ionicons
                name="arrow-back"
                size={isTablet() ? wp(6) : wp(7)}
                color="#f9fafb"
              />
            </TouchableOpacity>
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle}>{selectedQuiz.titleTR}</Text>
              <Text style={styles.questionCounter}>
                Soru {currentQuestion + 1} / {quizQuestions.length}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              color="#3b82f6"
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              %{Math.round(progress * 100)} Tamamlandı
            </Text>
          </View>

          {/* Question Card */}
          <Card style={styles.questionCard}>
            <Card.Content style={styles.questionContent}>
              <View style={styles.questionHeader}>
                <Chip
                  mode="outlined"
                  textStyle={styles.chipText}
                  style={[
                    styles.difficultyChip,
                    { borderColor: selectedQuiz.color },
                  ]}
                >
                  {question.difficulty === "beginner"
                    ? "Başlangıç"
                    : question.difficulty === "intermediate"
                      ? "Orta"
                      : "İleri"}
                </Chip>
                <Text style={styles.pointsText}>{question.points} Puan</Text>
              </View>

              <Text style={styles.questionText}>{question.question}</Text>

              <View style={styles.optionsContainer}>
                {question.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedAnswer === index && styles.selectedOption,
                    ]}
                    onPress={() => handleAnswerSelect(index)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedAnswer === index && styles.selectedOptionText,
                      ]}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Next Button */}
          <Button
            mode="contained"
            onPress={handleNextQuestion}
            disabled={selectedAnswer === null}
            style={[
              styles.nextButton,
              selectedAnswer === null && styles.disabledButton,
            ]}
            contentStyle={styles.nextButtonContent}
            labelStyle={styles.nextButtonLabel}
          >
            {currentQuestion + 1 === quizQuestions.length
              ? "Tamamla"
              : "Sonraki Soru"}
          </Button>
        </ScrollView>
      </View>
    );
  }

  if (showResult && selectedQuiz) {
    const percentage = calculatePercentage();
    const passed = percentage >= (selectedQuiz.passingScore || 70);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.resultCard}>
            <Card.Content style={styles.resultContent}>
              <Ionicons
                name={passed ? "checkmark-circle" : "close-circle"}
                size={isTablet() ? wp(20) : wp(25)}
                color={getScoreColor(percentage)}
              />

              <Text style={styles.resultTitle}>
                {passed ? "Tebrikler!" : "Tekrar Deneyin"}
              </Text>

              <Text style={styles.resultSubtitle}>
                {selectedQuiz.titleTR} testi tamamlandı
              </Text>

              <View style={styles.scoreContainer}>
                <Text
                  style={[
                    styles.scoreText,
                    { color: getScoreColor(percentage) },
                  ]}
                >
                  %{percentage}
                </Text>
                <Text style={styles.scoreDetails}>
                  {score} /{" "}
                  {quizQuestions.reduce((sum, q) => sum + q.points, 0)} Puan
                </Text>
                <Text style={styles.correctAnswers}>
                  {
                    userAnswers.filter(
                      (answer, index) =>
                        answer === quizQuestions[index].correctAnswer,
                    ).length
                  }{" "}
                  / {quizQuestions.length} Doğru
                </Text>
              </View>

              <View style={styles.resultActions}>
                <Button
                  mode="outlined"
                  onPress={resetQuiz}
                  style={styles.resultButton}
                  labelStyle={styles.resultButtonLabel}
                >
                  Ana Menü
                </Button>
                <Button
                  mode="contained"
                  onPress={() => startQuiz(selectedQuiz)}
                  style={styles.resultButton}
                  labelStyle={styles.resultButtonLabel}
                >
                  Tekrar Çöz
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sınavlar ve Testler</Text>
          <Text style={styles.subtitle}>
            C/C++ bilginizi test edin ve seviyenizi ölçün
          </Text>
        </View>

        {/* Level Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Seviye:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.filterButton,
                    selectedLevel === level.key && [
                      styles.activeFilterButton,
                      { backgroundColor: level.color },
                    ],
                  ]}
                  onPress={() => setSelectedLevel(level.key as LevelFilter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedLevel === level.key &&
                        styles.activeFilterButtonText,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Quiz Categories */}
        <View style={styles.categoriesContainer}>
          {filteredCategories.map((category) => (
            <Card key={category.id} style={styles.categoryCard}>
              <Card.Content style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={isTablet() ? wp(6) : wp(7)}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{category.titleTR}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.descriptionTR}
                    </Text>
                  </View>
                </View>

                <View style={styles.categoryStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={wp(4)} color="#64748b" />
                    <Text style={styles.statText}>
                      {category.estimatedTime} dk
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="help-circle" size={wp(4)} color="#64748b" />
                    <Text style={styles.statText}>
                      {category.totalQuestions} soru
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="trophy" size={wp(4)} color="#64748b" />
                    <Text style={styles.statText}>
                      %{category.passingScore} geçme
                    </Text>
                  </View>
                </View>

                <View style={styles.categoryFooter}>
                  <Chip
                    mode="outlined"
                    textStyle={[
                      styles.levelChipText,
                      { color: category.color },
                    ]}
                    style={[styles.levelChip, { borderColor: category.color }]}
                  >
                    Bölüm {category.chapter}
                  </Chip>
                  <Button
                    mode="contained"
                    onPress={() => startQuiz(category)}
                    style={[
                      styles.startButton,
                      { backgroundColor: category.color },
                    ]}
                    contentStyle={styles.startButtonContent}
                    labelStyle={styles.startButtonLabel}
                  >
                    Başla
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {filteredCategories.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons
                name="school"
                size={isTablet() ? wp(15) : wp(18)}
                color="#64748b"
              />
              <Text style={styles.emptyTitle}>Bu seviyede test bulunamadı</Text>
              <Text style={styles.emptyDescription}>
                Diğer seviyelerdeki testleri kontrol edin
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: isTablet() ? typography.h2 : typography.h3,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isTablet() ? typography.h6 : typography.body1,
    color: "#64748b",
    textAlign: "center",
    lineHeight: isTablet() ? typography.h6 * 1.4 : typography.body1 * 1.4,
  },
  filterContainer: {
    marginBottom: spacing.lg,
  },
  filterTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: spacing.sm,
  },
  filterButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  activeFilterButton: {
    borderColor: "transparent",
  },
  filterButtonText: {
    fontSize: typography.body2,
    fontWeight: "500",
    color: "#94a3b8",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  categoriesContainer: {
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
  },
  categoryContent: {
    padding: spacing.lg,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  categoryIcon: {
    width: isTablet() ? wp(12) : wp(14),
    height: isTablet() ? wp(12) : wp(14),
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: typography.body2,
    color: "#64748b",
    lineHeight: typography.body2 * 1.4,
  },
  categoryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#334155",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.caption,
    color: "#64748b",
    fontWeight: "500",
  },
  categoryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelChip: {
    backgroundColor: "transparent",
  },
  levelChipText: {
    fontSize: typography.caption,
    fontWeight: "500",
  },
  startButton: {
    borderRadius: spacing.sm,
  },
  startButtonContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  startButtonLabel: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "600",
    color: "#f9fafb",
  },
  questionCounter: {
    fontSize: typography.body2,
    color: "#64748b",
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1e293b",
  },
  progressText: {
    fontSize: typography.caption,
    color: "#64748b",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  questionCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
  },
  questionContent: {
    padding: spacing.lg,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  difficultyChip: {
    backgroundColor: "transparent",
  },
  chipText: {
    fontSize: typography.caption,
    fontWeight: "500",
  },
  pointsText: {
    fontSize: typography.caption,
    color: "#3b82f6",
    fontWeight: "600",
  },
  questionText: {
    fontSize: isTablet() ? typography.h6 : typography.body1,
    color: "#f9fafb",
    lineHeight: isTablet() ? typography.h6 * 1.4 : typography.body1 * 1.4,
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionButton: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  selectedOption: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  optionText: {
    fontSize: typography.body2,
    color: "#e2e8f0",
    lineHeight: typography.body2 * 1.4,
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#3b82f6",
    borderRadius: spacing.sm,
  },
  disabledButton: {
    backgroundColor: "#374151",
  },
  nextButtonContent: {
    paddingVertical: spacing.sm,
  },
  nextButtonLabel: {
    fontSize: typography.body1,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.lg,
    alignSelf: "center",
    maxWidth: isTablet() ? wp(70) : "100%",
  },
  resultContent: {
    alignItems: "center",
    padding: spacing.xxl,
  },
  resultTitle: {
    fontSize: isTablet() ? typography.h3 : typography.h4,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  resultSubtitle: {
    fontSize: typography.body1,
    color: "#64748b",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  scoreText: {
    fontSize: isTablet() ? wp(12) : wp(16),
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  scoreDetails: {
    fontSize: typography.h6,
    color: "#e2e8f0",
    marginBottom: spacing.xs,
  },
  correctAnswers: {
    fontSize: typography.body2,
    color: "#64748b",
  },
  resultActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  resultButton: {
    flex: 1,
    borderRadius: spacing.sm,
  },
  resultButtonLabel: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.md,
  },
  emptyContent: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: "#f9fafb",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: typography.body2,
    color: "#64748b",
    textAlign: "center",
  },
});

export default QuizScreen;
