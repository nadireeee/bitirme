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
import { ForumService } from "./forum.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("forum")
@Controller("forum")
@UseGuards(JwtAuthGuard)
export class ForumController {
  constructor(private forumService: ForumService) {}

  @Get("categories")
  @Public()
  @ApiOperation({ summary: "Get forum categories" })
  @ApiResponse({
    status: 200,
    description: "Categories retrieved successfully",
  })
  async getCategories() {
    return this.forumService.getCategories();
  }

  @Get("posts")
  @Public()
  @ApiOperation({ summary: "Get forum posts" })
  @ApiQuery({
    name: "categoryId",
    required: false,
    description: "Filter by category",
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Posts per page",
  })
  @ApiQuery({
    name: "offset",
    type: Number,
    required: false,
    description: "Posts offset",
  })
  @ApiResponse({ status: 200, description: "Posts retrieved successfully" })
  async getPosts(
    @Query("categoryId") categoryId?: string,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 20,
    @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
  ) {
    return this.forumService.getPosts(categoryId, limit, offset);
  }

  @Get("posts/:id")
  @Public()
  @ApiOperation({ summary: "Get forum post by ID" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({ status: 200, description: "Post retrieved successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  async getPostById(@Param("id", ParseUUIDPipe) id: string) {
    return this.forumService.getPostById(id);
  }

  @Post("posts")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new forum post" })
  @ApiResponse({ status: 201, description: "Post created successfully" })
  async createPost(@CurrentUser("id") userId: string, @Body() data: any) {
    return this.forumService.createPost(userId, data);
  }

  @Post("posts/:id/comments")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add comment to a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({ status: 201, description: "Comment added successfully" })
  async createComment(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) postId: string,
    @Body("content") content: string,
  ) {
    return this.forumService.createComment(userId, postId, content);
  }
}
