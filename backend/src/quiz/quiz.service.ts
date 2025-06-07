import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AchievementsService } from "../achievements/achievements.service";
import { QuizLevel } from "@prisma/client";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { CreateQuizCategoryDto } from "./dto/create-quiz-category.dto";
import { CreateQuizQuestionDto } from "./dto/create-quiz-question.dto";

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private achievementsService: AchievementsService,
  ) {}

  // Quiz Categories
  async getCategories(level?: QuizLevel, chapter?: number) {
    const where: any = { isActive: true };

    if (level) {
      where.level = level;
    }

    if (chapter !== undefined) {
      where.chapter = chapter;
    }

    return this.prisma.quizCategory.findMany({
      where,
      orderBy: [{ chapter: "asc" }, { order: "asc" }],
      include: {
        _count: {
          select: { questions: { where: { isActive: true } } },
        },
      },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.quizCategory.findFirst({
      where: { id, isActive: true },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            questionTR: true,
            options: true,
            optionsTR: true,
            difficulty: true,
            chapter: true,
            points: true,
            order: true,
            // Don't include correctAnswer and explanation for security
          },
        },
        _count: {
          select: { questions: { where: { isActive: true } } },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Quiz category not found");
    }

    return category;
  }

  async createCategory(createCategoryDto: CreateQuizCategoryDto) {
    return this.prisma.quizCategory.create({
      data: createCategoryDto,
    });
  }

  // Quiz Questions
  async getQuestionsByCategory(categoryId: string) {
    const questions = await this.prisma.quizQuestion.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        questionTR: true,
        options: true,
        optionsTR: true,
        difficulty: true,
        chapter: true,
        points: true,
        order: true,
        // Don't include correctAnswer and explanation
      },
    });

    if (questions.length === 0) {
      throw new NotFoundException("No questions found for this category");
    }

    return questions;
  }

  async createQuestion(createQuestionDto: CreateQuizQuestionDto) {
    // Verify category exists
    const category = await this.prisma.quizCategory.findUnique({
      where: { id: createQuestionDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException("Quiz category not found");
    }

    return this.prisma.quizQuestion.create({
      data: createQuestionDto,
    });
  }

  // Quiz Submission and Results
  async submitQuiz(userId: string, submitQuizDto: SubmitQuizDto) {
    const { categoryId, answers, timeSpent } = submitQuizDto;

    // Get category and questions
    const category = await this.prisma.quizCategory.findUnique({
      where: { id: categoryId },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Quiz category not found");
    }

    // Validate answers
    if (answers.length !== category.questions.length) {
      throw new BadRequestException("Invalid number of answers");
    }

    let score = 0;
    let correctAnswers = 0;
    const processedAnswers = [];

    // Process each answer
    for (let i = 0; i < answers.length; i++) {
      const question = category.questions[i];
      const userAnswer = answers[i];

      if (!question) {
        throw new BadRequestException(`Question ${i} not found`);
      }

      const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;

      if (isCorrect) {
        correctAnswers++;
        score += pointsEarned;
      }

      processedAnswers.push({
        questionId: question.id,
        selectedAnswer: userAnswer.selectedAnswer,
        isCorrect,
        pointsEarned,
      });
    }

    const percentage = Math.round(
      (correctAnswers / category.questions.length) * 100,
    );
    const passed = percentage >= category.passingScore;

    // Create quiz result
    const result = await this.prisma.quizResult.create({
      data: {
        userId,
        categoryId,
        score,
        totalQuestions: category.questions.length,
        correctAnswers,
        timeSpent,
        percentage,
        passed,
        completedAt: new Date(),
        answers: {
          create: processedAnswers,
        },
      },
      include: {
        category: true,
        answers: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
                questionTR: true,
                options: true,
                optionsTR: true,
                correctAnswer: true,
                explanation: true,
                explanationTR: true,
                points: true,
              },
            },
          },
        },
      },
    });

    // Update user profile statistics
    await this.updateUserStats(userId);

    // Check for achievements
    await this.achievementsService.checkQuizAchievements(userId);

    return result;
  }

  async getUserQuizResults(userId: string, limit = 20, offset = 0) {
    return this.prisma.quizResult.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { completedAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  async getQuizResult(resultId: string, userId: string) {
    const result = await this.prisma.quizResult.findFirst({
      where: {
        id: resultId,
        userId,
      },
      include: {
        category: true,
        answers: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
                questionTR: true,
                options: true,
                optionsTR: true,
                correctAnswer: true,
                explanation: true,
                explanationTR: true,
                points: true,
              },
            },
          },
          orderBy: {
            question: { order: "asc" },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException("Quiz result not found");
    }

    return result;
  }

  async getUserQuizStats(userId: string) {
    // Get overall stats
    const overallStats = await this.prisma.quizResult.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { percentage: true },
      _sum: { score: true },
    });

    // Get stats by category
    const categoryStats = await this.prisma.quizResult.groupBy({
      by: ["categoryId"],
      where: { userId },
      _count: { id: true },
      _avg: { percentage: true },
      _max: { percentage: true },
    });

    // Get category details for the stats
    const categoriesWithStats = await Promise.all(
      categoryStats.map(async (stat) => {
        const category = await this.prisma.quizCategory.findUnique({
          where: { id: stat.categoryId },
        });
        return {
          category,
          attempts: stat._count.id,
          averageScore: Math.round(stat._avg.percentage || 0),
          bestScore: Math.round(stat._max.percentage || 0),
        };
      }),
    );

    // Get completed categories
    const completedCategories = await this.prisma.quizResult.findMany({
      where: {
        userId,
        passed: true,
      },
      select: { categoryId: true },
      distinct: ["categoryId"],
    });

    // Get total available categories
    const totalCategories = await this.prisma.quizCategory.count({
      where: { isActive: true },
    });

    // Calculate streak
    const streak = await this.calculateUserStreak(userId);

    return {
      overall: {
        totalQuizzes: overallStats._count.id || 0,
        averageScore: Math.round(overallStats._avg.percentage || 0),
        totalPoints: overallStats._sum.score || 0,
        completedCategories: completedCategories.length,
        totalCategories,
        completionRate: Math.round(
          (completedCategories.length / totalCategories) * 100,
        ),
        currentStreak: streak,
      },
      byCategory: categoriesWithStats,
    };
  }

  private async updateUserStats(userId: string) {
    const stats = await this.getUserQuizStats(userId);

    await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        totalQuizzes: stats.overall.totalQuizzes,
        averageScore: stats.overall.averageScore,
        totalScore: stats.overall.totalPoints,
        streakCount: stats.overall.currentStreak,
        lastQuizDate: new Date(),
      },
      create: {
        userId,
        totalQuizzes: stats.overall.totalQuizzes,
        averageScore: stats.overall.averageScore,
        totalScore: stats.overall.totalPoints,
        streakCount: stats.overall.currentStreak,
        lastQuizDate: new Date(),
      },
    });
  }

  private async calculateUserStreak(userId: string): Promise<number> {
    const results = await this.prisma.quizResult.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      select: { completedAt: true },
    });

    if (results.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(results[0].completedAt);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < results.length; i++) {
      const resultDate = new Date(results[i].completedAt);
      resultDate.setHours(0, 0, 0, 0);

      const dayDifference = Math.floor(
        (currentDate.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (dayDifference === 1) {
        streak++;
        currentDate = resultDate;
      } else if (dayDifference > 1) {
        break;
      }
      // If dayDifference === 0, it's the same day, continue without incrementing streak
    }

    return streak;
  }

  // Admin functions
  async getAllCategories() {
    return this.prisma.quizCategory.findMany({
      orderBy: [{ chapter: "asc" }, { order: "asc" }],
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });
  }

  async getAllQuestions(categoryId?: string) {
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.quizQuestion.findMany({
      where,
      include: { category: true },
      orderBy: [{ category: { chapter: "asc" } }, { order: "asc" }],
    });
  }
}
