import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  Button,
  Chip,
  FAB,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";
import aiService, { CodeAnalysis } from "../services/aiService";

const colors = {
  background: "#030712",
  surface: "#0f172a",
  text: "#f9fafb",
  textSecondary: "#94a3b8",
  outline: "#334155",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  border: "#1e293b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  card: "#0f172a",
  accent: "#06b6d4",
};

const { width, height } = Dimensions.get("window");

interface CodeTemplate {
  id: string;
  title: string;
  titleTR: string;
  description: string;
  descriptionTR: string;
  code: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    id: "hello-world",
    title: "Hello World",
    titleTR: "Merhaba Dünya",
    description: "Basic C++ program",
    descriptionTR: "Temel C++ programı",
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    difficulty: "beginner",
    category: "basics",
  },
  {
    id: "variables",
    title: "Variables Example",
    titleTR: "Değişken Örneği",
    description: "Variable declaration and usage",
    descriptionTR: "Değişken bildirimi ve kullanımı",
    code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // Variable declarations
    int age = 25;
    float height = 175.5;
    char grade = 'A';
    string name = "John";
    bool isStudent = true;
    
    // Output
    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Height: " << height << " cm" << endl;
    cout << "Grade: " << grade << endl;
    cout << "Is Student: " << isStudent << endl;
    
    return 0;
}`,
    difficulty: "beginner",
    category: "basics",
  },
  {
    id: "function-example",
    title: "Functions",
    titleTR: "Fonksiyonlar",
    description: "Function definition and calling",
    descriptionTR: "Fonksiyon tanımlama ve çağırma",
    code: `#include <iostream>
using namespace std;

// Function declaration
int add(int a, int b);
void greet(string name);
int factorial(int n);

int main() {
    // Function calls
    cout << "5 + 3 = " << add(5, 3) << endl;
    greet("Alice");
    cout << "5! = " << factorial(5) << endl;
    
    return 0;
}

// Function definitions
int add(int a, int b) {
    return a + b;
}

void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
    difficulty: "intermediate",
    category: "functions",
  },
  {
    id: "class-example",
    title: "Classes",
    titleTR: "Sınıflar",
    description: "Object-oriented programming example",
    descriptionTR: "Nesne yönelimli programlama örneği",
    code: `#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int age;
    float gpa;

public:
    // Constructor
    Student(string n, int a, float g) {
        name = n;
        age = a;
        gpa = g;
    }
    
    // Getter methods
    string getName() { return name; }
    int getAge() { return age; }
    float getGPA() { return gpa; }
    
    // Method to display info
    void displayInfo() {
        cout << "Student: " << name << endl;
        cout << "Age: " << age << endl;
        cout << "GPA: " << gpa << endl;
    }
    
    // Method to check if honor student
    bool isHonorStudent() {
        return gpa >= 3.5;
    }
};

int main() {
    // Create student objects
    Student student1("Alice", 20, 3.8);
    Student student2("Bob", 19, 3.2);
    
    // Display information
    student1.displayInfo();
    cout << "Honor Student: " << (student1.isHonorStudent() ? "Yes" : "No") << endl << endl;
    
    student2.displayInfo();
    cout << "Honor Student: " << (student2.isHonorStudent() ? "Yes" : "No") << endl;
    
    return 0;
}`,
    difficulty: "advanced",
    category: "oop",
  },
];

const CodePlaygroundScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<"editor" | "templates" | "ai">(
    "editor",
  );
  const [code, setCode] = useState(codeTemplates[0].code);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [fontSize, setFontSize] = useState(isTablet() ? 16 : 14);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(
    null,
  );

  // AI-related state
  const [aiAnalysis, setAiAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<any[]>([]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Initialize with first template
  useEffect(() => {
    if (codeTemplates.length > 0) {
      setSelectedTemplate(codeTemplates[0]);
    }
  }, []);

  // Auto-analyze code when it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (code.trim() && code !== codeTemplates[0].code) {
        analyzeCodeWithAI();
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timeoutId);
  }, [code]);

  const analyzeCodeWithAI = async () => {
    if (!code.trim()) return;

    try {
      setIsAnalyzing(true);
      const analysis = await aiService.analyzeCode(code);
      setAiAnalysis(analysis);

      // Extract actionable suggestions
      const suggestions = [
        ...analysis.suggestions.slice(0, 3),
        ...analysis.improvements.slice(0, 2),
      ];
      setAiSuggestions(suggestions);
    } catch (error) {
      console.warn("AI analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTemplateSelect = (template: CodeTemplate) => {
    setCode(template.code);
    setSelectedTemplate(template);
    setShowTemplates(false);
    setOutput("");
    setAiAnalysis(null);
    setAiSuggestions([]);
  };

  const runCode = () => {
    setIsRunning(true);
    setShowOutput(true);

    // Simulate code execution
    setTimeout(() => {
      let simulatedOutput = "";

      if (code.includes("cout")) {
        const coutMatches = code.match(/cout\s*<<\s*[^;]+/g);
        if (coutMatches) {
          simulatedOutput = coutMatches
            .map((match) => {
              // Extract the content between quotes or variable names
              const content = match
                .replace(/cout\s*<<\s*/, "")
                .replace(/\s*<<\s*endl.*/, "");
              if (content.includes('"')) {
                return content.replace(/"/g, "");
              }
              return content;
            })
            .join("\n");
        }
      }

      if (!simulatedOutput) {
        simulatedOutput = "Program executed successfully.\n";
      }

      if (input) {
        simulatedOutput += `\nInput processed: ${input}`;
      }

      setOutput(simulatedOutput);
      setIsRunning(false);
    }, 1500);
  };

  const askAI = async () => {
    if (!aiQuestion.trim()) return;

    try {
      setIsAskingAi(true);
      const help = await aiService.getCodePlaygroundHelp(code, aiQuestion);

      const response = {
        question: aiQuestion,
        answer: help.explanation,
        suggestions: help.suggestions,
        timestamp: new Date().toLocaleTimeString(),
      };

      setAiChatHistory((prev) => [...prev, response]);
      setAiQuestion("");
    } catch (error) {
      Alert.alert("AI Yardım", "AI yardımı şu anda kullanılamıyor.");
    } finally {
      setIsAskingAi(false);
    }
  };

  const generateCodeFromDescription = async () => {
    Alert.prompt(
      "Kod Üretimi",
      "Yapmak istediğiniz programı açıklayın:",
      async (description) => {
        if (!description) return;

        try {
          setIsAnalyzing(true);
          const generation = await aiService.generateCode(description);
          setCode(generation.code);
          setOutput(`AI Generated Code:\n${generation.explanation}`);
          setShowOutput(true);
        } catch (error) {
          Alert.alert("Hata", "Kod üretimi başarısız oldu.");
        } finally {
          setIsAnalyzing(false);
        }
      },
    );
  };

  const explainCode = async () => {
    if (!code.trim()) return;

    try {
      setIsAnalyzing(true);
      const explanation = await aiService.explainCode(code);

      const explanationText = `
Code Explanation:
${explanation.explanation}

Key Concepts:
${explanation.concepts.map((concept) => `• ${concept}`).join("\n")}

Important Points:
${explanation.keyPoints.map((point) => `• ${point}`).join("\n")}

Difficulty Level: ${explanation.difficulty}
      `;

      setOutput(explanationText);
      setShowOutput(true);
    } catch (error) {
      Alert.alert("Hata", "Kod açıklaması alınamadı.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderTemplateCard = (template: CodeTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={[
        styles.templateCard,
        selectedTemplate?.id === template.id && styles.selectedTemplateCard,
      ]}
      onPress={() => handleTemplateSelect(template)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle}>{template.titleTR}</Text>
        <Chip
          mode="outlined"
          textStyle={[
            styles.difficultyChipText,
            {
              color:
                template.difficulty === "beginner"
                  ? colors.success
                  : template.difficulty === "intermediate"
                    ? colors.warning
                    : colors.error,
            },
          ]}
          style={[
            styles.difficultyChip,
            {
              borderColor:
                template.difficulty === "beginner"
                  ? colors.success
                  : template.difficulty === "intermediate"
                    ? colors.warning
                    : colors.error,
            },
          ]}
        >
          {template.difficulty === "beginner"
            ? "Başlangıç"
            : template.difficulty === "intermediate"
              ? "Orta"
              : "İleri"}
        </Chip>
      </View>
      <Text style={styles.templateDescription}>{template.descriptionTR}</Text>
    </TouchableOpacity>
  );

  const renderAiSuggestion = (suggestion: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionCard}
      onPress={() => {
        // You could implement applying the suggestion here
        Alert.alert("Öneri", suggestion);
      }}
    >
      <View style={styles.suggestionContent}>
        <Ionicons name="bulb" size={wp(4)} color={colors.warning} />
        <Text style={styles.suggestionText}>{suggestion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={wp(6)} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Code Playground</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowAiHelp(true)}
            >
              <Ionicons name="help-circle" size={wp(5)} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "editor" && styles.activeTab]}
          onPress={() => setActiveTab("editor")}
        >
          <Ionicons
            name="code-slash"
            size={wp(4)}
            color={
              activeTab === "editor" ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "editor" && styles.activeTabText,
            ]}
          >
            Editör
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "templates" && styles.activeTab]}
          onPress={() => setActiveTab("templates")}
        >
          <Ionicons
            name="library"
            size={wp(4)}
            color={
              activeTab === "templates" ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "templates" && styles.activeTabText,
            ]}
          >
            Şablonlar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "ai" && styles.activeTab]}
          onPress={() => setActiveTab("ai")}
        >
          <Ionicons
            name="sparkles"
            size={wp(4)}
            color={activeTab === "ai" ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[styles.tabText, activeTab === "ai" && styles.activeTabText]}
          >
            AI Asistan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === "editor" && (
          <ScrollView style={styles.editorContainer}>
            {/* Editor Toolbar */}
            <View style={styles.editorToolbar}>
              <View style={styles.toolbarLeft}>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={() => setFontSize(Math.max(12, fontSize - 1))}
                >
                  <Ionicons
                    name="remove"
                    size={wp(4)}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <Text style={styles.fontSizeText}>{fontSize}px</Text>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={() => setFontSize(Math.min(24, fontSize + 1))}
                >
                  <Ionicons
                    name="add"
                    size={wp(4)}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.toolbarRight}>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={explainCode}
                  disabled={isAnalyzing}
                >
                  <Ionicons
                    name="information-circle"
                    size={wp(4)}
                    color={colors.accent}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={generateCodeFromDescription}
                  disabled={isAnalyzing}
                >
                  <Ionicons name="flash" size={wp(4)} color={colors.warning} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={() => setCode("")}
                >
                  <Ionicons name="trash" size={wp(4)} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Code Editor */}
            <Card style={styles.editorCard}>
              <Card.Content style={styles.editorCardContent}>
                <TextInput
                  style={[styles.codeEditor, { fontSize }]}
                  value={code}
                  onChangeText={setCode}
                  placeholder="C++ kodunuzu buraya yazın..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  textAlignVertical="top"
                />
              </Card.Content>
            </Card>

            {/* AI Analysis */}
            {(isAnalyzing || aiAnalysis) && (
              <Card style={styles.analysisCard}>
                <Card.Content style={styles.analysisContent}>
                  <View style={styles.analysisHeader}>
                    <Ionicons
                      name="sparkles"
                      size={wp(5)}
                      color={colors.accent}
                    />
                    <Text style={styles.analysisTitle}>AI Analizi</Text>
                    {isAnalyzing && (
                      <ActivityIndicator size="small" color={colors.accent} />
                    )}
                  </View>

                  {aiAnalysis && (
                    <View style={styles.analysisResults}>
                      {aiAnalysis.errors.length > 0 && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>
                            ⚠️ Hatalar:
                          </Text>
                          {aiAnalysis.errors.map((error, index) => (
                            <Text key={index} style={styles.errorText}>
                              • {error}
                            </Text>
                          ))}
                        </View>
                      )}

                      {aiSuggestions.length > 0 && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>
                            💡 Öneriler:
                          </Text>
                          {aiSuggestions
                            .slice(0, 3)
                            .map((suggestion, index) => (
                              <Text
                                key={index}
                                style={styles.suggestionTextSmall}
                              >
                                • {suggestion}
                              </Text>
                            ))}
                        </View>
                      )}
                    </View>
                  )}
                </Card.Content>
              </Card>
            )}

            {/* Input Section */}
            {showInput && (
              <Card style={styles.inputCard}>
                <Card.Content>
                  <Text style={styles.inputTitle}>Program Girişi:</Text>
                  <TextInput
                    style={styles.inputField}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Program için gerekli girişi yazın..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </Card.Content>
              </Card>
            )}

            {/* Output Section */}
            {showOutput && (
              <Card style={styles.outputCard}>
                <Card.Content>
                  <Text style={styles.outputTitle}>Program Çıktısı:</Text>
                  <ScrollView style={styles.outputScrollView}>
                    <Text style={styles.outputText}>
                      {isRunning ? "Program çalışıyor..." : output}
                    </Text>
                  </ScrollView>
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        )}

        {activeTab === "templates" && (
          <ScrollView style={styles.templatesContainer}>
            <Text style={styles.sectionTitle}>Kod Şablonları</Text>
            <Text style={styles.sectionSubtitle}>
              Hazır kod örnekleri ile öğrenmeye başlayın
            </Text>

            <View style={styles.templatesGrid}>
              {codeTemplates.map(renderTemplateCard)}
            </View>
          </ScrollView>
        )}

        {activeTab === "ai" && (
          <ScrollView style={styles.aiContainer}>
            <Text style={styles.sectionTitle}>AI Kod Asistanı</Text>
            <Text style={styles.sectionSubtitle}>
              Kodunuz hakkında sorular sorun ve yardım alın
            </Text>

            {/* AI Chat History */}
            {aiChatHistory.length > 0 && (
              <View style={styles.chatHistory}>
                {aiChatHistory.map((chat, index) => (
                  <Card key={index} style={styles.chatCard}>
                    <Card.Content style={styles.chatContent}>
                      <Text style={styles.chatQuestion}>
                        ❓ {chat.question}
                      </Text>
                      <Text style={styles.chatAnswer}>🤖 {chat.answer}</Text>
                      {chat.suggestions && chat.suggestions.length > 0 && (
                        <View style={styles.chatSuggestions}>
                          <Text style={styles.chatSuggestionsTitle}>
                            Öneriler:
                          </Text>
                          {chat.suggestions
                            .slice(0, 2)
                            .map((suggestion: string, idx: number) => (
                              <Text key={idx} style={styles.chatSuggestionText}>
                                • {suggestion}
                              </Text>
                            ))}
                        </View>
                      )}
                      <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}

            {/* AI Question Input */}
            <Card style={styles.aiInputCard}>
              <Card.Content style={styles.aiInputContent}>
                <TextInput
                  style={styles.aiQuestionInput}
                  value={aiQuestion}
                  onChangeText={setAiQuestion}
                  placeholder="Kodunuz hakkında soru sorun... (örn: 'Bu kodu nasıl iyileştirebilirim?')"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
                <Button
                  mode="contained"
                  onPress={askAI}
                  disabled={isAskingAi || !aiQuestion.trim()}
                  loading={isAskingAi}
                  style={styles.askButton}
                >
                  Sor
                </Button>
              </Card.Content>
            </Card>

            {/* Quick AI Actions */}
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Hızlı Eylemler:</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => setAiQuestion("Bu kodda hangi hatalar var?")}
                >
                  <Ionicons name="bug" size={wp(5)} color={colors.error} />
                  <Text style={styles.quickActionText}>Hata Bul</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() =>
                    setAiQuestion("Bu kodu nasıl optimize edebilirim?")
                  }
                >
                  <Ionicons
                    name="speedometer"
                    size={wp(5)}
                    color={colors.accent}
                  />
                  <Text style={styles.quickActionText}>Optimize Et</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => setAiQuestion("Bu kod nasıl çalışıyor?")}
                >
                  <Ionicons
                    name="help-circle"
                    size={wp(5)}
                    color={colors.warning}
                  />
                  <Text style={styles.quickActionText}>Açıkla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() =>
                    setAiQuestion("Bu kodda güvenlik açıkları var mı?")
                  }
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={wp(5)}
                    color={colors.success}
                  />
                  <Text style={styles.quickActionText}>Güvenlik</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {activeTab === "editor" && (
          <>
            <FAB
              icon="play"
              onPress={runCode}
              style={[styles.fab, { backgroundColor: colors.success }]}
              disabled={isRunning}
            />
            <FAB
              icon="text-box"
              onPress={() => setShowInput(!showInput)}
              style={[styles.fab, { backgroundColor: colors.warning }]}
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: isTablet() ? typography.h4 : typography.h5,
    fontWeight: "700",
    color: colors.text,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    padding: spacing.md,
  },
  editorToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  toolbarRight: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  toolbarButton: {
    padding: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface,
  },
  fontSizeText: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  editorCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  editorCardContent: {
    padding: 0,
  },
  codeEditor: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: colors.text,
    padding: spacing.md,
    minHeight: hp(40),
    textAlignVertical: "top",
  },
  analysisCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  analysisContent: {
    padding: spacing.md,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  analysisTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  analysisResults: {
    gap: spacing.sm,
  },
  analysisSection: {
    marginBottom: spacing.sm,
  },
  analysisSectionTitle: {
    fontSize: typography.body2,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: typography.body2,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  suggestionTextSmall: {
    fontSize: typography.body2,
    color: colors.accent,
    marginLeft: spacing.sm,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  inputTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputField: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.sm,
    padding: spacing.md,
    color: colors.text,
    maxHeight: hp(15),
  },
  outputCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  outputTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  outputScrollView: {
    maxHeight: hp(25),
  },
  outputText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: typography.body2,
    color: colors.success,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: spacing.sm,
  },
  templatesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  templatesGrid: {
    gap: spacing.md,
  },
  templateCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    padding: spacing.md,
  },
  selectedTemplateCard: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  templateTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
  },
  templateDescription: {
    fontSize: typography.body2,
    color: colors.textSecondary,
  },
  difficultyChip: {
    backgroundColor: "transparent",
  },
  difficultyChipText: {
    fontSize: typography.caption,
    fontWeight: "500",
  },
  aiContainer: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: isTablet() ? typography.h4 : typography.h5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  chatHistory: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  chatCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
  },
  chatContent: {
    padding: spacing.md,
  },
  chatQuestion: {
    fontSize: typography.body1,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  chatAnswer: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    lineHeight: typography.body2 * 1.4,
    marginBottom: spacing.sm,
  },
  chatSuggestions: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  chatSuggestionsTitle: {
    fontSize: typography.caption,
    color: colors.accent,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  chatSuggestionText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  chatTimestamp: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: "right",
  },
  aiInputCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
  },
  aiInputContent: {
    padding: spacing.md,
  },
  aiQuestionInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.sm,
    padding: spacing.md,
    color: colors.text,
    minHeight: hp(8),
    marginBottom: spacing.md,
    textAlignVertical: "top",
  },
  askButton: {
    backgroundColor: colors.accent,
    borderRadius: spacing.sm,
  },
  quickActions: {
    marginBottom: spacing.xl,
  },
  quickActionsTitle: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  quickActionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.md,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    width: (width - spacing.md * 3 - spacing.sm) / 2,
    aspectRatio: 1.5,
  },
  quickActionText: {
    fontSize: typography.caption,
    color: colors.text,
    fontWeight: "500",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  fabContainer: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    gap: spacing.md,
  },
  fab: {
    borderRadius: wp(7),
  },
  suggestionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  suggestionText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default CodePlaygroundScreen;
