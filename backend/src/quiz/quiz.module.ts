import { Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { AchievementsModule } from "../achievements/achievements.module";

@Module({
  imports: [AchievementsModule],
  providers: [QuizService],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}
