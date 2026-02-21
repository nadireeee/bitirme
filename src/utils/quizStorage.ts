import AsyncStorage from "@react-native-async-storage/async-storage";
import { TestResult } from "../data/quizData";

const QUIZ_RESULTS_KEY = "@quiz_results";
const USER_PROGRESS_KEY = "@user_progress";

export interface UserProgress {
  completedQuizzes: string[];
  totalScore: number;
  totalQuizzes: number;
  averageScore: number;
  bestScores: { [quizId: string]: number };
  achievements: string[];
  streakCount: number;
  lastQuizDate: string;
}

export const saveQuizResult = async (result: TestResult): Promise<void> => {
  try {
    // Save individual quiz result
    const existingResults = await getQuizResults();
    const updatedResults = [...existingResults, result];
    await AsyncStorage.setItem(
      QUIZ_RESULTS_KEY,
      JSON.stringify(updatedResults),
    );

    // Update user progress
    await updateUserProgress(result);
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
};

export const getQuizResults = async (): Promise<TestResult[]> => {
  try {
    const results = await AsyncStorage.getItem(QUIZ_RESULTS_KEY);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("Error getting quiz results:", error);
    return [];
  }
};

export const getQuizResultsByCategory = async (
  quizId: string,
): Promise<TestResult[]> => {
  try {
    const allResults = await getQuizResults();
    return allResults.filter((result) => result.quizId === quizId);
  } catch (error) {
    console.error("Error getting quiz results by category:", error);
    return [];
  }
};

export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const progress = await AsyncStorage.getItem(USER_PROGRESS_KEY);
    return progress
      ? JSON.parse(progress)
      : {
          completedQuizzes: [],
          totalScore: 0,
          totalQuizzes: 0,
          averageScore: 0,
          bestScores: {},
          achievements: [],
          streakCount: 0,
          lastQuizDate: "",
        };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return {
      completedQuizzes: [],
      totalScore: 0,
      totalQuizzes: 0,
      averageScore: 0,
      bestScores: {},
      achievements: [],
      streakCount: 0,
      lastQuizDate: "",
    };
  }
};

const updateUserProgress = async (result: TestResult): Promise<void> => {
  try {
    const currentProgress = await getUserProgress();

    // Calculate score percentage
    const percentage = Math.round(
      (result.score / (result.totalQuestions * 10)) * 100,
    ); // Assuming 10 points per question average

    // Update completed quizzes
    if (!currentProgress.completedQuizzes.includes(result.quizId)) {
      currentProgress.completedQuizzes.push(result.quizId);
    }

    // Update scores
    currentProgress.totalScore += result.score;
    currentProgress.totalQuizzes += 1;
    currentProgress.averageScore = Math.round(
      currentProgress.totalScore / currentProgress.totalQuizzes,
    );

    // Update best scores
    if (
      !currentProgress.bestScores[result.quizId] ||
      percentage > currentProgress.bestScores[result.quizId]
    ) {
      currentProgress.bestScores[result.quizId] = percentage;
    }

    // Update streak
    const today = new Date().toDateString();
    const lastQuizDate = new Date(currentProgress.lastQuizDate || today);
    const daysDiff = Math.floor(
      (new Date(today).getTime() - lastQuizDate.getTime()) / (1000 * 3600 * 24),
    );

    if (daysDiff === 1) {
      currentProgress.streakCount += 1;
    } else if (daysDiff > 1) {
      currentProgress.streakCount = 1;
    }
    currentProgress.lastQuizDate = today;

    // Check for achievements
    const newAchievements = checkAchievements(currentProgress);
    currentProgress.achievements = [
      ...new Set([...currentProgress.achievements, ...newAchievements]),
    ];

    await AsyncStorage.setItem(
      USER_PROGRESS_KEY,
      JSON.stringify(currentProgress),
    );
  } catch (error) {
    console.error("Error updating user progress:", error);
  }
};

const checkAchievements = (progress: UserProgress): string[] => {
  const achievements: string[] = [];

  // First quiz completion
  if (progress.totalQuizzes === 1) {
    achievements.push("first_quiz");
  }

  // Perfect score achievement
  Object.values(progress.bestScores).forEach((score) => {
    if (score === 100) {
      achievements.push("perfect_score");
    }
  });

  // Quiz master (10 quizzes completed)
  if (progress.completedQuizzes.length >= 10) {
    achievements.push("quiz_master");
  }

  // High achiever (average score > 80)
  if (progress.averageScore > 80) {
    achievements.push("high_achiever");
  }

  // Consistent learner (7 day streak)
  if (progress.streakCount >= 7) {
    achievements.push("consistent_learner");
  }

  // Expert level (completed 5 advanced quizzes)
  const advancedQuizzes = progress.completedQuizzes.filter(
    (quizId) =>
      quizId.includes("templates") ||
      quizId.includes("stl") ||
      quizId.includes("modern-cpp"),
  );
  if (advancedQuizzes.length >= 3) {
    achievements.push("expert_level");
  }

  return achievements;
};

export const clearQuizData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(QUIZ_RESULTS_KEY);
    await AsyncStorage.removeItem(USER_PROGRESS_KEY);
  } catch (error) {
    console.error("Error clearing quiz data:", error);
  }
};

export const getAchievementInfo = (achievementId: string) => {
  const achievements = {
    first_quiz: {
      title: "İlk Adım",
      titleEN: "First Step",
      description: "İlk quizinizi tamamladınız!",
      descriptionEN: "Completed your first quiz!",
      icon: "trophy",
      color: "#10b981",
    },
    perfect_score: {
      title: "Mükemmel",
      titleEN: "Perfect",
      description: "Bir quizden tam puan aldınız!",
      descriptionEN: "Got a perfect score on a quiz!",
      icon: "star",
      color: "#f59e0b",
    },
    quiz_master: {
      title: "Quiz Ustası",
      titleEN: "Quiz Master",
      description: "10 quiz tamamladınız!",
      descriptionEN: "Completed 10 quizzes!",
      icon: "school",
      color: "#8b5cf6",
    },
    high_achiever: {
      title: "Yüksek Başarı",
      titleEN: "High Achiever",
      description: "Ortalama puanınız 80'in üzerinde!",
      descriptionEN: "Your average score is above 80!",
      icon: "trending-up",
      color: "#3b82f6",
    },
    consistent_learner: {
      title: "Düzenli Öğrenci",
      titleEN: "Consistent Learner",
      description: "7 gün üst üste quiz çözdünüz!",
      descriptionEN: "Solved quizzes for 7 consecutive days!",
      icon: "calendar",
      color: "#ef4444",
    },
    expert_level: {
      title: "Uzman Seviye",
      titleEN: "Expert Level",
      description: "3 ileri seviye quiz tamamladınız!",
      descriptionEN: "Completed 3 advanced level quizzes!",
      icon: "rocket",
      color: "#06b6d4",
    },
  };

  return (
    achievements[achievementId as keyof typeof achievements] || {
      title: "Bilinmeyen Başarı",
      titleEN: "Unknown Achievement",
      description: "",
      descriptionEN: "",
      icon: "help",
      color: "#64748b",
    }
  );
};
