import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fallbackT } from "../i18n/fallback";
import i18n from "../i18n";

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  supportedLanguages: { code: string; name: string; nativeName: string }[];
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "app_language";

export const supportedLanguages = [
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "en", name: "English", nativeName: "English" },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>("tr"); // Default to Turkish
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set initial language from i18n if available
    if (i18n.language) {
      setCurrentLanguage(i18n.language);
    }

    // Load saved language on app start
    loadSavedLanguage();
  }, [i18n.language]);

  const loadSavedLanguage = async () => {
    try {
      setIsLoading(true);
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && savedLanguage !== currentLanguage) {
        await changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading saved language:", error);
      // Ensure we have a fallback language
      if (!currentLanguage) {
        setCurrentLanguage("tr");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language: string) => {
    try {
      // Ensure i18n is ready
      if (i18n.isInitialized) {
        await i18n.changeLanguage(language);
      } else {
        // If i18n is not ready, wait for it
        await new Promise<void>((resolve) => {
          if (i18n.isInitialized) {
            resolve();
          } else {
            i18n.on("initialized", () => {
              resolve();
            });
          }
        });
        await i18n.changeLanguage(language);
      }

      // Update state
      setCurrentLanguage(language);

      // Save to AsyncStorage
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);

      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error("Error changing language:", error);
      // At least update the state even if i18n fails
      setCurrentLanguage(language);
    }
  };

  // Fallback translation function
  const { t: i18nT } = useTranslation();

  const t = (key: string, defaultValue?: string) => {
    try {
      if (i18n.isInitialized) {
        return i18nT(key, defaultValue);
      } else {
        return fallbackT(key, defaultValue, currentLanguage);
      }
    } catch (error) {
      return fallbackT(key, defaultValue, currentLanguage);
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageProvider;
