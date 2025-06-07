import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("ai")
@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Get("sessions")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user chat sessions" })
  @ApiResponse({
    status: 200,
    description: "Chat sessions retrieved successfully",
  })
  async getUserChatSessions(@CurrentUser("id") userId: string) {
    return this.aiService.getUserChatSessions(userId);
  }

  @Get("sessions/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get chat session by ID" })
  @ApiParam({ name: "id", description: "Session ID" })
  @ApiResponse({
    status: 200,
    description: "Chat session retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Session not found" })
  async getChatSession(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) sessionId: string,
  ) {
    return this.aiService.getChatSession(sessionId, userId);
  }

  @Post("sessions")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new chat session" })
  @ApiResponse({
    status: 201,
    description: "Chat session created successfully",
  })
  async createChatSession(
    @CurrentUser("id") userId: string,
    @Body("title") title?: string,
  ) {
    return this.aiService.createChatSession(userId, title);
  }

  @Post("sessions/:id/messages")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Send message to AI" })
  @ApiParam({ name: "id", description: "Session ID" })
  @ApiResponse({ status: 200, description: "Message sent successfully" })
  async sendMessage(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) sessionId: string,
    @Body("message") message: string,
  ) {
    return this.aiService.sendMessage(sessionId, userId, message);
  }

  @Delete("sessions/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete chat session" })
  @ApiParam({ name: "id", description: "Session ID" })
  @ApiResponse({
    status: 200,
    description: "Chat session deleted successfully",
  })
  async deleteChatSession(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) sessionId: string,
  ) {
    return this.aiService.deleteChatSession(sessionId, userId);
  }
}
