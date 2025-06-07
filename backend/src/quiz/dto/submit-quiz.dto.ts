import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  IsPositive,
} from "class-validator";
import { Type } from "class-transformer";

export class QuizAnswerDto {
  @ApiProperty({
    example: 2,
    description: "Selected answer index (0-based)",
    minimum: 0,
  })
  @IsInt({ message: "Selected answer must be an integer" })
  @Min(0, { message: "Selected answer must be 0 or greater" })
  selectedAnswer: number;
}

export class SubmitQuizDto {
  @ApiProperty({
    example: "category-uuid-here",
    description: "Quiz category ID",
  })
  @IsUUID("4", { message: "Category ID must be a valid UUID" })
  categoryId: string;

  @ApiProperty({
    type: [QuizAnswerDto],
    description: "Array of user answers",
    example: [
      { selectedAnswer: 0 },
      { selectedAnswer: 2 },
      { selectedAnswer: 1 },
    ],
  })
  @IsArray({ message: "Answers must be an array" })
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers: QuizAnswerDto[];

  @ApiProperty({
    example: 420,
    description: "Time spent on quiz in seconds",
    minimum: 1,
  })
  @IsInt({ message: "Time spent must be an integer" })
  @IsPositive({ message: "Time spent must be positive" })
  timeSpent: number;
}
