import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, Button, ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
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
import {
  quizCategories,
  QuizCategory,
  QuizQuestion,
  getQuestionsByCategory,
  getCategoriesByLevel,
} from "../data/quizData";
import { saveQuizResult } from "../utils/quizStorage";
import { TestResult } from "../data/quizData";

type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const QuizScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("all");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizCategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date>(new Date());

  const levels = [
    { key: "all", label: "Tümü", color: COLORS.gray400 },
    { key: "beginner", label: "Başlangıç", color: COLORS.success },
    { key: "intermediate", label: "Orta", color: COLORS.warning },
    { key: "advanced", label: "İleri", color: COLORS.error },
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
    setStartTime(new Date());
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
      // Quiz completed
      const endTime = new Date();
      const timeSpent = Math.round(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );

      const result: TestResult = {
        quizId: selectedQuiz!.id,
        score,
        totalQuestions: quizQuestions.length,
        correctAnswers: newAnswers.filter(
          (answer, index) => answer === quizQuestions[index].correctAnswer,
        ).length,
        timeSpent,
        completedAt: endTime,
        answers: newAnswers.map((answer, index) => ({
          questionId: quizQuestions[index].id,
          selectedAnswer: answer,
          isCorrect: answer === quizQuestions[index].correctAnswer,
        })),
      };

      saveQuizResult(result);
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

  // Quiz Taking View
  if (selectedQuiz && !showResult) {
    const question = quizQuestions[currentQuestion];
    const progress = (currentQuestion + 1) / quizQuestions.length;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.quizHeader}>
          <TouchableOpacity onPress={resetQuiz} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.quizInfo}>
            <Text style={styles.quizTitle}>{selectedQuiz.titleTR}</Text>
            <Text style={styles.questionCounter}>
              {currentQuestion + 1} / {quizQuestions.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            color={COLORS.primary}
            style={styles.progressBar}
          />
        </View>

        <ScrollView style={styles.questionContainer}>
          {/* Question */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: selectedQuiz.color },
                ]}
              >
                <Text style={styles.difficultyText}>
                  {question.difficulty === "beginner"
                    ? "Başlangıç"
                    : question.difficulty === "intermediate"
                      ? "Orta"
                      : "İleri"}
                </Text>
              </View>
              <Text style={styles.pointsText}>{question.points} puan</Text>
            </View>

            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                ]}
                onPress={() => handleAnswerSelect(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionIndicator,
                    selectedAnswer === index && styles.selectedIndicator,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,
                      selectedAnswer === index && styles.selectedLetter,
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.bottomContainer}>
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
              : "Sonraki"}
          </Button>
        </View>
      </View>
    );
  }

  // Results View
  if (showResult && selectedQuiz) {
    const percentage = calculatePercentage();
    const passed = percentage >= (selectedQuiz.passingScore || 70);

    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <TouchableOpacity onPress={resetQuiz} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.resultHeaderTitle}>Sonuç</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.resultContent}>
            <View style={styles.resultIcon}>
              <Ionicons
                name={passed ? "checkmark-circle" : "close-circle"}
                size={80}
                color={passed ? COLORS.success : COLORS.error}
              />
            </View>

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
                  { color: passed ? COLORS.success : COLORS.error },
                ]}
              >
                %{percentage}
              </Text>
              <Text style={styles.scoreDetails}>
                {
                  userAnswers.filter(
                    (answer, index) =>
                      answer === quizQuestions[index].correctAnswer,
                  ).length
                }{" "}
                / {quizQuestions.length} doğru cevap
              </Text>
            </View>

            <View style={styles.resultActions}>
              <Button
                mode="outlined"
                onPress={resetQuiz}
                style={styles.resultButton}
              >
                Ana Menü
              </Button>
              <Button
                mode="contained"
                onPress={() => startQuiz(selectedQuiz)}
                style={styles.resultButton}
              >
                Tekrar Çöz
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Main Quiz List View
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sınavlar</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("QuizStats")}
          style={styles.statsButton}
        >
          <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Level Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.filterTab,
                  selectedLevel === level.key && [
                    styles.activeFilterTab,
                    { backgroundColor: level.color },
                  ],
                ]}
                onPress={() => setSelectedLevel(level.key as LevelFilter)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedLevel === level.key && styles.activeFilterTabText,
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
      <ScrollView
        style={styles.categoriesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => startQuiz(category)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.categoryIcon, { backgroundColor: category.color }]}
            >
              <Ionicons
                name={category.icon as any}
                size={24}
                color={COLORS.white}
              />
            </View>

            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{category.titleTR}</Text>
              <Text style={styles.categoryDescription}>
                {category.descriptionTR}
              </Text>

              <View style={styles.categoryMeta}>
                <Text style={styles.categoryMetaText}>
                  {category.totalQuestions} soru • {category.estimatedTime}dk
                </Text>
              </View>
            </View>

            <View style={styles.categoryArrow}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textSecondary}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
  },
  headerTitle: {
    fontSize: TYPOGRAPHY["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  statsButton: {
    padding: SPACING[2],
    borderRadius: RADIUS.base,
    backgroundColor: COLORS.surface,
  },
  filterContainer: {
    paddingBottom: SPACING[4],
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
  },
  filterTab: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  activeFilterTabText: {
    color: COLORS.white,
  },
  categoriesList: {
    flex: 1,
    paddingHorizontal: SPACING[4],
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[3],
    ...SHADOWS.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING[3],
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  categoryDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING[2],
  },
  categoryMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryMetaText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textMuted,
  },
  categoryArrow: {
    marginLeft: SPACING[2],
  },

  // Quiz Taking Styles
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
  },
  backButton: {
    padding: SPACING[2],
    marginRight: SPACING[2],
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  questionCounter: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  helpButton: {
    padding: SPACING[2],
  },
  progressContainer: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[6],
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: SPACING[4],
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[5],
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING[4],
  },
  difficultyBadge: {
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.full,
  },
  difficultyText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.white,
  },
  pointsText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  questionText: {
    fontSize: TYPOGRAPHY.lg,
    lineHeight: TYPOGRAPHY.lineHeight.lg,
    color: COLORS.text,
  },
  optionsContainer: {
    gap: SPACING[3],
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING[3],
  },
  selectedIndicator: {
    backgroundColor: COLORS.primary,
  },
  optionLetter: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
  },
  selectedLetter: {
    color: COLORS.white,
  },
  optionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeight.base,
  },
  selectedOptionText: {
    color: COLORS.primary,
  },
  bottomContainer: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[4],
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
  },
  disabledButton: {
    backgroundColor: COLORS.gray300,
  },
  nextButtonContent: {
    paddingVertical: SPACING[3],
  },
  nextButtonLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  // Result Styles
  resultContainer: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
  },
  resultHeaderTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  placeholder: {
    width: 24,
  },
  resultContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING[4],
  },
  resultIcon: {
    marginBottom: SPACING[6],
  },
  resultTitle: {
    fontSize: TYPOGRAPHY["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    marginBottom: SPACING[2],
    textAlign: "center",
  },
  resultSubtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING[8],
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: SPACING[10],
  },
  scoreText: {
    fontSize: TYPOGRAPHY["5xl"],
    fontWeight: TYPOGRAPHY.fontWeight.extrabold,
    marginBottom: SPACING[2],
  },
  scoreDetails: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  resultActions: {
    flexDirection: "row",
    gap: SPACING[3],
    width: "100%",
  },
  resultButton: {
    flex: 1,
    borderRadius: RADIUS.lg,
  },
});

export default QuizScreen;
