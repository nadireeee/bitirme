import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Delete,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async getCurrentUserProfile(@CurrentUser("id") userId: string) {
    return this.usersService.findById(userId);
  }

  @Put("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  async updateCurrentUser(
    @CurrentUser("id") userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Put("profile/details")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user profile details" })
  @ApiResponse({
    status: 200,
    description: "Profile details updated successfully",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateUserProfile(
    @CurrentUser("id") userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Get("stats")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user statistics" })
  @ApiResponse({
    status: 200,
    description: "User statistics retrieved successfully",
  })
  async getUserStats(@CurrentUser("id") userId: string) {
    return this.usersService.getUserStats(userId);
  }

  @Delete("account")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Deactivate current user account" })
  @ApiResponse({ status: 200, description: "Account deactivated successfully" })
  async deactivateAccount(@CurrentUser("id") userId: string) {
    return this.usersService.deactivateUser(userId);
  }

  // Admin endpoints
  @Get(":id")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get user by ID (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  async getUserById(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Put(":id")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update user by ID (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  async updateUserById(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete user by ID (Admin only)" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required",
  })
  async deleteUserById(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
