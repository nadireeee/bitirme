import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import axios from "axios";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    codeContext?: string;
    language?: string;
    executionResult?: string;
    suggestions?: string[];
  };
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ollamaUrl: string;
  private readonly modelName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.ollamaUrl = this.configService.get(
      "OLLAMA_URL",
      "http://localhost:11434",
    );
    this.modelName = this.configService.get("OLLAMA_MODEL", "mistral");
  }

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

  async createChatSession(userId: string, title?: string, context?: string) {
    const systemMessage = this.generateSystemPrompt(context);

    return this.prisma.aiChatSession.create({
      data: {
        userId,
        title: title || "New Chat",
        messages: [systemMessage],
      },
    });
  }

  async sendMessage(
    sessionId: string,
    userId: string,
    message: string,
    codeContext?: string,
  ) {
    const session = await this.getChatSession(sessionId, userId);

    // Get current messages
    const messages = Array.isArray(session.messages) ? session.messages : [];

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      metadata: codeContext ? { codeContext } : undefined,
    };

    try {
      // Generate AI response using Ollama + Mistral
      const aiResponse = await this.generateAIResponse(messages, userMessage);

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
    } catch (error) {
      this.logger.error("Error generating AI response:", error);

      // Fallback to simple response
      const fallbackResponse = this.generateFallbackResponse(
        message,
        codeContext,
      );
      const updatedMessages = [...messages, userMessage, fallbackResponse];

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
        aiResponse: fallbackResponse,
      };
    }
  }

  async analyzeCode(
    code: string,
    language: string = "cpp",
  ): Promise<{
    suggestions: string[];
    errors: string[];
    improvements: string[];
    explanation: string;
  }> {
    try {
      const prompt = this.generateCodeAnalysisPrompt(code, language);
      const response = await this.callOllama(prompt);

      return this.parseCodeAnalysisResponse(response);
    } catch (error) {
      this.logger.error("Error analyzing code:", error);
      return {
        suggestions: ["Code analysis unavailable"],
        errors: [],
        improvements: [],
        explanation: "Unable to analyze code at this time.",
      };
    }
  }

  async generateCodeSuggestion(
    description: string,
    language: string = "cpp",
  ): Promise<{
    code: string;
    explanation: string;
    complexity: "beginner" | "intermediate" | "advanced";
  }> {
    try {
      const prompt = this.generateCodeGenerationPrompt(description, language);
      const response = await this.callOllama(prompt);

      return this.parseCodeGenerationResponse(response);
    } catch (error) {
      this.logger.error("Error generating code:", error);
      return {
        code: "// Code generation unavailable",
        explanation: "Unable to generate code at this time.",
        complexity: "beginner",
      };
    }
  }

  async explainCode(
    code: string,
    language: string = "cpp",
  ): Promise<{
    explanation: string;
    keyPoints: string[];
    concepts: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
  }> {
    try {
      const prompt = this.generateCodeExplanationPrompt(code, language);
      const response = await this.callOllama(prompt);

      return this.parseCodeExplanationResponse(response);
    } catch (error) {
      this.logger.error("Error explaining code:", error);
      return {
        explanation: "Unable to explain code at this time.",
        keyPoints: [],
        concepts: [],
        difficulty: "beginner",
      };
    }
  }

  async debugCode(
    code: string,
    error: string,
    language: string = "cpp",
  ): Promise<{
    diagnosis: string;
    solution: string;
    fixedCode: string;
    tips: string[];
  }> {
    try {
      const prompt = this.generateDebuggingPrompt(code, error, language);
      const response = await this.callOllama(prompt);

      return this.parseDebuggingResponse(response);
    } catch (error) {
      this.logger.error("Error debugging code:", error);
      return {
        diagnosis: "Unable to diagnose error at this time.",
        solution: "Please check syntax and logic manually.",
        fixedCode: code,
        tips: [],
      };
    }
  }

  private async generateAIResponse(
    messages: ChatMessage[],
    userMessage: ChatMessage,
  ): Promise<ChatMessage> {
    const conversationHistory = messages
      .filter((msg) => msg.role !== "system")
      .slice(-10) // Keep last 10 messages for context
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `You are an expert C/C++ programming tutor. You help students learn programming through clear explanations, code examples, and guided problem-solving.

Previous conversation:
${conversationHistory}

Current question: ${userMessage.content}

${userMessage.metadata?.codeContext ? `Code context:\n\`\`\`cpp\n${userMessage.metadata.codeContext}\n\`\`\`` : ""}

Provide a helpful, educational response. Include code examples when relevant. Be encouraging and clear.

