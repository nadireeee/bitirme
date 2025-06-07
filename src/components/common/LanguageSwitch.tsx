import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Menu, Button, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  isTablet,
  isSmallPhone,
} from "../../utils/responsive";

interface LanguageSwitchProps {
  style?: any;
  showLabel?: boolean;
  variant?: "button" | "icon" | "text";
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  style,
  showLabel = false,
  variant = "icon",
}) => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    closeMenu();
  };

  const getCurrentLanguageName = () => {
    const current = supportedLanguages.find(
      (lang) => lang.code === currentLanguage,
    );
    return current?.nativeName || "Türkçe";
  };

  const getCurrentLanguageFlag = () => {
    switch (currentLanguage) {
      case "tr":
        return "🇹🇷";
      case "en":
        return "🇺🇸";
      default:
        return "🌐";
    }
  };

  const renderTrigger = () => {
    switch (variant) {
      case "button":
        return (
          <Button
            mode="outlined"
            onPress={openMenu}
            icon={({ size, color }) => (
              <Text style={{ fontSize: size }}>{getCurrentLanguageFlag()}</Text>
            )}
            style={[styles.button, style]}
          >
            {showLabel ? getCurrentLanguageName() : getCurrentLanguageFlag()}
          </Button>
        );

      case "text":
        return (
          <TouchableOpacity
            onPress={openMenu}
            style={[styles.textButton, style]}
          >
            <Text style={styles.flagText}>{getCurrentLanguageFlag()}</Text>
            {showLabel && (
              <Text style={styles.languageText}>
                {getCurrentLanguageName()}
              </Text>
            )}
            <Ionicons name="chevron-down" size={16} color="#64748b" />
          </TouchableOpacity>
        );

      default: // icon
        return (
          <TouchableOpacity
            onPress={openMenu}
            style={[styles.iconButton, style]}
          >
            <Text style={styles.flagIcon}>{getCurrentLanguageFlag()}</Text>
            <Ionicons name="chevron-down" size={12} color="#64748b" />
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={style}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={renderTrigger()}
        contentStyle={styles.menuContent}
      >
        {supportedLanguages.map((language, index) => (
          <React.Fragment key={language.code}>
            <Menu.Item
              onPress={() => handleLanguageChange(language.code)}
              title={
                <View style={styles.menuItem}>
                  <Text style={styles.flagText}>
                    {language.code === "tr" ? "🇹🇷" : "🇺🇸"}
                  </Text>
                  <Text
                    style={[
                      styles.languageText,
                      currentLanguage === language.code &&
                        styles.activeLanguage,
                    ]}
                  >
                    {language.nativeName}
                  </Text>
                  {currentLanguage === language.code && (
                    <Ionicons name="checkmark" size={16} color="#3b82f6" />
                  )}
                </View>
              }
              style={[
                styles.menuItemContainer,
                currentLanguage === language.code && styles.activeMenuItem,
              ]}
            />
            {index < supportedLanguages.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: "#334155",
    backgroundColor: "transparent",
  },
  textButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderWidth: 1,
    borderColor: "#334155",
  },
  flagText: {
    fontSize: 16,
    marginRight: 8,
  },
  flagIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  languageText: {
    fontSize: 14,
    color: "#f9fafb",
    fontWeight: "500",
    flex: 1,
  },
  menuContent: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  menuItemContainer: {
    backgroundColor: "transparent",
  },
  activeMenuItem: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  activeLanguage: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});

export default LanguageSwitch;
