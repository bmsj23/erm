import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.md,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text,
      paddingVertical: spacing.md,
      fontWeight: fontWeight.regular,
    },
    clearButton: {
      padding: spacing.sm,
    },
    resultInfo: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    resultText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    listContent: {
      paddingHorizontal: 22,
      paddingBottom: spacing.xxxl,
      gap: 12,
    },
  });