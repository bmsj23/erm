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
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: borderRadius.full,
      paddingLeft: spacing.sm,
      paddingRight: spacing.md,
      paddingVertical: spacing.sm,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    searchTouchArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    searchIconContainer: {
      padding: spacing.sm,
    },
    text: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
  });