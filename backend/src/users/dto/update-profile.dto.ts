import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  IsUrl,
  IsObject,
} from "class-validator";
import { ExperienceLevel } from "@prisma/client";

export class UpdateProfileDto {
  @ApiProperty({
    example: "Passionate C++ developer with 5 years of experience...",
    description: "User biography",
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Bio must not exceed 500 characters" })
  bio?: string;

  @ApiProperty({
    example: "Istanbul, Turkey",
    description: "User location",
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "Location must not exceed 100 characters" })
  location?: string;

  @ApiProperty({
    example: "https://johndoe.dev",
    description: "User website URL",
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: "Please provide a valid website URL" })
  website?: string;

  @ApiProperty({
    enum: ExperienceLevel,
    example: ExperienceLevel.INTERMEDIATE,
    description: "User experience level",
    required: false,
  })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiProperty({
    example: { theme: "dark", language: "tr" },
    description: "User preferences as JSON object",
    required: false,
  })
  @IsOptional()
  @IsObject()
  preferences?: any;
}
