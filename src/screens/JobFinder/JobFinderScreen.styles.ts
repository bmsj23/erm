import { StyleSheet } from "react-native";

export const LIGHT_PALETTE = {
  cream: "#FAFAFA",
  white: "#FFFFFF",
  deepGreen: "#1A4F36",
  forestGreen: "#2D6A4F",
  mintGreen: "#E8F2EC",
  charcoal: "#1C1C1E",
  slate: "#6B7280",
  cloudGray: "#9CA3AF",
  hairline: "#E5E7EB",
  cardShadow: "rgba(28, 28, 30, 0.07)",
  deepShadow: "rgba(0, 0, 0, 0.12)",
  frosted: "rgba(255, 255, 255, 0.93)",
  cardBg0: "#F0F4F1",
  cardBg1: "#F4F1EC",
  cardBg2: "#EEF1F8",
  cardBg3: "#F8F0EF",
  cardBg4: "#F1EEF8",
  cardBg5: "#EDF5F0",
  cardBg6: "#F8F5ED",
};

export const DARK_PALETTE = {
  cream: "#000000",
  white: "#1C1C1E",
  deepGreen: "#10B981",
  forestGreen: "#34D399",
  mintGreen: "#14352A",
  charcoal: "#F8FAFC",
  slate: "#94A3B8",
  cloudGray: "#64748B",
  hairline: "#2C2C2E",
  cardShadow: "rgba(0, 0, 0, 0.3)",
  deepShadow: "rgba(0, 0, 0, 0.5)",
  frosted: "rgba(28, 28, 30, 0.93)",
  cardBg0: "#1C1C1E",
  cardBg1: "#1C1C1E",
  cardBg2: "#1C1C1E",
  cardBg3: "#1C1C1E",
  cardBg4: "#1C1C1E",
  cardBg5: "#1C1C1E",
  cardBg6: "#1C1C1E",
};

export type PaletteType = typeof LIGHT_PALETTE;

export const getPalette = (isDark: boolean): PaletteType =>
  isDark ? DARK_PALETTE : LIGHT_PALETTE;

// keep a default export for backward compat in non-themed contexts
export const PALETTE = LIGHT_PALETTE;

const CARD_BG_POOL_LIGHT: string[] = [
  LIGHT_PALETTE.cardBg0,
  LIGHT_PALETTE.cardBg1,
  LIGHT_PALETTE.cardBg2,
  LIGHT_PALETTE.cardBg3,
  LIGHT_PALETTE.cardBg4,
  LIGHT_PALETTE.cardBg5,
  LIGHT_PALETTE.cardBg6,
];

const CARD_BG_POOL_DARK: string[] = [
  DARK_PALETTE.cardBg0,
  DARK_PALETTE.cardBg1,
  DARK_PALETTE.cardBg2,
  DARK_PALETTE.cardBg3,
  DARK_PALETTE.cardBg4,
  DARK_PALETTE.cardBg5,
  DARK_PALETTE.cardBg6,
];

export const getCardBgColor = (seed: string, isDark: boolean = false): string => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = seed.charCodeAt(i) + ((h << 5) - h);
  }
  const pool = isDark ? CARD_BG_POOL_DARK : CARD_BG_POOL_LIGHT;
  return pool[Math.abs(h) % pool.length];
};

export const formatSalary = (min: number, max: number, currency: string): string => {
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  if (!min && !max) return "Undisclosed";
  if (!min) return `Up to ${symbol}${fmt(max)}`;
  if (!max) return `${symbol}${fmt(min)}+`;
  return `${symbol}${fmt(min)} — ${symbol}${fmt(max)}`;
};

