import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { registerRootComponent } from "expo";

import type {
  RootStackParamList,
  MainTabParamList,
} from "./src/types/navigation";

// Import i18n configuration
import "./src/i18n";
import { LanguageProvider } from "./src/contexts/LanguageContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { COLORS } from "./src/styles/designSystem";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import ExercisesScreen from "./src/screens/ExercisesScreen";
import CodeEditorScreen from "./src/screens/CodeEditorScreen";
import CodePlaygroundScreen from "./src/screens/CodePlaygroundScreen";
import QuizScreen from "./src/screens/QuizScreen";
import QuizStatsScreen from "./src/screens/QuizStatsScreen";
import ForumScreen from "./src/screens/ForumScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import AIMentorScreen from "./src/screens/AIMentorScreen";
import AIChatScreen from "./src/screens/AIChatScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CourseDetailScreen from "./src/screens/CourseDetailScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Minimal theme for Paper
const paperTheme = {
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    placeholder: COLORS.textMuted,
    backdrop: "rgba(0, 0, 0, 0.5)",
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
            case "Forum":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
            case "AIChat":
              iconName = focused ? "sparkles" : "sparkles-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Ana Sayfa" }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ title: "Kurslar" }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{ title: "Forum" }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ title: "AI Chat" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="CodeEditor" component={CodeEditorScreen} />
      <Stack.Screen name="CodePlayground" component={CodePlaygroundScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizStats" component={QuizStatsScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="AIMentor" component={AIMentorScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PaperProvider theme={paperTheme}>
          <SafeAreaProvider>
            <NavigationContainer
              theme={{
                dark: false,
                colors: {
                  primary: COLORS.primary,
                  background: COLORS.background,
                  card: COLORS.surface,
                  text: COLORS.text,
                  border: COLORS.border,
                  notification: COLORS.primary,
                },
              }}
            >
              <AppNavigator />
            </NavigationContainer>
            <StatusBar style="dark" backgroundColor={COLORS.background} />
          </SafeAreaProvider>
        </PaperProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Register the main component with Expo
registerRootComponent(App);
