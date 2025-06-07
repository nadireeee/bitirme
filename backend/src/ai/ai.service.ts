import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async getUserChatSessions(userId: string) {
    return this.prisma.aiChatSession.findMany({
      where: { userId, isActive: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getChatSession(sessionId: string, userId: string) {
    const session = await this.prisma.aiChatSession.findFirst({
      where: { id: sessionId, userId, isActive: true },
    });

    if (!session) {
      throw new BadRequestException("Chat session not found");
    }

    return session;
  }

  async createChatSession(userId: string, title?: string) {
    return this.prisma.aiChatSession.create({
      data: {
        userId,
        title: title || "New Chat",
        messages: [],
      },
    });
  }

  async sendMessage(sessionId: string, userId: string, message: string) {
    const session = await this.getChatSession(sessionId, userId);

    // Get current messages
    const messages = Array.isArray(session.messages) ? session.messages : [];

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Simple AI response (in production, integrate with OpenAI)
    const aiResponse = {
      id: Date.now() + 1,
      role: "assistant",
      content: this.generateSimpleResponse(message),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage, aiResponse];

    // Update session
    await this.prisma.aiChatSession.update({
      where: { id: sessionId },
      data: {
        messages: updatedMessages,
        title:
          session.title === "New Chat"
            ? this.generateTitle(message)
            : session.title,
        updatedAt: new Date(),
      },
    });

    return {
      userMessage,
      aiResponse,
    };
  }

  private generateSimpleResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("merhaba")
    ) {
      return "Hello! I'm here to help you with C/C++ programming. What would you like to learn today?";
    }

    if (
      lowerMessage.includes("variable") ||
      lowerMessage.includes("değişken")
    ) {
      return "Variables in C++ are used to store data. You can declare them using types like int, float, double, char, etc. For example: int age = 25;";
    }

    if (
      lowerMessage.includes("function") ||
      lowerMessage.includes("fonksiyon")
    ) {
      return "Functions in C++ are blocks of code that perform specific tasks. They help organize code and make it reusable. Example: int add(int a, int b) { return a + b; }";
    }

    if (lowerMessage.includes("loop") || lowerMessage.includes("döngü")) {
      return "C++ has three main types of loops: for, while, and do-while. For example: for(int i = 0; i < 10; i++) { cout << i; }";
    }

    if (lowerMessage.includes("class") || lowerMessage.includes("sınıf")) {
      return "Classes in C++ are blueprints for creating objects. They encapsulate data and functions. Example: class Person { private: string name; public: void setName(string n) { name = n; } };";
    }

    return "That's an interesting question about C++! Could you be more specific about what you'd like to know? I can help with variables, functions, loops, classes, pointers, and more.";
  }

  private generateTitle(message: string): string {
    const words = message.split(" ").slice(0, 4).join(" ");
    return words.length > 30 ? words.substring(0, 30) + "..." : words;
  }

  async deleteChatSession(sessionId: string, userId: string) {
    const session = await this.getChatSession(sessionId, userId);

    return this.prisma.aiChatSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }
}
