import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

class SendMessageDto {
  message: string;
  codeContext?: string;
}

class AnalyzeCodeDto {
  code: string;
  language?: string;
}

class GenerateCodeDto {
  description: string;
  language?: string;
}

class ExplainCodeDto {
  code: string;
  language?: string;
}

class DebugCodeDto {
  code: string;
  error: string;
  language?: string;
}

@ApiTags("ai")
@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  // Chat Sessions
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
    @Body() body: { title?: string; context?: string },
  ) {
    return this.aiService.createChatSession(userId, body.title, body.context);
  }

  @Post("sessions/:id/messages")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Send message to AI with optional code context" })
  @ApiParam({ name: "id", description: "Session ID" })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: "Message sent successfully" })
  async sendMessage(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) sessionId: string,
    @Body() body: SendMessageDto,
  ) {
    return this.aiService.sendMessage(
      sessionId,
      userId,
      body.message,
      body.codeContext,
    );
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

  // Code Analysis & Generation
  @Post("analyze-code")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Analyze code for errors and improvements" })
  @ApiBody({ type: AnalyzeCodeDto })
  @ApiResponse({ status: 200, description: "Code analysis completed" })
  async analyzeCode(@Body() body: AnalyzeCodeDto) {
    return this.aiService.analyzeCode(body.code, body.language);
  }

  @Post("generate-code")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Generate code from description" })
  @ApiBody({ type: GenerateCodeDto })
  @ApiResponse({ status: 200, description: "Code generated successfully" })
  async generateCode(@Body() body: GenerateCodeDto) {
    return this.aiService.generateCodeSuggestion(
      body.description,
      body.language,
    );
  }

  @Post("explain-code")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Explain code concepts and functionality" })
  @ApiBody({ type: ExplainCodeDto })
  @ApiResponse({ status: 200, description: "Code explanation generated" })
  async explainCode(@Body() body: ExplainCodeDto) {
    return this.aiService.explainCode(body.code, body.language);
  }

  @Post("debug-code")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Debug code and provide solutions" })
  @ApiBody({ type: DebugCodeDto })
  @ApiResponse({ status: 200, description: "Debugging analysis completed" })
  async debugCode(@Body() body: DebugCodeDto) {
    return this.aiService.debugCode(body.code, body.error, body.language);
  }

  // Health Check
  @Get("health")
  @Public()
  @ApiOperation({ summary: "Check AI service health" })
  @ApiResponse({ status: 200, description: "AI service health status" })
  async getHealthStatus() {
    return this.aiService.checkOllamaHealth();
  }
}
