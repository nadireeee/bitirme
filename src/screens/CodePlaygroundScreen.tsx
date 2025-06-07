import React, { useState, useRef } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button, Chip, FAB } from "react-native-paper";
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
};

const { width, height } = Dimensions.get("window");

const CodePlaygroundScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);

  const [code, setCode] = useState(`#include <iostream>
#include <vector>
#include <string>

int main() {
    std::cout << "CodeMentor AI - C++ Playground!" << std::endl;
    
    // Bir vektör oluştur
    std::vector<int> numbers = {5, 2, 8, 1, 9, 3};
    
    // Vektörü yazdır
    std::cout << "Sayılar: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [showTemplates, setShowTemplates] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const codeTemplates = [
    {
      name: "Hello World (C++)",
      language: "cpp",
      code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    },
    {
      name: "Basit Hesap Makinesi",
      language: "cpp",
      code: `#include <iostream>

int main() {
    double num1, num2;
    char operation;
    
    std::cout << "İki sayı girin: ";
    std::cin >> num1 >> num2;
    
    std::cout << "İşlem (+, -, *, /): ";
    std::cin >> operation;
    
    switch(operation) {
        case '+':
            std::cout << "Sonuç: " << num1 + num2 << std::endl;
            break;
        case '-':
            std::cout << "Sonuç: " << num1 - num2 << std::endl;
            break;
        case '*':
            std::cout << "Sonuç: " << num1 * num2 << std::endl;
            break;
        case '/':
            if(num2 != 0)
                std::cout << "Sonuç: " << num1 / num2 << std::endl;
            else
                std::cout << "Hata: Sıfıra bölme!" << std::endl;
            break;
        default:
            std::cout << "Geçersiz işlem!" << std::endl;
    }
    
    return 0;
}`,
    },
    {
      name: "Array ve Loop",
      language: "cpp",
      code: `#include <iostream>

int main() {
    int numbers[5] = {10, 20, 30, 40, 50};
    int sum = 0;
    
    std::cout << "Dizideki sayılar: ";
    for(int i = 0; i < 5; i++) {
        std::cout << numbers[i] << " ";
        sum += numbers[i];
    }
    
    std::cout << std::endl;
    std::cout << "Toplam: " << sum << std::endl;
    std::cout << "Ortalama: " << sum / 5 << std::endl;
    
    return 0;
}`,
    },
    {
      name: "Simple Class (C++)",
      language: "cpp",
      code: `#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int age;
    double gpa;

public:
    Student(std::string n, int a, double g) : name(n), age(a), gpa(g) {}
    
    void displayInfo() {
        std::cout << "Ad: " << name << std::endl;
        std::cout << "Yaş: " << age << std::endl;
        std::cout << "GPA: " << gpa << std::endl;
    }
    
    void setGPA(double newGPA) {
        gpa = newGPA;
    }
};

int main() {
    Student student1("Ahmet", 20, 3.5);
    
    std::cout << "Öğrenci Bilgileri:" << std::endl;
    student1.displayInfo();
    
    student1.setGPA(3.8);
    std::cout << "\\nGüncellenmiş Bilgiler:" << std::endl;
    student1.displayInfo();
    
    return 0;
}`,
    },
  ];

  const tabs = [
    { id: "editor", title: "Editör", icon: "code-slash" },
    { id: "input", title: "Girdi", icon: "create" },
    { id: "output", title: "Çıktı", icon: "terminal" },
  ];

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab("output");

    // Simulate code execution
    const simulatedOutput = `CodeMentor AI - C++ Playground!
Sayılar: 5 2 8 1 9 3 

