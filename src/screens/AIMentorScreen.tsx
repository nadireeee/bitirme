import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import responsive, {
  wp,
  hp,
  typography,
  spacing,
  commonStyles,
  isTablet,
  isSmallPhone,
} from "../utils/responsive";

const AIMentorScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Ionicons
            name="brain"
            size={isTablet() ? wp(15) : wp(18)}
            color="#3b82f6"
          />
          <Text style={styles.title}>AI Mentor</Text>
          <Text style={styles.description}>
            Yapay zeka destekli kişisel eğitmeniniz size özel öğrenme yol
            haritası ve öneriler sunacak.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
    padding: spacing.lg,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: spacing.lg,
    maxWidth: isTablet() ? wp(70) : "100%",
    alignSelf: "center",
  },
  content: {
    alignItems: "center",
    padding: isTablet() ? spacing.xxl * 1.5 : spacing.xxl,
  },
  title: {
    fontSize: isTablet() ? typography.h1 : typography.h3,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  description: {
    fontSize: isTablet() ? typography.h6 : typography.body1,
    color: "#64748b",
    textAlign: "center",
    lineHeight: isTablet() ? typography.h6 * 1.5 : typography.body1 * 1.5,
    paddingHorizontal: spacing.md,
  },
});

export default AIMentorScreen;
