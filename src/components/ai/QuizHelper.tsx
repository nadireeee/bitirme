import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Card, Button, Portal } from "react-native-paper";
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

interface QuizHelperProps {
  question: string;
  questionTR?: string;
  options: string[];
  optionsTR?: string[];
  userAnswer?: number;
  isVisible: boolean;
  onClose: () => void;
  onHintReceived?: (hint: string) => void;
}

const QuizHelper: React.FC<QuizHelperProps> = ({
  question,
  questionTR,
  options,
  optionsTR,
  userAnswer,
  isVisible,
  onClose,
  onHintReceived,
}) => {
  const [isGettingHelp, setIsGettingHelp] = useState(false);
  const [helpResponse, setHelpResponse] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState("");
  const [showCustomQuestion, setShowCustomQuestion] = useState(false);

  const getQuizHelp = async (customQuestion?: string) => {
    try {
      setIsGettingHelp(true);

      const questionText = questionTR || question;
      const selectedOption =
        userAnswer !== undefined
          ? (optionsTR || options)[userAnswer]
          : undefined;

      let helpQuery =
        customQuestion || "Bu soruyu çözmek için ipucu verebilir misin?";

      if (selectedOption) {
        helpQuery += ` Şu cevabı seçtim: "${selectedOption}". Doğru mu?`;
      }

      const help = await aiService.getQuizHelp(questionText, selectedOption);
      setHelpResponse(help);

      if (onHintReceived) {
        onHintReceived(help);
      }
    } catch (error) {
      setHelpResponse(
        "AI yardımı şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
      );
    } finally {
      setIsGettingHelp(false);
      setUserQuestion("");
      setShowCustomQuestion(false);
    }
  };

  const quickActions = [
    {
      icon: "help-circle",
      title: "İpucu Ver",
      subtitle: "Soruyu çözmek için ipucu al",
      action: () =>
        getQuizHelp(
          "Bu soruyu çözmek için ipucu verebilir misin? Cevabı doğrudan verme, sadece yönlendir.",
        ),
    },
    {
      icon: "school",
      title: "Konuyu Açıkla",
      subtitle: "Bu sorunun konusunu öğren",
      action: () =>
        getQuizHelp(
          "Bu soru hangi C++ konusu ile ilgili? Konuyu kısaca açıklayabilir misin?",
        ),
    },
    {
      icon: "lightbulb",
      title: "Çözüm Stratejisi",
      subtitle: "Bu tür soruları nasıl çözerim?",
      action: () =>
        getQuizHelp(
          "Bu tür soruları çözmek için hangi stratejiyi kullanmalıyım? Genel yaklaşım nedir?",
        ),
    },
    {
      icon: "code",
      title: "Kod Örneği",
      subtitle: "İlgili kod örneği göster",
      action: () =>
        getQuizHelp("Bu soruyla ilgili basit bir kod örneği verebilir misin?"),
    },
  ];

  return (
    <Portal>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              style={styles.modalHeader}
            >
              <View style={styles.headerContent}>
                <Ionicons name="sparkles" size={wp(6)} color={colors.text} />
                <Text style={styles.modalTitle}>AI Quiz Asistanı</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={wp(6)} color={colors.text} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.modalContent}>
              {/* Question Preview */}
              <Card style={styles.questionCard}>
                <Card.Content style={styles.questionContent}>
                  <Text style={styles.questionText}>
                    {questionTR || question}
                  </Text>
                  {userAnswer !== undefined && (
                    <Text style={styles.selectedAnswer}>
                      Seçtiğiniz: {(optionsTR || options)[userAnswer]}
                    </Text>
                  )}
                </Card.Content>
              </Card>

              {/* Quick Actions */}
              {!helpResponse && !isGettingHelp && (
                <View style={styles.actionsContainer}>
                  <Text style={styles.actionsTitle}>
                    Ne konuda yardım istiyorsunuz?
                  </Text>

                  {quickActions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.actionButton}
                      onPress={action.action}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={wp(5)}
                        color={colors.accent}
                      />
                      <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>{action.title}</Text>
                        <Text style={styles.actionSubtitle}>
                          {action.subtitle}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={wp(4)}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}

                  {/* Custom Question */}
                  <TouchableOpacity
                    style={styles.customQuestionButton}
                    onPress={() => setShowCustomQuestion(true)}
                  >
                    <Ionicons
                      name="chatbubble"
                      size={wp(5)}
                      color={colors.secondary}
                    />
                    <Text style={styles.customQuestionText}>Özel soru sor</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Custom Question Input */}
              {showCustomQuestion && (
                <View style={styles.customQuestionContainer}>
                  <Text style={styles.customQuestionTitle}>
                    Sorunuzu yazın:
                  </Text>
                  <TextInput
                    style={styles.customQuestionInput}
                    value={userQuestion}
                    onChangeText={setUserQuestion}
                    placeholder="Bu soru hakkında merak ettiğiniz her şeyi sorabilirsiniz..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                  <View style={styles.customQuestionActions}>
                    <Button
                      mode="outlined"
                      onPress={() => setShowCustomQuestion(false)}
                      style={styles.cancelButton}
                    >
                      İptal
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => getQuizHelp(userQuestion)}
                      disabled={!userQuestion.trim()}
                      style={styles.sendButton}
                    >
                      Gönder
                    </Button>
                  </View>
                </View>
              )}

              {/* Loading */}
              {isGettingHelp && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.accent} />
                  <Text style={styles.loadingText}>AI düşünüyor...</Text>
                </View>
              )}

              {/* AI Response */}
              {helpResponse && !isGettingHelp && (
                <Card style={styles.responseCard}>
                  <Card.Content style={styles.responseContent}>
                    <View style={styles.responseHeader}>
                      <Ionicons
                        name="sparkles"
                        size={wp(5)}
                        color={colors.accent}
                      />
                      <Text style={styles.responseTitle}>AI Yanıtı</Text>
                    </View>
                    <Text style={styles.responseText}>{helpResponse}</Text>

                    <View style={styles.responseActions}>
                      <Button
                        mode="outlined"
                        onPress={() => setHelpResponse("")}
                        style={styles.newQuestionButton}
                      >
                        Yeni Soru
                      </Button>
                      <Button
                        mode="contained"
                        onPress={onClose}
                        style={styles.continueButton}
                      >
                        Devam Et
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    maxHeight: "85%",
    minHeight: "60%",
  },
  modalHeader: {
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: isTablet() ? typography.h5 : typography.h6,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: spacing.md,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    marginBottom: spacing.lg,
  },
  questionContent: {
    padding: spacing.md,
  },
  questionText: {
    fontSize: typography.body1,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  selectedAnswer: {
    fontSize: typography.body2,
    color: colors.accent,
    fontStyle: "italic",
  },
  actionsContainer: {
    flex: 1,
  },
  actionsTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  actionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  actionTitle: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  customQuestionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  customQuestionText: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.secondary,
  },
  customQuestionContainer: {
    flex: 1,
  },
  customQuestionTitle: {
    fontSize: typography.body1,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  customQuestionInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.body2,
    minHeight: hp(12),
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },
  customQuestionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.outline,
  },
  sendButton: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.body1,
    color: colors.textSecondary,
    textAlign: "center",
  },
  responseCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    flex: 1,
  },
  responseContent: {
    padding: spacing.md,
    flex: 1,
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  responseTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
  },
  responseText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    lineHeight: typography.body2 * 1.5,
    flex: 1,
    marginBottom: spacing.lg,
  },
  responseActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  newQuestionButton: {
    flex: 1,
    borderColor: colors.outline,
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.success,
  },
});

export default QuizHelper;
