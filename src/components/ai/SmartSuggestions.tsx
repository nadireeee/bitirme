import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import aiService from "../../services/aiService";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  isTablet,
} from "../../utils/responsive";

const colors = {
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  outline: "#334155",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

interface Suggestion {
  id: string;
  type: "quiz" | "course" | "exercise" | "topic";
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
  aiGenerated?: boolean;
}

interface SmartSuggestionsProps {
  userLevel?: "beginner" | "intermediate" | "advanced";
  recentActivity?: string[];
  onNavigate: (screen: string, params?: any) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  userLevel = "beginner",
  recentActivity = [],
  onNavigate,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState<"connected" | "disconnected">(
    "disconnected",
  );

  useEffect(() => {
    initializeSuggestions();
    checkAiStatus();
  }, [userLevel, recentActivity]);

  const checkAiStatus = async () => {
    try {
      const status = await aiService.getHealthStatus();
      setAiStatus(status.status);
    } catch (error) {
      setAiStatus("disconnected");
    }
  };

  const initializeSuggestions = async () => {
    try {
      setIsLoading(true);

      // Base suggestions based on user level
      const baseSuggestions = getBaseSuggestions();

      // Try to get AI-powered suggestions
      let aiSuggestions: Suggestion[] = [];
      if (aiStatus === "connected") {
        aiSuggestions = await generateAiSuggestions();
      }

      // Combine and prioritize suggestions
      const combinedSuggestions = [...aiSuggestions, ...baseSuggestions].slice(
        0,
        6,
      ); // Limit to 6 suggestions

      setSuggestions(combinedSuggestions);
    } catch (error) {
      console.warn("Error generating suggestions:", error);
      setSuggestions(getBaseSuggestions());
    } finally {
      setIsLoading(false);
    }
  };

  const getBaseSuggestions = (): Suggestion[] => {
    const levelBasedSuggestions = {
      beginner: [
        {
          id: "basic-quiz",
          type: "quiz" as const,
          title: "C++ Temelleri Testi",
          description: "Temel kavramları test edin",
          icon: "school",
          color: colors.success,
          action: () => onNavigate("Quiz"),
          aiGenerated: false,
        },
        {
          id: "hello-world",
          type: "exercise" as const,
          title: "İlk Programınız",
          description: "Hello World yazın",
          icon: "code-slash",
          color: colors.primary,
          action: () => onNavigate("CodePlayground"),
          aiGenerated: false,
        },
        {
          id: "variables-topic",
          type: "topic" as const,
          title: "Değişkenler",
          description: "Veri türlerini öğrenin",
          icon: "create",
          color: colors.warning,
          action: () => onNavigate("Courses"),
          aiGenerated: false,
        },
      ],
      intermediate: [
        {
          id: "functions-quiz",
          type: "quiz" as const,
          title: "Fonksiyon Testi",
          description: "Fonksiyon bilginizi test edin",
          icon: "git-branch",
          color: colors.secondary,
          action: () => onNavigate("Quiz"),
          aiGenerated: false,
        },
        {
          id: "array-exercise",
          type: "exercise" as const,
          title: "Dizi Alıştırması",
          description: "Dizi manipülasyonu yapın",
          icon: "grid",
          color: colors.accent,
          action: () => onNavigate("CodePlayground"),
          aiGenerated: false,
        },
        {
          id: "loops-topic",
          type: "topic" as const,
          title: "Döngüler",
          description: "For, while döngüleri",
          icon: "refresh",
          color: colors.warning,
          action: () => onNavigate("Courses"),
          aiGenerated: false,
        },
      ],
      advanced: [
        {
          id: "oop-quiz",
          type: "quiz" as const,
          title: "OOP Testi",
          description: "Nesne yönelimli programlama",
          icon: "cube",
          color: colors.error,
          action: () => onNavigate("Quiz"),
          aiGenerated: false,
        },
        {
          id: "algorithm-exercise",
          type: "exercise" as const,
          title: "Algoritma Çözümü",
          description: "Karmaşık problemler çözün",
          icon: "analytics",
          color: colors.secondary,
          action: () => onNavigate("CodePlayground"),
          aiGenerated: false,
        },
        {
          id: "templates-topic",
          type: "topic" as const,
          title: "Template'ler",
          description: "Generic programlama",
          icon: "layers",
          color: colors.accent,
          action: () => onNavigate("Courses"),
          aiGenerated: false,
        },
      ],
    };

    return levelBasedSuggestions[userLevel] || levelBasedSuggestions.beginner;
  };

  const generateAiSuggestions = async (): Promise<Suggestion[]> => {
    try {
      // Simulate AI-generated suggestions based on user activity
      const activityContext =
        recentActivity.length > 0
          ? `User recently worked on: ${recentActivity.join(", ")}`
          : `User is at ${userLevel} level`;

      // For now, return AI-enhanced suggestions
      // In a real implementation, you'd call your AI service
      return [
        {
          id: "ai-personalized",
          type: "topic" as const,
          title: "🤖 AI Önerisi",
          description: "Size özel öğrenme yolu",
          icon: "sparkles",
          color: colors.accent,
          action: () => onNavigate("AiTutor"),
          aiGenerated: true,
        },
      ];
    } catch (error) {
      return [];
    }
  };

  const refreshSuggestions = () => {
    initializeSuggestions();
  };

  if (isLoading) {
    return (
      <Card style={styles.container}>
        <Card.Content style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>
            Akıllı öneriler hazırlanıyor...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              style={styles.iconContainer}
            >
              <Ionicons name="sparkles" size={wp(5)} color={colors.text} />
            </LinearGradient>
            <View style={styles.headerText}>
              <Text style={styles.title}>Akıllı Öneriler</Text>
              <Text style={styles.subtitle}>
                {aiStatus === "connected" ? "🤖 AI Destekli" : "📚 Otomatik"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={refreshSuggestions}
            style={styles.refreshButton}
          >
            <Ionicons
              name="refresh"
              size={wp(5)}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Suggestions Grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionCard}
              onPress={suggestion.action}
            >
              <LinearGradient
                colors={[suggestion.color, `${suggestion.color}CC`]}
                style={styles.suggestionGradient}
              >
                <View style={styles.suggestionIconContainer}>
                  <Ionicons
                    name={suggestion.icon as any}
                    size={wp(6)}
                    color={colors.text}
                  />
                  {suggestion.aiGenerated && (
                    <View style={styles.aiIndicator}>
                      <Ionicons
                        name="sparkles"
                        size={wp(3)}
                        color={colors.accent}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionDescription}>
                    {suggestion.description}
                  </Text>

                  <View style={styles.suggestionFooter}>
                    <View style={styles.typeIndicator}>
                      <Text style={styles.typeText}>
                        {suggestion.type === "quiz"
                          ? "📝 Test"
                          : suggestion.type === "exercise"
                            ? "💻 Alıştırma"
                            : suggestion.type === "course"
                              ? "📚 Kurs"
                              : "📖 Konu"}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={wp(4)}
                      color={colors.text}
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Status Indicator */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  aiStatus === "connected" ? colors.success : colors.warning,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {aiStatus === "connected"
              ? "AI asistanı aktif - Kişiselleştirilmiş öneriler"
              : "Temel öneriler - AI bağlantısı kontrol ediliyor"}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginVertical: spacing.sm,
  },
  content: {
    padding: spacing.md,
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  refreshButton: {
    padding: spacing.xs,
  },
  suggestionsContainer: {
    paddingRight: spacing.md,
  },
  suggestionCard: {
    width: wp(65),
    marginRight: spacing.md,
  },
  suggestionGradient: {
    borderRadius: spacing.md,
    padding: spacing.md,
    minHeight: hp(18),
  },
  suggestionIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  aiIndicator: {
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    borderRadius: wp(2),
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  suggestionContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  suggestionTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  suggestionDescription: {
    fontSize: typography.body2,
    color: colors.text,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  suggestionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  typeText: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  statusIndicator: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default SmartSuggestions;
