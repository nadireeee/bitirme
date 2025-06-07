import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private prisma: PrismaService) {}

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { points: "asc" },
    });
  }

  async getUserAchievements(userId: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: "desc" },
    });
  }

  async checkQuizAchievements(userId: string) {
    const newAchievements: string[] = [];

    // Get user stats
    const quizStats = await this.prisma.quizResult.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { percentage: true },
    });

    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievement: { select: { key: true } } },
    });

    const earnedKeys = new Set(
      userAchievements.map((ua) => ua.achievement.key),
    );

    // First quiz completion
    if (quizStats._count.id === 1 && !earnedKeys.has("first_quiz")) {
      await this.awardAchievement(userId, "first_quiz");
      newAchievements.push("first_quiz");
    }

    // Perfect score achievement
    const perfectScoreResults = await this.prisma.quizResult.findMany({
      where: { userId, percentage: 100 },
    });

    if (perfectScoreResults.length > 0 && !earnedKeys.has("perfect_score")) {
      await this.awardAchievement(userId, "perfect_score");
      newAchievements.push("perfect_score");
    }

    // Quiz master (10 quizzes completed)
    if (quizStats._count.id >= 10 && !earnedKeys.has("quiz_master")) {
      await this.awardAchievement(userId, "quiz_master");
      newAchievements.push("quiz_master");
    }

    // High achiever (average score > 80)
    if (
      (quizStats._avg.percentage || 0) > 80 &&
      !earnedKeys.has("high_achiever")
    ) {
      await this.awardAchievement(userId, "high_achiever");
      newAchievements.push("high_achiever");
    }

    // Consistent learner (7 day streak)
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (
      (profile?.streakCount || 0) >= 7 &&
      !earnedKeys.has("consistent_learner")
    ) {
      await this.awardAchievement(userId, "consistent_learner");
      newAchievements.push("consistent_learner");
    }

    // Expert level (completed 3 advanced quizzes)
    const advancedResults = await this.prisma.quizResult.findMany({
      where: {
        userId,
        passed: true,
        category: { level: "ADVANCED" },
      },
      distinct: ["categoryId"],
    });

    if (advancedResults.length >= 3 && !earnedKeys.has("expert_level")) {
      await this.awardAchievement(userId, "expert_level");
      newAchievements.push("expert_level");
    }

    // Speed demon (completed quiz in under 30 seconds per question)
    const fastResults = await this.prisma.quizResult.findMany({
      where: {
        userId,
        passed: true,
      },
    });

    const hasFastCompletion = fastResults.some((result) => {
      const avgTimePerQuestion = result.timeSpent / result.totalQuestions;
      return avgTimePerQuestion < 30; // 30 seconds per question
    });

    if (hasFastCompletion && !earnedKeys.has("speed_demon")) {
      await this.awardAchievement(userId, "speed_demon");
      newAchievements.push("speed_demon");
    }

    if (newAchievements.length > 0) {
      this.logger.log(
        `User ${userId} earned new achievements: ${newAchievements.join(", ")}`,
      );
    }

    return newAchievements;
  }

  private async awardAchievement(userId: string, achievementKey: string) {
    try {
      const achievement = await this.prisma.achievement.findUnique({
        where: { key: achievementKey },
      });

      if (!achievement) {
        this.logger.warn(`Achievement with key ${achievementKey} not found`);
        return;
      }

      // Check if user already has this achievement
      const existingAchievement = await this.prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (existingAchievement) {
        return; // User already has this achievement
      }

      await this.prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      this.logger.log(
        `Awarded achievement ${achievementKey} to user ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to award achievement ${achievementKey} to user ${userId}:`,
        error,
      );
    }
  }

  async getLeaderboard(limit = 10) {
    const topUsers = await this.prisma.userProfile.findMany({
      take: limit,
      orderBy: [{ totalScore: "desc" }, { averageScore: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return topUsers.map((profile, index) => ({
      rank: index + 1,
      user: profile.user,
      totalScore: profile.totalScore,
      averageScore: profile.averageScore,
      totalQuizzes: profile.totalQuizzes,
      streakCount: profile.streakCount,
    }));
  }
}
