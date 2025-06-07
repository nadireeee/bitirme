import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { CourseLevel } from "@prisma/client";
import { CoursesService } from "./courses.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("courses")
@Controller("courses")
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all published courses" })
  @ApiQuery({ name: "level", enum: CourseLevel, required: false })
  @ApiResponse({ status: 200, description: "Courses retrieved successfully" })
  async getAllCourses(@Query("level") level?: CourseLevel) {
    return this.coursesService.getAllCourses(level);
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get course by ID" })
  @ApiParam({ name: "id", description: "Course ID" })
  @ApiResponse({ status: 200, description: "Course retrieved successfully" })
  @ApiResponse({ status: 404, description: "Course not found" })
  async getCourseById(@Param("id", ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Post(":id/enroll")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Enroll in a course" })
  @ApiParam({ name: "id", description: "Course ID" })
  @ApiResponse({ status: 201, description: "Successfully enrolled in course" })
  @ApiResponse({ status: 404, description: "Course not found" })
  async enrollInCourse(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) courseId: string,
  ) {
    return this.coursesService.enrollInCourse(userId, courseId);
  }

  @Get("user/enrollments")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user course enrollments" })
  @ApiResponse({
    status: 200,
    description: "Enrollments retrieved successfully",
  })
  async getUserEnrollments(@CurrentUser("id") userId: string) {
    return this.coursesService.getUserEnrollments(userId);
  }
}
