import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "john.doe@example.com",
    description: "User email address",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @ApiProperty({
    example: "johndoe",
    description: "Unique username",
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores, and hyphens",
  })
  username: string;

  @ApiProperty({
    example: "SecurePassword123!",
    description: "User password",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  password: string;

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
}
