import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, Matches } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: "reset-token-here",
    description: "Password reset token",
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: "NewSecurePassword123!",
    description: "New password",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  })
  password: string;
}