Program başarıyla çalıştırıldı!
Çalışma süresi: 0.043s
Bellek kullanımı: 1.2 MB`;

    setTimeout(() => {
      setOutput(simulatedOutput);
      setIsRunning(false);
    }, 2000);
  };

  const saveCode = () => {
    Alert.alert("Kod Kaydet", "Kodunuz başarıyla kaydedildi!", [
      { text: "Tamam" },
    ]);
  };

  const shareCode = () => {
    Alert.alert("Kod Paylaş", "Kod paylaşım özelliği yakında eklenecek!", [
      { text: "Tamam" },
    ]);
  };

  const clearCode = () => {
    Alert.alert("Kodu Temizle", "Tüm kod silinecek. Emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Temizle", onPress: () => setCode(""), style: "destructive" },
    ]);
  };

  const loadTemplate = (template: any) => {
    setCode(template.code);
    setShowTemplates(false);
    Alert.alert("Şablon Yüklendi", `${template.name} şablonu yüklendi!`);
  };

  const renderTemplateModal = () => (
    <Modal
      visible={showTemplates}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Kod Şablonları</Text>
          <TouchableOpacity onPress={() => setShowTemplates(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.templatesContainer}>
          {codeTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateCard}
              onPress={() => loadTemplate(template)}
            >
              <View style={styles.templateHeader}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Chip
                  mode="outlined"
                  style={styles.languageChip}
                  textStyle={styles.languageText}
                >
                  {template.language.toUpperCase()}
                </Chip>
              </View>
              <Text style={styles.templatePreview} numberOfLines={3}>
                {template.code.substring(0, 100)}...
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderEditor = () => (
    <View style={styles.tabContent}>
      <View style={styles.editorHeader}>
        <View style={styles.editorControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setFontSize(Math.max(10, fontSize - 1))}
          >
            <Ionicons name="remove" size={16} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.fontSizeText}>{fontSize}px</Text>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setFontSize(Math.min(20, fontSize + 1))}
          >
            <Ionicons name="add" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.editorActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowTemplates(true)}
          >
            <Ionicons name="library" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={clearCode}>
            <Ionicons name="trash" size={18} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={saveCode}>
            <Ionicons name="save" size={18} color={colors.success} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={shareCode}>
            <Ionicons name="share" size={18} color={colors.warning} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.codeContainer}>
        <ScrollView style={styles.lineNumbers}>
          {code.split("\n").map((_, index) => (
            <Text key={index} style={styles.lineNumber}>
              {index + 1}
            </Text>
          ))}
        </ScrollView>

        <TextInput
          style={[styles.codeInput, { fontSize }]}
          value={code}
          onChangeText={setCode}
          multiline
          scrollEnabled
          placeholder="C++ kodunuzu buraya yazın..."
          placeholderTextColor={colors.textSecondary}
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>
    </View>
  );

  const renderInput = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Program Girdisi</Text>
      <Text style={styles.sectionDescription}>
        Programınızın ihtiyaç duyduğu girdi verilerini buraya yazın
      </Text>
      <TextInput
        style={styles.inputArea}
        value={input}
        onChangeText={setInput}
        multiline
        placeholder="Girdi verilerini buraya yazın..."
        placeholderTextColor={colors.textSecondary}
        textAlignVertical="top"
      />
    </View>
  );

  const renderOutput = () => (
    <View style={styles.tabContent}>
      <View style={styles.outputHeader}>
        <Text style={styles.sectionTitle}>Program Çıktısı</Text>
        {output && (
          <TouchableOpacity
            style={styles.clearOutputButton}
            onPress={() => setOutput("")}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {isRunning ? (
        <View style={styles.runningContainer}>
          <Text style={styles.runningText}>Kod çalıştırılıyor...</Text>
          <View style={styles.loadingIndicator}>
            {[0, 1, 2].map((index) => (
              <View key={index} style={styles.loadingDot} />
            ))}
          </View>
        </View>
      ) : output ? (
        <ScrollView style={styles.outputContainer}>
          <Text style={styles.outputText}>{output}</Text>
        </ScrollView>
      ) : (
        <View style={styles.emptyOutput}>
          <Ionicons
            name="terminal-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyOutputText}>
            Kodu çalıştırmak için "Çalıştır" butonuna basın
          </Text>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "editor":
        return renderEditor();
      case "input":
        return renderInput();
      case "output":
        return renderOutput();
      default:
        return renderEditor();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Code Playground</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <Chip
          mode="flat"
          style={[styles.languageChip, { backgroundColor: colors.primary }]}
          textStyle={styles.selectedLanguageText}
        >
          C++
        </Chip>
        <Text style={styles.languageInfo}>C++17 Standard | GCC Compiler</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={
                activeTab === tab.id ? colors.primary : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab.id
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* Run Button */}
      <View style={styles.runButtonContainer}>
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runCode}
          disabled={isRunning}
        >
          <LinearGradient
            colors={
              isRunning
                ? [colors.textSecondary, colors.border]
                : [colors.success, colors.primary]
            }
            style={styles.runButtonGradient}
          >
            <Ionicons
              name={isRunning ? "hourglass" : "play"}
              size={20}
              color="white"
            />
            <Text style={styles.runButtonText}>
              {isRunning ? "Çalıştırılıyor..." : "Çalıştır"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {renderTemplateModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    paddingHorizontal: spacing.lg,
    paddingTop: isTablet() ? spacing.xl : spacing.xxl + 20,
    paddingBottom: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.h4,
    fontWeight: "700",
    color: colors.text,
  },
  headerActions: {
    ...commonStyles.row,
    gap: spacing.sm,
  },
  helpButton: {
    padding: spacing.xs,
  },
  languageSelector: {
    ...commonStyles.row,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  languageChip: {
    backgroundColor: colors.primary,
  },
  selectedLanguageText: {
    color: "white",
    fontWeight: "600",
  },
  languageInfo: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  tabsContainer: {
    ...commonStyles.row,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    ...commonStyles.row,
    ...commonStyles.center,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.body2,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: spacing.lg,
  },
  editorHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.md,
  },
  editorControls: {
    ...commonStyles.row,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    padding: spacing.xs,
    gap: spacing.sm,
  },
  controlButton: {
    width: 24,
    height: 24,
    ...commonStyles.center,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  fontSizeText: {
    fontSize: typography.caption,
    color: colors.text,
    minWidth: 30,
    textAlign: "center",
  },
  editorActions: {
    ...commonStyles.row,
    gap: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    ...commonStyles.center,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
  },
  codeContainer: {
    flex: 1,
    ...commonStyles.row,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    overflow: "hidden",
  },
  lineNumbers: {
    backgroundColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    minWidth: 40,
  },
  lineNumber: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "monospace",
  },
  codeInput: {
    flex: 1,
    padding: spacing.sm,
    color: colors.text,
    fontFamily: "monospace",
    lineHeight: 20,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: typography.h6,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inputArea: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.body1,
    fontFamily: "monospace",
    textAlignVertical: "top",
  },
  outputHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.md,
  },
  clearOutputButton: {
    padding: spacing.xs,
  },
  runningContainer: {
    flex: 1,
    ...commonStyles.center,
  },
  runningText: {
    fontSize: typography.body1,
    color: colors.text,
    marginBottom: spacing.md,
  },
  loadingIndicator: {
    ...commonStyles.row,
    gap: spacing.xs,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  outputContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
  },
  outputText: {
    color: colors.success,
    fontSize: typography.body2,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  emptyOutput: {
    flex: 1,
    ...commonStyles.center,
  },
  emptyOutputText: {
    fontSize: typography.body1,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  runButtonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  runButton: {
    borderRadius: spacing.md,
    overflow: "hidden",
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonGradient: {
    ...commonStyles.row,
    ...commonStyles.center,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  runButtonText: {
    fontSize: typography.body1,
    fontWeight: "700",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  modalHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.h4,
    fontWeight: "700",
    color: colors.text,
  },
  templatesContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  templateCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateHeader: {
    ...commonStyles.row,
    ...commonStyles.spaceBetween,
    marginBottom: spacing.sm,
  },
  templateName: {
    fontSize: typography.h6,
    fontWeight: "600",
    color: colors.text,
  },
  languageChip: {
    backgroundColor: "transparent",
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: typography.caption,
    color: colors.primary,
  },
  templatePreview: {
    fontSize: typography.body2,
    color: colors.textSecondary,
    fontFamily: "monospace",
    lineHeight: 16,
  },
});

export default CodePlaygroundScreen;
