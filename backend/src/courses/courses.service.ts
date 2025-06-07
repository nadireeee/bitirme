import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CourseLevel } from "@prisma/client";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(level?: CourseLevel) {
    const where: any = { isPublished: true };

    if (level) {
      where.level = level;
    }

    return this.prisma.course.findMany({
      where,
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        titleTR: true,
        description: true,
        descriptionTR: true,
        level: true,
        duration: true,
        thumbnail: true,
        isFree: true,
        price: true,
        order: true,
        createdAt: true,
        _count: {
          select: {
            lessons: { where: { isPublished: true } },
            enrollments: true,
          },
        },
      },
    });
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, isPublished: true },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            titleTR: true,
            duration: true,
            order: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return course;
  }

  async enrollInCourse(userId: string, courseId: string) {
    // Check if course exists
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, isPublished: true },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    return this.prisma.courseEnrollment.create({
      data: { userId, courseId },
    });
  }

  async getUserEnrollments(userId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleTR: true,
            description: true,
            descriptionTR: true,
            level: true,
            duration: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });
  }
}
