import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type {
  RootStackParamList,
  MainTabParamList,
} from "./src/types/navigation";

// Import i18n configuration
import "./src/i18n";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import ExercisesScreen from "./src/screens/ExercisesScreen";
import CodeEditorScreen from "./src/screens/CodeEditorScreen";
import QuizScreen from "./src/screens/QuizScreen";
import ForumScreen from "./src/screens/ForumScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import AIMentorScreen from "./src/screens/AIMentorScreen";
import AIChatScreen from "./src/screens/AIChatScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CourseDetailScreen from "./src/screens/CourseDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom theme matching CodeMentor AI design
const customTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#030712",
    surface: "#0f172a",
    surfaceVariant: "#1e293b",
    outline: "#334155",
    onBackground: "#f9fafb",
    onSurface: "#f9fafb",
  },
};

function MainTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Courses":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Exercises":
              iconName = focused ? "code-slash" : "code-slash-outline";
              break;
            case "AIChat":
              iconName = focused ? "chatbubble" : "chatbubble-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#334155",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: "#0f172a",
          borderBottomColor: "#334155",
        },
        headerTintColor: "#f9fafb",
        headerTitleStyle: {
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t("navigation.home") }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ title: t("navigation.courses") }}
      />
      <Tab.Screen
        name="Exercises"
        component={ExercisesScreen}
        options={{ title: t("navigation.exercises") }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ title: t("navigation.aiChat") }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("navigation.profile") }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f172a",
        },
        headerTintColor: "#f9fafb",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CodeEditor"
        component={CodeEditorScreen}
        options={{ title: t("navigation.codeEditor") }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: t("navigation.quiz") }}
      />
      <Stack.Screen
        name="Forum"
        component={ForumScreen}
        options={{ title: t("navigation.forum") }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: t("navigation.progress") }}
      />
      <Stack.Screen
        name="AIMentor"
        component={AIMentorScreen}
        options={{ title: t("navigation.aiMentor") }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: t("navigation.courseDetail") }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PaperProvider theme={customTheme}>
          <SafeAreaProvider>
            <NavigationContainer
              theme={{
                dark: true,
                colors: {
                  primary: "#3b82f6",
                  background: "#030712",
                  card: "#0f172a",
                  text: "#f9fafb",
                  border: "#334155",
                  notification: "#3b82f6",
                },
              }}
            >
              <AppNavigator />
            </NavigationContainer>
            <StatusBar style="light" backgroundColor="#030712" />
          </SafeAreaProvider>
        </PaperProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
