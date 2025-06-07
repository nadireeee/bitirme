import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import language resources
import tr from "./locales/tr.json";
import en from "./locales/en.json";

const LANGUAGE_STORAGE_KEY = "app_language";

// Synchronous language detector for better mobile compatibility
const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: (callback: (lang: string) => void) => {
    // Try to get saved language asynchronously
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((savedLanguage) => {
        callback(savedLanguage || "tr"); // Default to Turkish
      })
      .catch((error) => {
        console.error("Error loading saved language:", error);
        callback("tr"); // Fallback to Turkish
      });
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  },
};

// Initialize i18n synchronously with better error handling
const initI18n = async () => {
  try {
    await i18n
      .use(languageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          tr: {
            translation: tr,
          },
          en: {
            translation: en,
          },
        },
        lng: "tr", // Set default language immediately
        fallbackLng: "tr",
        debug: false, // Disable debug to reduce console warnings
        returnObjects: true, // Enable object returns for nested translations
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        // Add compatibility options for mobile
        compatibilityJSON: "v3",

        // Ensure immediate availability
        initImmediate: false,
      });

    console.log("i18n initialized successfully");
  } catch (error) {
    console.error("Error initializing i18n:", error);
    // Fallback initialization without AsyncStorage
    await i18n.init({
      resources: {
        tr: { translation: tr },
        en: { translation: en },
      },
      lng: "tr",
      fallbackLng: "tr",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
  }
};

// Initialize immediately
initI18n();

export default i18n;
