import apiClient from "./api";
import { API_ENDPOINTS } from "../config/api";

export interface ChatMessage {
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

export interface ChatSession {
  id: string;
  title: string;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CodeAnalysis {
  suggestions: string[];
  errors: string[];
  improvements: string[];
  explanation: string;
}

export interface CodeGeneration {
  code: string;
  explanation: string;
  complexity: "beginner" | "intermediate" | "advanced";
}

export interface CodeExplanation {
  explanation: string;
  keyPoints: string[];
  concepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface CodeDebugging {
  diagnosis: string;
  solution: string;
  fixedCode: string;
  tips: string[];
}

export interface AIHealthStatus {
  status: "connected" | "disconnected";
  model: string;
  available: boolean;
}

class AIService {
  // Chat Sessions
  async getChatSessions(): Promise<ChatSession[]> {
    return apiClient.get<ChatSession[]>(API_ENDPOINTS.AI.SESSIONS);
  }

  async getChatSession(sessionId: string): Promise<ChatSession> {
    return apiClient.get<ChatSession>(
      API_ENDPOINTS.AI.SESSION_BY_ID(sessionId),
    );
  }

  async createChatSession(
    title?: string,
    context?: string,
  ): Promise<ChatSession> {
    return apiClient.post<ChatSession>(API_ENDPOINTS.AI.CREATE_SESSION, {
      title,
      context,
    });
  }

  async sendMessage(
    sessionId: string,
    message: string,
    codeContext?: string,
  ): Promise<{ userMessage: ChatMessage; aiResponse: ChatMessage }> {
    return apiClient.post(API_ENDPOINTS.AI.SEND_MESSAGE(sessionId), {
      message,
      codeContext,
    });
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.AI.DELETE_SESSION(sessionId));
  }

  // Code Analysis & Generation
  async analyzeCode(
    code: string,
    language: string = "cpp",
  ): Promise<CodeAnalysis> {
    return apiClient.post<CodeAnalysis>("/ai/analyze-code", {
      code,
      language,
    });
  }

  async generateCode(
    description: string,
    language: string = "cpp",
  ): Promise<CodeGeneration> {
    return apiClient.post<CodeGeneration>("/ai/generate-code", {
      description,
      language,
    });
  }

  async explainCode(
    code: string,
    language: string = "cpp",
  ): Promise<CodeExplanation> {
    return apiClient.post<CodeExplanation>("/ai/explain-code", {
      code,
      language,
    });
  }

  async debugCode(
    code: string,
    error: string,
    language: string = "cpp",
  ): Promise<CodeDebugging> {
    return apiClient.post<CodeDebugging>("/ai/debug-code", {
      code,
      error,
      language,
    });
  }

  // Health Check
  async getHealthStatus(): Promise<AIHealthStatus> {
    return apiClient.get<AIHealthStatus>("/ai/health");
  }

  // Utility methods for different contexts
  async getQuizHelp(question: string, userAnswer?: string): Promise<string> {
    const context = userAnswer
      ? `Quiz question: ${question}\nUser's answer: ${userAnswer}\nPlease provide guidance.`
      : `Quiz question: ${question}\nPlease provide hints without giving the answer directly.`;

    const session = await this.createChatSession("Quiz Help", context);
    const response = await this.sendMessage(
      session.id,
      "Can you help me with this quiz question?",
    );

    return response.aiResponse.content;
  }

  async getCodePlaygroundHelp(
    code: string,
    issue?: string,
  ): Promise<{
    analysis: CodeAnalysis;
    suggestions: string[];
    explanation: string;
  }> {
    const [analysis] = await Promise.all([this.analyzeCode(code)]);

    let suggestions = analysis.suggestions;
    let explanation = analysis.explanation;

    if (issue) {
      try {
        const debugging = await this.debugCode(code, issue);
        suggestions = [...suggestions, ...debugging.tips];
        explanation = `${explanation}\n\nIssue Analysis: ${debugging.diagnosis}\nSolution: ${debugging.solution}`;
      } catch (error) {
        console.warn("Could not get debugging help:", error);
      }
    }

    return {
      analysis,
      suggestions,
      explanation,
    };
  }

  async getExerciseGuidance(
    exerciseDescription: string,
    userCode?: string,
  ): Promise<{
    hints: string[];
    codeExample: string;
    explanation: string;
  }> {
    try {
      const [generation, explanation] = await Promise.all([
        this.generateCode(`Create a solution for: ${exerciseDescription}`),
        userCode ? this.explainCode(userCode) : null,
      ]);

      let hints = [
        "Break down the problem into smaller steps",
        "Consider the input and expected output",
        "Think about which C++ concepts apply here",
      ];

      if (explanation) {
        hints = [
          ...hints,
          ...explanation.keyPoints.map((point) => `Your code: ${point}`),
        ];
      }

      return {
        hints,
        codeExample: generation.code,
        explanation: generation.explanation,
      };
    } catch (error) {
      console.warn("Could not get exercise guidance:", error);
      return {
        hints: ["Try breaking down the problem step by step"],
        codeExample: "// Code example unavailable",
        explanation: "AI assistance temporarily unavailable",
      };
    }
  }

  async getCourseHelp(
    courseContent: string,
    userQuestion: string,
  ): Promise<string> {
    const context = `Course content: ${courseContent}`;
    const session = await this.createChatSession("Course Help", context);
    const response = await this.sendMessage(session.id, userQuestion);

    return response.aiResponse.content;
  }

  // Smart code completion suggestions
  async getCodeSuggestions(
    currentCode: string,
    cursorPosition: number,
  ): Promise<string[]> {
    try {
      const beforeCursor = currentCode.substring(0, cursorPosition);
      const afterCursor = currentCode.substring(cursorPosition);

      const analysis = await this.analyzeCode(currentCode);

      // Extract meaningful suggestions based on context
      const suggestions = analysis.suggestions
        .filter((suggestion) => suggestion.length < 100) // Keep short suggestions
        .slice(0, 5); // Limit to 5 suggestions

      return suggestions;
    } catch (error) {
      console.warn("Could not get code suggestions:", error);
      return [];
    }
  }

  // Interactive learning assistance
  async getInteractiveTutorial(topic: string): Promise<{
    introduction: string;
    steps: { title: string; code: string; explanation: string }[];
    exercise: string;
  }> {
    try {
      const prompt = `Create an interactive tutorial for C++ topic: ${topic}`;
      const response = await this.generateCode(prompt);

      // Parse response to create structured tutorial
      return {
        introduction: `Let's learn about ${topic} in C++`,
        steps: [
          {
            title: "Basic Concept",
            code: response.code,
            explanation: response.explanation,
          },
        ],
        exercise: `Try implementing ${topic} yourself`,
      };
    } catch (error) {
      console.warn("Could not create tutorial:", error);
      return {
        introduction: `Tutorial for ${topic} is being prepared`,
        steps: [],
        exercise: "Practice the concepts you've learned",
      };
    }
  }
}

export const aiService = new AIService();
export default aiService;
