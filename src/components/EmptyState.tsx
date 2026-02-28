import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { fontSize, fontWeight, spacing, borderRadius } from "../constants/theme";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrapper}>
        <View style={[styles.outerRing, { borderColor: colors.borderLight }]}>
          <View style={[styles.middleRing, { backgroundColor: colors.primaryLight }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name={icon} size={36} color={colors.primary} />
            </View>
          </View>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
  },
  illustrationWrapper: {
    marginBottom: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  middleRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  message: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
});

export default EmptyState;