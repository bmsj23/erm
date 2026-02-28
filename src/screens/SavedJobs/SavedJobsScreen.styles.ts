import { StyleSheet } from "react-native";
import { PaletteType, LIGHT_PALETTE } from "../JobFinder/JobFinderScreen.styles";

export const createStyles = (topInset: number = 0, p: PaletteType = LIGHT_PALETTE) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: p.cream,
    },
    headerContainer: {
      paddingTop: topInset + 14,
      paddingBottom: 8,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 27,
      fontWeight: "800",
      color: p.charcoal,
      letterSpacing: -0.9,
    },
    headerTitleAccent: {
      color: p.deepGreen,
    },
    headerSubtitle: {
      fontSize: 14,
      color: p.slate,
      fontWeight: "500",
      marginTop: 4,
      marginBottom: 14,
    },
    deleteAllButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: p.white,
      borderWidth: 1.5,
      borderColor: p.hairline,
      gap: 6,
    },
    deleteAllText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#EF4444",
    },
    listContent: {
      paddingHorizontal: 22,
      paddingBottom: 48,
      gap: 12,
    },
  });