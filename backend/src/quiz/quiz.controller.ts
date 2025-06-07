import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { QuizLevel, UserRole } from "@prisma/client";
import { QuizService } from "./quiz.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { CreateQuizCategoryDto } from "./dto/create-quiz-category.dto";
import { CreateQuizQuestionDto } from "./dto/create-quiz-question.dto";

@ApiTags("quiz")
@Controller("quiz")
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizController {
  constructor(private quizService: QuizService) {}

  // Public endpoints
  @Get("categories")
  @Public()
  @ApiOperation({ summary: "Get quiz categories" })
  @ApiQuery({ name: "level", enum: QuizLevel, required: false })
  @ApiQuery({ name: "chapter", type: Number, required: false })
  @ApiResponse({
    status: 200,
    description: "Quiz categories retrieved successfully",
  })
  async getCategories(
    @Query("level") level?: QuizLevel,
    @Query("chapter", new ParseIntPipe({ optional: true })) chapter?: number,
  ) {
    return this.quizService.getCategories(level, chapter);
  }

  @Get("categories/:id")
  @Public()
  @ApiOperation({ summary: "Get quiz category by ID with questions" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiResponse({
    status: 200,
    description: "Quiz category retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async getCategoryById(@Param("id", ParseUUIDPipe) id: string) {
    return this.quizService.getCategoryById(id);
  }

  @Get("categories/:id/questions")
  @Public()
  @ApiOperation({ summary: "Get questions for a category" })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiResponse({ status: 200, description: "Questions retrieved successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async getQuestionsByCategory(@Param("id", ParseUUIDPipe) id: string) {
    return this.quizService.getQuestionsByCategory(id);
  }

  // User endpoints
  @Post("submit")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Submit quiz answers" })
  @ApiResponse({ status: 201, description: "Quiz submitted successfully" })
  @ApiResponse({ status: 400, description: "Invalid quiz submission" })
  @ApiResponse({ status: 404, description: "Quiz category not found" })
  async submitQuiz(
    @CurrentUser("id") userId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return this.quizService.submitQuiz(userId, submitQuizDto);
  }

  @Get("results")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user quiz results" })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Results per page",
  })
  @ApiQuery({
    name: "offset",
    type: Number,
    required: false,
    description: "Results offset",
  })
  @ApiResponse({
    status: 200,
    description: "Quiz results retrieved successfully",
  })
  async getUserQuizResults(
    @CurrentUser("id") userId: string,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 20,
    @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
  ) {
    return this.quizService.getUserQuizResults(userId, limit, offset);
  }

  @Get("results/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get specific quiz result with detailed answers" })
  @ApiParam({ name: "id", description: "Quiz result ID" })
  @ApiResponse({
    status: 200,
    description: "Quiz result retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Quiz result not found" })
  async getQuizResult(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) resultId: string,
  ) {
    return this.quizService.getQuizResult(resultId, userId);
  }

  @Get("stats")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user quiz statistics" })
  @ApiResponse({
    status: 200,
    description: "Quiz statistics retrieved successfully",
  })
  async getUserQuizStats(@CurrentUser("id") userId: string) {
    return this.quizService.getUserQuizStats(userId);
  }

  // Admin endpoints
  @Post("categories")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: "Create quiz category (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "Quiz category created successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  async createCategory(@Body() createCategoryDto: CreateQuizCategoryDto) {
    return this.quizService.createCategory(createCategoryDto);
  }

  @Post("questions")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: "Create quiz question (Admin only)" })
  @ApiResponse({
    status: 201,
    description: "Quiz question created successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  async createQuestion(@Body() createQuestionDto: CreateQuizQuestionDto) {
    return this.quizService.createQuestion(createQuestionDto);
  }

  @Get("admin/categories")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: "Get all categories (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "All categories retrieved successfully",
  })
  async getAllCategories() {
    return this.quizService.getAllCategories();
  }

  @Get("admin/questions")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: "Get all questions (Admin only)" })
  @ApiQuery({
    name: "categoryId",
    required: false,
    description: "Filter by category",
  })
  @ApiResponse({
    status: 200,
    description: "All questions retrieved successfully",
  })
  async getAllQuestions(@Query("categoryId") categoryId?: string) {
    return this.quizService.getAllQuestions(categoryId);
  }
}
