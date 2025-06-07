import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, Avatar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../components/common/LanguageSwitch";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  getGridColumns,
  getCardWidth,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

const { height } = Dimensions.get("window");

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "code";
}

const AIChatScreen = () => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: t(
        "aiChat.welcome",
        "Merhaba! Ben CodeMentor AI. C ve C++ hakkında her türlü sorunuzu cevaplayabilirim. Size nasıl yardımcı olabilirim?",
      ),
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestedQuestions = [
    t("aiChat.examples.pointers"),
    t("aiChat.examples.classes"),
    t("aiChat.examples.memory"),
    t("aiChat.examples.debugging"),
    t("aiChat.examples.virtual", "Virtual function ne işe yarar?"),
    t("aiChat.examples.stl", "STL vector nasıl kullanılır?"),
  ];

  const quickActions = [
    {
      icon: "code-slash",
      label: t("aiChat.quickActions.explainCode", "Kod Açıkla"),
      description: t("aiChat.examples.debugging"),
    },
    {
      icon: "help-circle",
      label: t("aiChat.quickActions.askQuestion", "Soru Sor"),
      description: t("aiChat.examples.pointers"),
    },
    {
      icon: "book",
      label: t("aiChat.quickActions.concept", "Kavram Öğren"),
      description: t("aiChat.examples.classes"),
    },
    {
      icon: "bug",
      label: t("aiChat.quickActions.debug", "Hata Bul"),
      description: t("aiChat.examples.memory"),
    },
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    try {
      // Check if we're in web environment and have access to ollama
      if (typeof window !== "undefined") {
        // Try to make direct API call to Ollama
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3",
            prompt: `Sen bir C/C++ programlama eğitmenisin. Aşağıdaki soruya Türkçe olarak cevap ver: "${userInput}"`,
            stream: false,
            options: {
              temperature: 0.7,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            id: Date.now().toString(),
            content: data.response || "AI yanıtı alınamadı.",
            sender: "ai",
            timestamp: new Date(),
            type:
              userInput.includes("kod") || userInput.includes("```")
                ? "code"
                : "text",
          };
        }
      }

      // Fallback response
      const mockResponses = [
        "Bu çok güzel bir soru! C/C++ programlamada bu konu oldukça önemli...",
        "Bu konuyu açıklayayım: C dilinde pointer'lar bellek adreslerini tutar...",
        "C++ ile C arasındaki temel fark, C++'ın nesne yönelimli programlamayı desteklemesidir...",
        "Memory leak problemi, dinamik olarak ayrılan belleğin serbest bırakılmaması durumunda oluşur...",
      ];

      const mockContent =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];

      return {
        id: Date.now().toString(),
        content: mockContent,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        content: t(
          "aiChat.error",
          "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.",
        ),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    const currentInput = inputMessage;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Generate AI response using Ollama
      const aiResponse = await generateAIResponse(currentInput);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: t(
          "aiChat.error",
          "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.",
        ),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === "user";
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!isUser && (
          <Avatar.Icon size={32} icon="robot" style={styles.aiAvatar} />
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          {message.type === "code" ? (
            <View>
              <Text
                style={[styles.messageText, !isUser && styles.aiMessageText]}
              >
                {message.content.split("\n\n")[0]}
              </Text>
              {message.content.includes("int x = 10;") && (
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>
                    {message.content.split("\n\n")[1]}
                  </Text>
                </View>
              )}
              <Text
                style={[styles.messageText, !isUser && styles.aiMessageText]}
              >
                {message.content.split("\n\n").slice(2).join("\n\n")}
              </Text>
            </View>
          ) : (
            <Text style={[styles.messageText, !isUser && styles.aiMessageText]}>
              {message.content}
            </Text>
          )}

          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {isUser && (
          <Avatar.Icon size={32} icon="account" style={styles.userAvatar} />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#3b82f6", "#8b5cf6"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Avatar.Icon size={48} icon="robot" style={styles.headerAvatar} />
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>CodeMentor AI</Text>
              <View style={styles.statusContainer}>
                <View style={styles.onlineIndicator} />
                <Text style={styles.statusText}>
                  {t("aiChat.online", "Çevrimiçi")}
                </Text>
              </View>
            </View>
            <LanguageSwitch style={styles.languageSwitch} variant="icon" />
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScrollView}
        >
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={() => setInputMessage(action.description)}
            >
              <Ionicons name={action.icon as any} size={24} color="#3b82f6" />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
              <Text style={styles.quickActionDescription}>
                {action.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedTitle}>
            {t("aiChat.examples.title")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestedScrollView}
          >
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedChip}
                onPress={() => handleQuestionClick(question)}
              >
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}

        {isTyping && (
          <View style={styles.typingContainer}>
            <Avatar.Icon size={32} icon="robot" style={styles.aiAvatar} />
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>{t("aiChat.typing")}</Text>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder={t("aiChat.placeholder")}
            placeholderTextColor="#64748b"
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>
          {t(
            "aiChat.disclaimer",
            "AI yanıtları bilgilendirme amaçlıdır. Kritik projeler için doğrulama yapın.",
          )}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  header: {
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  languageSwitch: {
    marginLeft: 12,
  },
  quickActionsScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  quickActionCard: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f9fafb",
    marginTop: 8,
    textAlign: "center",
  },
  quickActionDescription: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
  suggestedSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 12,
  },
  suggestedScrollView: {
    flexDirection: "row",
  },
  suggestedChip: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  suggestionText: {
    fontSize: 12,
    color: "#f9fafb",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    backgroundColor: "#3b82f6",
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: "#64748b",
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#3b82f6",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#1e293b",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
  aiMessageText: {
    color: "#f9fafb",
  },
  timestamp: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  codeBlock: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#10b981",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  typingText: {
    fontSize: 14,
    color: "#f9fafb",
    marginBottom: 4,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#64748b",
    marginRight: 4,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "#0f172a",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    color: "#f9fafb",
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#374151",
  },
  disclaimer: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default AIChatScreen;