Response:`;

    const response = await this.callOllama(prompt);

    return {
      id: Date.now() + 1,
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    };
  }

  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.ollamaUrl}/api/generate`,
        {
          model: this.modelName,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000,
          },
        },
        {
          timeout: 30000, // 30 second timeout
        },
      );

      if (response.data && response.data.response) {
        return response.data.response.trim();
      }

      throw new Error("Invalid response from Ollama");
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "Ollama service is not running. Please start Ollama first.",
        );
      }
      throw error;
    }
  }

  private generateSystemPrompt(context?: string): ChatMessage {
    let systemContent = `You are CodeMentor AI, an expert C/C++ programming tutor. Your role is to:

1. Help students learn C/C++ programming concepts
2. Provide clear, step-by-step explanations
3. Give practical code examples
4. Debug code and explain errors
5. Suggest best practices and improvements
6. Be encouraging and supportive

Guidelines:
- Use simple language for beginners
- Provide working code examples
- Explain the "why" behind concepts
- Encourage good programming practices
- Be patient and thorough`;

    if (context) {
      systemContent += `\n\nAdditional context: ${context}`;
    }

    return {
      id: 0,
      role: "system",
      content: systemContent,
      timestamp: new Date().toISOString(),
    };
  }

  private generateCodeAnalysisPrompt(code: string, language: string): string {
    return `Analyze this ${language} code and provide feedback:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Potential bugs or errors
2. Code improvement suggestions
3. Best practice recommendations
4. Performance considerations

Format your response as JSON:
{
  "errors": ["list of errors"],
  "suggestions": ["list of suggestions"],
  "improvements": ["list of improvements"],
  "explanation": "overall explanation"
}`;
  }

  private generateCodeGenerationPrompt(
    description: string,
    language: string,
  ): string {
    return `Generate ${language} code for: ${description}

Requirements:
1. Write clean, well-commented code
2. Follow best practices
3. Include error handling where appropriate
4. Make it educational for students

Format your response as JSON:
{
  "code": "the generated code",
  "explanation": "explanation of how it works",
  "complexity": "beginner|intermediate|advanced"
}`;
  }

  private generateCodeExplanationPrompt(
    code: string,
    language: string,
  ): string {
    return `Explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Format your response as JSON:
{
  "explanation": "detailed explanation",
  "keyPoints": ["key concepts"],
  "concepts": ["programming concepts used"],
  "difficulty": "beginner|intermediate|advanced"
}`;
  }

  private generateDebuggingPrompt(
    code: string,
    error: string,
    language: string,
  ): string {
    return `Debug this ${language} code that has an error:

Code:
\`\`\`${language}
${code}
\`\`\`

Error: ${error}

Format your response as JSON:
{
  "diagnosis": "what's wrong",
  "solution": "how to fix it",
  "fixedCode": "corrected code",
  "tips": ["debugging tips"]
}`;
  }

  private parseCodeAnalysisResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch {
      return {
        suggestions: [response],
        errors: [],
        improvements: [],
        explanation: "Analysis complete",
      };
    }
  }

  private parseCodeGenerationResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch {
      return {
        code: response,
        explanation: "Generated code",
        complexity: "beginner",
      };
    }
  }

  private parseCodeExplanationResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch {
      return {
        explanation: response,
        keyPoints: [],
        concepts: [],
        difficulty: "beginner",
      };
    }
  }

  private parseDebuggingResponse(response: string): any {
    try {
      return JSON.parse(response);
    } catch {
      return {
        diagnosis: response,
        solution: "Check the code manually",
        fixedCode: "",
        tips: [],
      };
    }
  }

  private generateFallbackResponse(
    message: string,
    codeContext?: string,
  ): ChatMessage {
    const lowerMessage = message.toLowerCase();

    let content = "";

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("merhaba")
    ) {
      content =
        "Hello! I'm CodeMentor AI, your C/C++ programming assistant. I can help you with:\n\n• Writing and debugging code\n• Explaining programming concepts\n• Code analysis and improvements\n• Problem-solving strategies\n\nWhat would you like to work on today?";
    } else if (
      lowerMessage.includes("variable") ||
      lowerMessage.includes("değişken")
    ) {
      content =
        "Variables in C++ store data values. Here's how to declare them:\n\n```cpp\nint age = 25;        // Integer\nfloat price = 99.99; // Floating point\nchar grade = 'A';    // Character\nstring name = \"John\"; // String\n```\n\nEach variable has a type that determines what kind of data it can hold.";
    } else if (
      lowerMessage.includes("function") ||
      lowerMessage.includes("fonksiyon")
    ) {
      content =
        "Functions are reusable blocks of code. Here's the basic syntax:\n\n```cpp\nreturn_type function_name(parameters) {\n    // function body\n    return value; // if needed\n}\n```\n\nExample:\n```cpp\nint add(int a, int b) {\n    return a + b;\n}\n```";
    } else if (
      lowerMessage.includes("loop") ||
      lowerMessage.includes("döngü")
    ) {
      content =
        "C++ has three main loop types:\n\n**For loop:**\n```cpp\nfor(int i = 0; i < 10; i++) {\n    cout << i << endl;\n}\n```\n\n**While loop:**\n```cpp\nwhile(condition) {\n    // code\n}\n```\n\n**Do-while loop:**\n```cpp\ndo {\n    // code\n} while(condition);\n```";
    } else if (codeContext) {
      content =
        "I can see you've shared some code! While I'm having trouble with my advanced analysis right now, here are some general tips:\n\n• Check for syntax errors (missing semicolons, brackets)\n• Verify variable declarations\n• Ensure proper include statements\n• Test with simple inputs first\n\nWould you like help with a specific part of your code?";
    } else {
      content =
        "I'm here to help with C/C++ programming! You can ask me about:\n\n• **Syntax & Concepts**: Variables, functions, loops, classes\n• **Code Review**: I can analyze and improve your code\n• **Debugging**: Help fix errors and issues\n• **Best Practices**: Writing clean, efficient code\n• **Problem Solving**: Step-by-step guidance\n\nFeel free to share your code or ask specific questions!";
    }

    return {
      id: Date.now() + 1,
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
    };
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

  // Health check for Ollama service
  async checkOllamaHealth(): Promise<{
    status: string;
    model: string;
    available: boolean;
  }> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, {
        timeout: 5000,
      });
      const models = response.data.models || [];
      const mistralAvailable = models.some((model: any) =>
        model.name.includes("mistral"),
      );

      return {
        status: "connected",
        model: this.modelName,
        available: mistralAvailable,
      };
    } catch (error) {
      return {
        status: "disconnected",
        model: this.modelName,
        available: false,
      };
    }
  }
}
