export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  primary: "#16A34A",
  primaryLight: "#DCFCE7",
  primaryDark: "#15803D",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  accent: "#FBBF24",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  shadow: "rgba(15, 23, 42, 0.06)",
};

export const darkColors: ThemeColors = {
  primary: "#22C55E",
  primaryLight: "#14532D",
  primaryDark: "#4ADE80",
  background: "#0F172A",
  surface: "#1E293B",
  surfaceElevated: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  border: "#334155",
  borderLight: "#1E293B",
  accent: "#FBBF24",
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",
  shadow: "rgba(0, 0, 0, 0.35)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  xxxl: 48,
} as const;

export const borderRadius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 26,
  xxxl: 32,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};