import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "event",
          level: "error",
        },
        {
          emit: "event",
          level: "info",
        },
        {
          emit: "event",
          level: "warn",
        },
      ],
    });
  }

  async onModuleInit() {
    // Log queries in development
    if (process.env.NODE_ENV === "development") {
      this.$on("query", (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.$on("error", (e) => {
      this.logger.error(e);
    });

    await this.$connect();
    this.logger.log("Connected to database");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Disconnected from database");
  }

  async cleanDatabase() {
    // This is for testing purposes only
    if (process.env.NODE_ENV === "test") {
      const models = Reflect.ownKeys(this).filter(
        (key) => key[0] !== "_" && key !== "$connect" && key !== "$disconnect",
      );

      return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    }
  }
}
