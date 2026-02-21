import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { QuizModule } from "./quiz/quiz.module";
import { CoursesModule } from "./courses/courses.module";
import { ForumModule } from "./forum/forum.module";
import { AiModule } from "./ai/ai.module";
import { AchievementsModule } from "./achievements/achievements.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: parseInt(process.env.THROTTLE_TTL) || 60,
        limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
      }),
    }),

    // Application modules
    PrismaModule,
    AuthModule,
    UsersModule,
    QuizModule,
    CoursesModule,
    ForumModule,
    AiModule,
    AchievementsModule,
  ],
})
export class AppModule {}
