import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  IsUUID,
} from "class-validator";
import { QuizLevel } from "@prisma/client";

export class CreateQuizQuestionDto {
  @ApiProperty({
    example: "category-uuid-here",
    description: "Quiz category ID",
  })
  @IsUUID("4")
  categoryId: string;

  @ApiProperty({
    example: "What does C++ stand for?",
    description: "Question text in English",
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  question: string;

  @ApiProperty({
    example: "C++ ne anlama gelir?",
    description: "Question text in Turkish",
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  questionTR?: string;

  @ApiProperty({
    example: [
      "C Plus Plus",
      "Computer Plus Plus",
      "Code Plus Plus",
      "Compiled Plus Plus",
    ],
    description: "Array of answer options in English",
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: [
      "C Plus Plus",
      "Bilgisayar Plus Plus",
      "Kod Plus Plus",
      "Derlenmiş Plus Plus",
    ],
    description: "Array of answer options in Turkish",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionsTR?: string[];

  @ApiProperty({
    example: 0,
    description: "Index of the correct answer (0-based)",
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  correctAnswer: number;

  @ApiProperty({
    example:
      'C++ is called "C Plus Plus" because it\'s an enhanced version of the C programming language.',
    description: "Explanation for the correct answer in English",
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  explanation: string;

  @ApiProperty({
    example:
      'C++ "C Plus Plus" olarak adlandırılır çünkü C programlama dilinin geliştirilmiş versiyonudur.',
    description: "Explanation for the correct answer in Turkish",
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  explanationTR?: string;

  @ApiProperty({
    enum: QuizLevel,
    example: QuizLevel.BEGINNER,
    description: "Question difficulty level",
  })
  @IsEnum(QuizLevel)
  difficulty: QuizLevel;

  @ApiProperty({
    example: "Introduction to C++",
    description: "Chapter name",
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  chapter: string;

  @ApiProperty({
    example: 10,
    description: "Points awarded for correct answer",
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  points: number;

  @ApiProperty({
    example: true,
    description: "Whether the question is active",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    description: "Display order within category",
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
