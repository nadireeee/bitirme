import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get("CORS_ORIGIN")?.split(",") || "*",
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(configService.get("API_PREFIX") || "api");

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (configService.get("NODE_ENV") !== "production") {
    const config = new DocumentBuilder()
      .setTitle("CodeMentor AI API")
      .setDescription("API documentation for CodeMentor AI learning platform")
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth", "Authentication endpoints")
      .addTag("users", "User management endpoints")
      .addTag("quiz", "Quiz and testing endpoints")
      .addTag("courses", "Course management endpoints")
      .addTag("forum", "Forum and community endpoints")
      .addTag("ai", "AI chat and assistance endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log("Swagger documentation available at /api/docs");
  }

  const port = configService.get("PORT") || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
