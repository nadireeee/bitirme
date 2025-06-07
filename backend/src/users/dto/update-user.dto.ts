import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    example: "john.doe@example.com",
    description: "User email address",
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @ApiProperty({
    example: "johndoe",
    description: "Unique username",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores, and hyphens",
  })
  username?: string;

  @ApiProperty({
    example: "John",
    description: "User first name",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "First name must not exceed 50 characters" })
  firstName?: string;

  @ApiProperty({
    example: "Doe",
    description: "User last name",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "Last name must not exceed 50 characters" })
  lastName?: string;

  @ApiProperty({
    example: "https://example.com/avatar.jpg",
    description: "User avatar URL",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Avatar URL must not exceed 255 characters" })
  avatar?: string;
}
