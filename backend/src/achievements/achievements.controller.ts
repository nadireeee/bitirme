import {
  Controller,
  Get,
  UseGuards,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { AchievementsService } from "./achievements.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("achievements")
@Controller("achievements")
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Get all available achievements" })
  @ApiResponse({
    status: 200,
    description: "Achievements retrieved successfully",
  })
  async getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @Get("user")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user achievements" })
  @ApiResponse({
    status: 200,
    description: "User achievements retrieved successfully",
  })
  async getUserAchievements(@CurrentUser("id") userId: string) {
    return this.achievementsService.getUserAchievements(userId);
  }

  @Get("leaderboard")
  @Public()
  @ApiOperation({ summary: "Get achievements leaderboard" })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
    description: "Number of top users",
  })
  @ApiResponse({
    status: 200,
    description: "Leaderboard retrieved successfully",
  })
  async getLeaderboard(
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.achievementsService.getLeaderboard(limit);
  }
}
