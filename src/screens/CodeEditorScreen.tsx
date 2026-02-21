import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button, Chip } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
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

const CodeEditorScreen = () => {
  const [code, setCode] = useState(`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::cout << "CodeMentor AI - C++ Playground!" << std::endl;

    // Bir vektör oluşturalım
    std::vector<int> numbers = {5, 2, 8, 1, 9, 3};

    // Vektörü sıralayalım
    std::sort(numbers.begin(), numbers.end());

    // Sonuçları yazdıralım
    std::cout << "Sıralanmış sayılar: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}`);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const codeTemplates = [
    {
      name: "Hello World (C++)",
      code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    },
    {
      name: "Array Operations",
      code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {1, 2, 3, 4, 5};

    for (int i = 0; i < arr.size(); i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    return 0;
}`,
    },
    {
      name: "Class Example",
      code: `#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(std::string n, int a) : name(n), age(a) {}

    void introduce() {
        std::cout << "Hi, I'm " << name << " and I'm " << age << " years old." << std::endl;
    }
};

int main() {
    Person person("Alice", 25);
    person.introduce();

    return 0;
}`,
    },
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

    // Simulate compilation and execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (code.includes("cout") && !code.includes("#include <iostream>")) {
      setOutput(
        "compilation error: 'cout' was not declared in this scope\nDid you forget to include <iostream>?",
      );
    } else {
      setOutput(
        "CodeMentor AI - C++ Playground!\nSıralanmış sayılar: 1 2 3 5 8 9\n\nProgram finished with exit code 0",
      );
    }

    setIsRunning(false);
  };

  const loadTemplate = (template: any) => {
    Alert.alert(
      "Şablon Yükle",
      "Mevcut kodunuz değiştirilecek. Devam etmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            setCode(template.code);
            setOutput("");
          },
        },
      ],
    );
  };

  const getAIHelp = () => {
    const suggestions = [
      "Bu kodda #include <iostream> eksik görünüyor.",
      "std::cout kullanmak için iostream header'ını eklemeyi unutmayın.",
      "Vector kullanımı doğru, ancak range-based for loop daha modern olurdu.",
      "main() fonksiyonu return 0 ile bitmelidir.",
    ];

    const randomSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    setOutput((prev) => prev + "\n\n🤖 AI Önerisi: " + randomSuggestion);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={["#030712", "#0f172a"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="code-slash" size={32} color="#3b82f6" />
            <Text style={styles.headerTitle}>Kod Editörü</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            C ve C++ kodlarınızı yazın, derleyin ve test edin
          </Text>
        </View>
      </LinearGradient>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.toolbarScrollView}
        >
          <Button
            mode="contained"
            onPress={runCode}
            loading={isRunning}
            disabled={isRunning}
            style={styles.runButton}
            labelStyle={styles.runButtonText}
          >
            <Ionicons name="play" size={16} color="white" />{" "}
            {isRunning ? "Çalıştırılıyor..." : "Çalıştır"}
          </Button>

          <Button
            mode="outlined"
            onPress={getAIHelp}
            style={styles.aiButton}
            labelStyle={styles.aiButtonText}
          >
            <Ionicons name="brain" size={16} color="#3b82f6" />
            {" AI Yardım"}
          </Button>

          <Button
            mode="outlined"
            style={styles.toolbarButton}
            labelStyle={styles.toolbarButtonText}
          >
            <Ionicons name="save" size={16} color="#64748b" />
            {" Kaydet"}
          </Button>

          <Button
            mode="outlined"
            style={styles.toolbarButton}
            labelStyle={styles.toolbarButtonText}
          >
            <Ionicons name="download" size={16} color="#64748b" />
            {" İndir"}
          </Button>
        </ScrollView>
      </View>

      {/* Templates */}
      <View style={styles.templatesContainer}>
        <Text style={styles.sectionTitle}>Kod Şablonları</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.templatesScrollView}
        >
          {codeTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateCard}
              onPress={() => loadTemplate(template)}
            >
              <Ionicons name="document-text" size={24} color="#3b82f6" />
              <Text style={styles.templateName}>{template.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Code Editor */}
      <Card style={styles.editorCard}>
        <Card.Content style={styles.editorContent}>
          <View style={styles.editorHeader}>
            <View style={styles.editorTitleContainer}>
              <Ionicons name="document" size={20} color="#f9fafb" />
              <Text style={styles.editorTitle}>main.cpp</Text>
            </View>
            <Chip mode="outlined" textStyle={styles.compilerText}>
              GCC 11.2
            </Chip>
          </View>

          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            placeholder="Kodunuzu buraya yazın..."
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
            fontFamily="monospace"
          />
        </Card.Content>
      </Card>

      {/* Input/Output */}
      <View style={styles.ioContainer}>
        <Card style={styles.ioCard}>
          <Card.Content style={styles.ioContent}>
            <View style={styles.ioHeader}>
              <Ionicons name="terminal" size={20} color="#f9fafb" />
              <Text style={styles.ioTitle}>Girdi</Text>
            </View>
            <TextInput
              style={styles.inputField}
              value={input}
              onChangeText={setInput}
              placeholder="Program girdi verilerinizi buraya yazın..."
              placeholderTextColor="#64748b"
              multiline
              textAlignVertical="top"
              fontFamily="monospace"
            />
          </Card.Content>
        </Card>

        <Card style={styles.ioCard}>
          <Card.Content style={styles.ioContent}>
            <View style={styles.ioHeader}>
              <Ionicons name="newspaper" size={20} color="#f9fafb" />
              <Text style={styles.ioTitle}>Çıktı</Text>
              {output && (
                <View style={styles.statusIndicator}>
                  <Ionicons
                    name={
                      output.includes("error")
                        ? "close-circle"
                        : "checkmark-circle"
                    }
                    size={16}
                    color={output.includes("error") ? "#ef4444" : "#10b981"}
                  />
                </View>
              )}
            </View>
            <ScrollView style={styles.outputContainer}>
              <Text
                style={[
                  styles.outputText,
                  output.includes("error") && styles.errorText,
                ]}
              >
                {output || "Program çıktısı burada görünecek..."}
              </Text>
            </ScrollView>
          </Card.Content>
        </Card>
      </View>

      {/* AI Suggestions */}
      <Card style={styles.suggestionsCard}>
        <Card.Content style={styles.suggestionsContent}>
          <View style={styles.suggestionsHeader}>
            <Ionicons name="bulb" size={20} color="#f59e0b" />
            <Text style={styles.suggestionsTitle}>AI Önerileri</Text>
          </View>

          <View style={styles.suggestionItem}>
            <View style={styles.suggestionDot} />
            <Text style={styles.suggestionText}>
              Range-based for loop kullanarak kodunuzu daha modern hale
              getirebilirsiniz.
            </Text>
          </View>

          <View style={styles.suggestionItem}>
            <View style={styles.suggestionDot} />
            <Text style={styles.suggestionText}>
              Vector kullanımınız güvenli ve modern C++ standartlarına uygun.
            </Text>
          </View>

          <View style={styles.suggestionItem}>
            <View style={styles.suggestionDot} />
            <Text style={styles.suggestionText}>
              const auto& kullanarak range-based for loop'u daha verimli hale
              getirebilirsiniz.
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  toolbar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  toolbarScrollView: {
    flexDirection: "row",
  },
  runButton: {
    marginRight: 12,
    borderRadius: 8,
  },
  runButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  aiButton: {
    marginRight: 12,
    borderRadius: 8,
    borderColor: "#3b82f6",
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
  },
  toolbarButton: {
    marginRight: 12,
    borderRadius: 8,
    borderColor: "#64748b",
  },
  toolbarButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
  templatesContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  templatesScrollView: {
    paddingLeft: 20,
  },
  templateCard: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginRight: 12,
    alignItems: "center",
    minWidth: 120,
  },
  templateName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f9fafb",
    marginTop: 8,
    textAlign: "center",
  },
  editorCard: {
    margin: 20,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  editorContent: {
    padding: 0,
  },
  editorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  editorTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
    marginLeft: 8,
  },
  compilerText: {
    fontSize: 12,
    color: "#64748b",
  },
  codeInput: {
    fontSize: 14,
    color: "#f9fafb",
    fontFamily: "monospace",
    minHeight: 300,
    padding: 16,
    textAlignVertical: "top",
  },
  ioContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  ioCard: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  ioContent: {
    padding: 0,
  },
  ioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  ioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
    marginLeft: 8,
  },
  statusIndicator: {
    marginLeft: "auto",
  },
  inputField: {
    fontSize: 14,
    color: "#f9fafb",
    fontFamily: "monospace",
    minHeight: 100,
    padding: 16,
    textAlignVertical: "top",
  },
  outputContainer: {
    minHeight: 100,
    maxHeight: 150,
  },
  outputText: {
    fontSize: 14,
    color: "#f9fafb",
    fontFamily: "monospace",
    padding: 16,
  },
  errorText: {
    color: "#ef4444",
  },
  suggestionsCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  suggestionsContent: {
    padding: 20,
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
    marginLeft: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  suggestionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginTop: 6,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 20,
  },
});

export default CodeEditorScreen;
