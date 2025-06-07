import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
        quizResults: {
          include: {
            category: true,
          },
          orderBy: {
            completedAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Check if email or username already exists for other users
    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(updateUserDto.email
                  ? [{ email: updateUserDto.email }]
                  : []),
                ...(updateUserDto.username
                  ? [{ username: updateUserDto.username }]
                  : []),
              ],
            },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === updateUserDto.email) {
          throw new BadRequestException("Email already exists");
        }
        if (existingUser.username === updateUserDto.username) {
          throw new BadRequestException("Username already exists");
        }
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: { profile: true },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Ensure user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Update or create profile
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: updateProfileDto,
      create: {
        userId,
        ...updateProfileDto,
      },
    });

    return profile;
  }

  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Get quiz statistics
    const quizStats = await this.prisma.quizResult.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { percentage: true },
      _sum: { score: true },
    });

    // Get recent achievements
    const recentAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: "desc" },
      take: 5,
    });

    // Get course enrollments
    const courseStats = await this.prisma.courseEnrollment.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { progress: true },
    });

    // Get forum activity
    const forumStats = await this.prisma.forumPost.aggregate({
      where: { userId },
      _count: { id: true },
    });

    return {
      profile: user.profile,
      quiz: {
        totalCompleted: quizStats._count.id || 0,
        averageScore: Math.round(quizStats._avg.percentage || 0),
        totalPoints: quizStats._sum.score || 0,
      },
      courses: {
        totalEnrolled: courseStats._count.id || 0,
        averageProgress: Math.round(courseStats._avg.progress || 0),
      },
      forum: {
        totalPosts: forumStats._count.id || 0,
      },
      achievements: recentAchievements,
    };
  }

  async deactivateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async deleteUser(id: string) {
    // This will cascade delete all related records
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
