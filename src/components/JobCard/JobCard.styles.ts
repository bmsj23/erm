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
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: borderRadius.xl,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
      overflow: "hidden",
    },
    cardContent: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: spacing.md,
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surface,
      marginRight: spacing.md,
    },
    logoFallback: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    logoFallbackText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    headerInfo: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    company: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    bookmarkButton: {
      padding: spacing.xs,
      marginLeft: spacing.sm,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      gap: 6,
    },
    locationText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
      flex: 1,
    },
    descriptionPreview: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    chip: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    chipText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      fontWeight: fontWeight.semibold,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      paddingTop: spacing.md,
    },
    footerLeft: {
      flex: 1,
    },
    applyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
      alignSelf: "flex-start",
    },
    applyText: {
      color: "#FFFFFF",
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    salaryContainer: {
      alignItems: "flex-end",
    },
    salary: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.5,
    },
    salaryPeriod: {
      fontSize: fontSize.xs,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
    },
  });