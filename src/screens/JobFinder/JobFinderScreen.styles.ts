import { StyleSheet } from "react-native";

export const PALETTE = {
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
} as const;

const CARD_BG_POOL: string[] = [
  PALETTE.cardBg0,
  PALETTE.cardBg1,
  PALETTE.cardBg2,
  PALETTE.cardBg3,
  PALETTE.cardBg4,
  PALETTE.cardBg5,
  PALETTE.cardBg6,
];

export const getCardBgColor = (seed: string): string => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = seed.charCodeAt(i) + ((h << 5) - h);
  }
  return CARD_BG_POOL[Math.abs(h) % CARD_BG_POOL.length];
};

export const formatSalary = (min: number, max: number, currency: string): string => {
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`);
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  if (!min && !max) return "Competitive";
  if (!min) return `Up to ${symbol}${fmt(max)}`;
  if (!max) return `${symbol}${fmt(min)}+`;
  return `${symbol}${fmt(min)} — ${symbol}${fmt(max)}`;
};

export const createStyles = (topInset: number = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: PALETTE.cream,
    },

    // header
    header: {
      backgroundColor: PALETTE.cream,
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
      color: PALETTE.deepGreen,
      textTransform: "uppercase",
    },
    themeToggleWrap: {
      alignItems: "flex-end",
    },
    greeting: {
      fontSize: 27,
      fontWeight: "800",
      color: PALETTE.charcoal,
      letterSpacing: -0.9,
      lineHeight: 33,
      marginBottom: 18,
    },
    greetingAccent: {
      color: PALETTE.deepGreen,
    },

    // search pill
    searchPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: PALETTE.white,
      borderRadius: 999,
      paddingLeft: 18,
      paddingRight: 7,
      paddingVertical: 11,
      marginHorizontal: 22,
      shadowColor: PALETTE.deepShadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 8,
      borderWidth: 1,
      borderColor: PALETTE.hairline,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchPlaceholder: {
      flex: 1,
      fontSize: 14,
      color: PALETTE.cloudGray,
      fontWeight: "400",
      letterSpacing: 0.1,
    },
    searchFilterDot: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: PALETTE.deepGreen,
      alignItems: "center",
      justifyContent: "center",
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
    },
    pill: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: PALETTE.white,
      borderWidth: 1.5,
      borderColor: PALETTE.hairline,
    },
    pillActive: {
      backgroundColor: PALETTE.deepGreen,
      borderColor: PALETTE.deepGreen,
    },
    pillText: {
      fontSize: 13,
      fontWeight: "600",
      color: PALETTE.slate,
      letterSpacing: 0.1,
    },
    pillTextActive: {
      color: PALETTE.white,
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
      color: PALETTE.charcoal,
      letterSpacing: -0.5,
    },
    sectionCount: {
      fontSize: 13,
      color: PALETTE.deepGreen,
      fontWeight: "600",
    },

    // list
    listContent: {
      paddingHorizontal: 22,
      paddingBottom: 48,
      gap: 24,
    },

    // airbnb-style card
    card: {
      backgroundColor: PALETTE.white,
      borderRadius: 22,
      overflow: "hidden",
      shadowColor: PALETTE.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 18,
      elevation: 4,
    },
    cardHero: {
      width: "100%",
      height: 210,
      alignItems: "center",
      justifyContent: "center",
    },
    cardLogoBox: {
      width: 88,
      height: 88,
      borderRadius: 22,
      backgroundColor: PALETTE.white,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 3,
    },
    cardLogo: {
      width: 64,
      height: 64,
      resizeMode: "contain",
    },
    cardLogoFallbackText: {
      fontSize: 30,
      fontWeight: "800",
      color: PALETTE.deepGreen,
    },
    cardBookmark: {
      position: "absolute",
      top: 14,
      right: 14,
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: PALETTE.frosted,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardWorkBadge: {
      position: "absolute",
      top: 14,
      left: 14,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: PALETTE.frosted,
    },
    cardWorkBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: PALETTE.deepGreen,
      letterSpacing: 0.3,
    },
    cardBody: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 18,
      borderTopWidth: 1,
      borderTopColor: "#F3F4F6",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: PALETTE.charcoal,
      letterSpacing: -0.4,
      lineHeight: 22,
      marginBottom: 6,
    },
    cardMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 14,
    },
    cardCompany: {
      fontSize: 13,
      color: PALETTE.slate,
      fontWeight: "500",
    },
    cardMetaDivider: {
      fontSize: 13,
      color: PALETTE.cloudGray,
    },
    cardLocation: {
      fontSize: 13,
      color: PALETTE.slate,
      flex: 1,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    cardTagsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
      flexWrap: "nowrap",
    },
    cardTag: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: PALETTE.mintGreen,
    },
    cardTagText: {
      fontSize: 11,
      color: PALETTE.deepGreen,
      fontWeight: "700",
      letterSpacing: 0.1,
    },
    cardSalaryWrap: {
      alignItems: "flex-end",
    },
    cardSalary: {
      fontSize: 14,
      fontWeight: "800",
      color: PALETTE.charcoal,
      letterSpacing: -0.3,
    },
    cardSalaryUnit: {
      fontSize: 11,
      color: PALETTE.cloudGray,
      fontWeight: "500",
      marginTop: 1,
    },

    // states
    errorContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    retryButton: {
      backgroundColor: PALETTE.deepGreen,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 999,
      marginTop: 16,
    },
    retryText: {
      color: PALETTE.white,
      fontSize: 15,
      fontWeight: "700",
    },
  });