export const createStyles = (topInset: number = 0, p: PaletteType = LIGHT_PALETTE) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: p.cream,
    },

    // header
    header: {
      backgroundColor: p.cream,
      paddingTop: topInset + 14,
      paddingBottom: 6,
      zIndex: 10,
    },
    headerInner: {
      paddingHorizontal: 22,
    },
    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },
    brandLabel: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 3.5,
      color: p.deepGreen,
      textTransform: "uppercase",
    },
    themeToggleWrap: {
      alignItems: "flex-end",
    },
    greeting: {
      fontSize: 27,
      fontWeight: "800",
      color: p.charcoal,
      letterSpacing: -0.9,
      lineHeight: 33,
      marginBottom: 18,
    },
    greetingAccent: {
      color: p.deepGreen,
    },

    // search pill
    searchPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: p.white,
      borderRadius: 999,
      paddingLeft: 18,
      paddingRight: 7,
      paddingVertical: 16,
      marginHorizontal: 22,
      shadowColor: p.deepShadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 8,
      borderWidth: 1,
      borderColor: p.hairline,
    },
    searchPillTouchArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    searchIcon: {
      marginRight: 10,
    },
    searchPlaceholder: {
      flex: 1,
      fontSize: 14,
      color: p.cloudGray,
      fontWeight: "400",
      letterSpacing: 0.1,
    },

    // filter pills
    filterRow: {
      marginTop: 14,
      marginBottom: 4,
    },
    filterRowContent: {
      paddingHorizontal: 22,
      gap: 8,
      flexDirection: "row",
      flexGrow: 1,
      justifyContent: "center",
    },
    pill: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: p.white,
      borderWidth: 1.5,
      borderColor: p.hairline,
    },
    pillActive: {
      backgroundColor: p.deepGreen,
      borderColor: p.deepGreen,
    },
    pillText: {
      fontSize: 13,
      fontWeight: "600",
      color: p.slate,
      letterSpacing: 0.1,
    },
    pillTextActive: {
      color: p.white,
    },

    // section row
    sectionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: p.charcoal,
      letterSpacing: -0.5,
    },
    sectionCount: {
      fontSize: 13,
      color: p.deepGreen,
      fontWeight: "600",
    },

    // list
    listContent: {
      paddingHorizontal: 22,
      paddingBottom: 48,
      gap: 24,
    },

    card: {
      backgroundColor: p.white,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: p.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 3,
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      gap: 14,
    },
    cardLogoBox: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: p.cream,
      alignItems: "center",
      justifyContent: "center",
    },
    cardLogo: {
      width: 40,
      height: 40,
      resizeMode: "contain",
    },
    cardLogoFallbackText: {
      fontSize: 20,
      fontWeight: "800",
      color: p.deepGreen,
    },
    cardBookmark: {
      width: 34,
      height: 34,
      borderRadius: 999,
      backgroundColor: p.cream,
      alignItems: "center",
      justifyContent: "center",
    },
    cardBody: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: p.charcoal,
      letterSpacing: -0.3,
      lineHeight: 20,
      marginBottom: 3,
    },
    cardMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 6,
    },
    cardCompany: {
      fontSize: 12,
      color: p.slate,
      fontWeight: "500",
    },
    cardMetaDivider: {
      fontSize: 12,
      color: p.cloudGray,
    },
    cardLocation: {
      fontSize: 12,
      color: p.slate,
      flex: 1,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    cardTagsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      flexShrink: 1,
      overflow: "hidden",
    },
    cardTag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: p.mintGreen,
    },
    cardTagText: {
      fontSize: 10,
      color: p.deepGreen,
      fontWeight: "700",
      letterSpacing: 0.1,
    },
    cardSalaryWrap: {
      flexShrink: 0,
      alignItems: "flex-end",
    },
    cardSalary: {
      fontSize: 13,
      fontWeight: "800",
      color: p.charcoal,
      letterSpacing: -0.3,
    },
    cardSalaryUnit: {
      fontSize: 10,
      color: p.cloudGray,
      fontWeight: "500",
    },

    // states
    errorContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    retryButton: {
      backgroundColor: p.deepGreen,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 999,
      marginTop: 16,
    },
    retryText: {
      color: p.white,
      fontSize: 15,
      fontWeight: "700",
    },
  });