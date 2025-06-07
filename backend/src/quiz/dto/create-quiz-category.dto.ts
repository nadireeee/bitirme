import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from "class-validator";
import { QuizLevel } from "@prisma/client";

export class CreateQuizCategoryDto {
  @ApiProperty({
    example: "Introduction to C++",
    description: "Category title in English",
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: "C++'a Giriş",
    description: "Category title in Turkish",
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  titleTR: string;

  @ApiProperty({
    example: "Basic concepts of C++ programming",
    description: "Category description in English",
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    example: "C++ programlamanın temel kavramları",
    description: "Category description in Turkish",
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  descriptionTR: string;

  @ApiProperty({
    enum: QuizLevel,
    example: QuizLevel.BEGINNER,
    description: "Quiz difficulty level",
  })
  @IsEnum(QuizLevel)
  level: QuizLevel;

  @ApiProperty({
    example: 1,
    description: "Chapter number",
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  chapter: number;

  @ApiProperty({
    example: "school",
    description: "Icon name for the category",
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  icon: string;

  @ApiProperty({
    example: "#3b82f6",
    description: "Color code for the category",
    maxLength: 10,
  })
  @IsString()
  @MaxLength(10)
  color: string;

  @ApiProperty({
    example: 15,
    description: "Estimated time in minutes",
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  estimatedTime: number;

  @ApiProperty({
    example: 10,
    description: "Total number of questions",
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalQuestions: number;

  @ApiProperty({
    example: 70,
    description: "Passing score percentage",
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiProperty({
    example: true,
    description: "Whether the category is active",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    description: "Display order",
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
