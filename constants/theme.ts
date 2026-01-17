// src/constants/theme.ts
export const theme = {
  colors: {
    // Brand / Primary
    primary: "#2F6FED", // main blue
    primaryDark: "#1E56D6",
    primaryLight: "#EAF1FF",

    // Backgrounds
    background: "#F5F7FB", // app background
    surface: "#FFFFFF", // cards/sheets
    surfaceAlt: "#F1F4F9", // input bg / soft fill

    // Text
    text: "#0F172A", // slate-900
    textMuted: "#64748B", // slate-500
    textLight: "#94A3B8", // slate-400
    textOnPrimary: "#FFFFFF",

    // Borders / Dividers
    border: "#E2E8F0", // slate-200
    divider: "#EEF2F7",

    // Status colors
    success: "#22C55E", // green (online / synced)
    successLight: "#DCFCE7",
    warning: "#F59E0B", // yellow (pending)
    warningLight: "#FEF3C7",
    danger: "#EF4444", // red (failed)
    dangerLight: "#FEE2E2",
    info: "#3B82F6",
    infoLight: "#DBEAFE",

    // Extra
    shadow: "rgba(15, 23, 42, 0.08)",
    overlay: "rgba(15, 23, 42, 0.35)",
  },

  typography: {
    fontFamily: {
      regular: "System",
      medium: "System",
      bold: "System",
    },

    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
    },

    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 26,
      xl: 30,
      xxl: 36,
    },
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
  },

  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    pill: 999,
  },

  shadow: {
    // iOS Shadow
    ios: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    },

    // Android Elevation
    android: {
      elevation: 4,
    },
  },

  // Component presets (optional but very useful)
  components: {
    button: {
      height: 48,
      radius: 14,
      paddingHorizontal: 16,
    },

    input: {
      height: 48,
      radius: 14,
      paddingHorizontal: 14,
      background: "#F1F4F9",
      borderColor: "#E2E8F0",
    },

    card: {
      radius: 18,
      padding: 16,
      background: "#FFFFFF",
      borderColor: "#EEF2F7",
    },
  },
};

export type AppTheme = typeof theme;
