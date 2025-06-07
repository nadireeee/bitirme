import apiClient from "./api";
import { API_ENDPOINTS } from "../config/api";

export interface QuizCategory {
  id: string;
  title: string;
  titleTR: string;
  description: string;
  descriptionTR: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  chapter: number;
  icon: string;
  color: string;
  estimatedTime: number;
  totalQuestions: number;
  passingScore: number;
  _count?: {
    questions: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionTR?: string;
  options: string[];
  optionsTR?: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  chapter: string;
  points: number;
  order: number;
}

export interface QuizAnswer {
  selectedAnswer: number;
}

export interface SubmitQuizRequest {
  categoryId: string;
  answers: QuizAnswer[];
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  category: QuizCategory;
  answers?: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    pointsEarned: number;
    question: {
      question: string;
      questionTR?: string;
      options: string[];
      optionsTR?: string[];
      correctAnswer: number;
      explanation: string;
      explanationTR?: string;
      points: number;
    };
  }[];
}

export interface QuizStats {
  overall: {
    totalQuizzes: number;
    averageScore: number;
    totalPoints: number;
    completedCategories: number;
    totalCategories: number;
    completionRate: number;
    currentStreak: number;
  };
  byCategory: {
    category: QuizCategory;
    attempts: number;
    averageScore: number;
    bestScore: number;
  }[];
}

class QuizService {
  // Get quiz categories
  async getCategories(
    level?: string,
    chapter?: number,
  ): Promise<QuizCategory[]> {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    if (chapter !== undefined) params.append("chapter", chapter.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.QUIZ.CATEGORIES}?${queryString}`
      : API_ENDPOINTS.QUIZ.CATEGORIES;

    return apiClient.get<QuizCategory[]>(url);
  }

  // Get category by ID with questions
  async getCategoryById(
    id: string,
  ): Promise<QuizCategory & { questions: QuizQuestion[] }> {
    return apiClient.get<QuizCategory & { questions: QuizQuestion[] }>(
      API_ENDPOINTS.QUIZ.CATEGORY_BY_ID(id),
    );
  }

  // Get questions for a category
  async getQuestionsByCategory(categoryId: string): Promise<QuizQuestion[]> {
    return apiClient.get<QuizQuestion[]>(
      API_ENDPOINTS.QUIZ.QUESTIONS(categoryId),
    );
  }

  // Submit quiz answers
  async submitQuiz(submission: SubmitQuizRequest): Promise<QuizResult> {
    return apiClient.post<QuizResult>(API_ENDPOINTS.QUIZ.SUBMIT, submission);
  }

  // Get user quiz results
  async getUserResults(limit = 20, offset = 0): Promise<QuizResult[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return apiClient.get<QuizResult[]>(
      `${API_ENDPOINTS.QUIZ.RESULTS}?${params.toString()}`,
    );
  }

  // Get specific quiz result
  async getResultById(resultId: string): Promise<QuizResult> {
    return apiClient.get<QuizResult>(API_ENDPOINTS.QUIZ.RESULT_BY_ID(resultId));
  }

  // Get user quiz statistics
  async getUserStats(): Promise<QuizStats> {
    return apiClient.get<QuizStats>(API_ENDPOINTS.QUIZ.STATS);
  }

  // Helper methods for local compatibility
  async getCategoriesByLevel(
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  ): Promise<QuizCategory[]> {
    return this.getCategories(level);
  }

  async getCategoriesByChapter(chapter: number): Promise<QuizCategory[]> {
    return this.getCategories(undefined, chapter);
  }
}

export const quizService = new QuizService();
export default quizService;
