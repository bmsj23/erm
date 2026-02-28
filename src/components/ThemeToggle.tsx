import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { spacing } from "../constants/theme";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, colors, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}>
      <Ionicons
        name={isDarkMode ? "sunny-outline" : "moon-outline"}
        size={20}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
});

export default ThemeToggle;