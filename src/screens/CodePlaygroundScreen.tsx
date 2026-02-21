import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button, FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  wp,
  hp,
  isSmallDevice,
} from "../styles/designSystem";
import aiService from "../services/aiService";

interface CodeTemplate {
  id: string;
  title: string;
  code: string;
  category: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    id: "hello-world",
    title: "Hello World",
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    category: "basics",
  },
  {
    id: "variables",
    title: "Variables",
    code: `#include <iostream>
using namespace std;

int main() {
    int age = 25;
    string name = "John";
    
    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    
    return 0;
}`,
    category: "basics",
  },
  {
    id: "functions",
    title: "Functions",
    code: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);
    cout << "Result: " << result << endl;
    return 0;
}`,
    category: "functions",
  },
];

const CodePlaygroundScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"editor" | "templates" | "ai">(
    "editor",
  );
  const [code, setCode] = useState(codeTemplates[0].code);
  const [output, setOutput] = useState("");
  const [fontSize, setFontSize] = useState(isSmallDevice() ? 14 : 16);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

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
        simulatedOutput = "Program executed successfully.";
      }

      setOutput(simulatedOutput);
      setIsRunning(false);
    }, 1000);
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;

    try {
      setIsAnalyzing(true);
      const analysis = await aiService.analyzeCode(code);
      setAiAnalysis(analysis);
    } catch (error) {
      Alert.alert("AI Analiz", "AI analizi şu anda kullanılamıyor.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectTemplate = (template: CodeTemplate) => {
    setCode(template.code);
    setShowTemplates(false);
    setOutput("");
    setAiAnalysis(null);
  };

  const renderTemplateModal = () => (
    <Modal
      visible={showTemplates}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Kod Şablonları</Text>
          <TouchableOpacity onPress={() => setShowTemplates(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.templatesList}>
          {codeTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => selectTemplate(template)}
            >
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateCategory}>{template.category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Code Playground</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowTemplates(true)}
          >
            <Ionicons name="library" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={analyzeCode}
            disabled={isAnalyzing}
          >
            <Ionicons name="sparkles" size={20} color={COLORS.warning} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Editor Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setFontSize(Math.max(12, fontSize - 1))}
          >
            <Ionicons name="remove" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.fontSizeText}>{fontSize}px</Text>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setFontSize(Math.min(20, fontSize + 1))}
          >
            <Ionicons name="add" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setCode("")}
        >
          <Ionicons name="trash" size={16} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* Code Editor */}
      <View style={styles.editorContainer}>
        <TextInput
          style={[styles.codeEditor, { fontSize }]}
          value={code}
          onChangeText={setCode}
          placeholder="C++ kodunuzu buraya yazın..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
          selectionColor={COLORS.primary}
        />
      </View>

      {/* AI Analysis */}
      {(isAnalyzing || aiAnalysis) && (
        <View style={styles.analysisContainer}>
          <View style={styles.analysisHeader}>
            <Ionicons name="sparkles" size={16} color={COLORS.warning} />
            <Text style={styles.analysisTitle}>AI Analizi</Text>
            {isAnalyzing && (
              <ActivityIndicator size="small" color={COLORS.warning} />
            )}
          </View>

          {aiAnalysis && (
            <ScrollView style={styles.analysisContent}>
              {aiAnalysis.errors?.length > 0 && (
                <View style={styles.analysisSection}>
                  <Text style={styles.analysisSectionTitle}>Hatalar:</Text>
                  {aiAnalysis.errors
                    .slice(0, 2)
                    .map((error: string, index: number) => (
                      <Text key={index} style={styles.errorText}>
                        • {error}
                      </Text>
                    ))}
                </View>
              )}

              {aiAnalysis.suggestions?.length > 0 && (
                <View style={styles.analysisSection}>
                  <Text style={styles.analysisSectionTitle}>Öneriler:</Text>
                  {aiAnalysis.suggestions
                    .slice(0, 2)
                    .map((suggestion: string, index: number) => (
                      <Text key={index} style={styles.suggestionText}>
                        • {suggestion}
                      </Text>
                    ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* Output Section */}
      {showOutput && (
        <View style={styles.outputContainer}>
          <View style={styles.outputHeader}>
            <Text style={styles.outputTitle}>Çıktı</Text>
            <TouchableOpacity onPress={() => setShowOutput(false)}>
              <Ionicons name="close" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.outputContent}>
            <Text style={styles.outputText}>
              {isRunning ? "Program çalışıyor..." : output}
            </Text>
          </View>
        </View>
      )}

      {/* Run Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={runCode}
          disabled={isRunning || !code.trim()}
          style={styles.runButton}
          contentStyle={styles.runButtonContent}
          labelStyle={styles.runButtonLabel}
          loading={isRunning}
        >
          {isRunning ? "Çalışıyor..." : "Çalıştır"}
        </Button>
      </View>

      {renderTemplateModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING[2],
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: SPACING[2],
  },
  headerButton: {
    padding: SPACING[2],
    borderRadius: RADIUS.base,
    backgroundColor: COLORS.surface,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[3],
  },
  toolbarButton: {
    padding: SPACING[2],
    borderRadius: RADIUS.base,
    backgroundColor: COLORS.background,
  },
  fontSizeText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    minWidth: 40,
    textAlign: "center",
  },
  clearButton: {
    padding: SPACING[2],
    borderRadius: RADIUS.base,
    backgroundColor: COLORS.background,
  },
  editorContainer: {
    flex: 1,
    margin: SPACING[4],
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeEditor: {
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: COLORS.text,
    padding: SPACING[4],
    textAlignVertical: "top",
    minHeight: hp(40),
  },
  analysisContainer: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[4],
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.warning,
    maxHeight: hp(20),
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING[2],
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  analysisTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    flex: 1,
  },
  analysisContent: {
    maxHeight: hp(12),
  },
  analysisSection: {
    padding: SPACING[3],
  },
  analysisSectionTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
    marginBottom: SPACING[2],
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.error,
    marginBottom: SPACING[1],
  },
  suggestionText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.info,
    marginBottom: SPACING[1],
  },
  outputContainer: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[4],
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: hp(25),
  },
  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  outputTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  outputContent: {
    padding: SPACING[3],
  },
  outputText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.success,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
  bottomContainer: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[4],
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  runButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
  },
  runButtonContent: {
    paddingVertical: SPACING[3],
  },
  runButtonLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },

  // Template Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  templatesList: {
    flex: 1,
    paddingHorizontal: SPACING[4],
  },
  templateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginVertical: SPACING[2],
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  templateTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING[1],
  },
  templateCategory: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
});

export default CodePlaygroundScreen;
