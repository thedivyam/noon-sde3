export const Colors = {
  primary: "#00B761",
  primaryDark: "#00A050",
  primaryLight: "#E6F7ED",
  primaryGradient: ["#00B761", "#00A050", "#008F40"],
  accent: "#FF6B35",
  accentLight: "#FFF4F0",
  accentGradient: ["#FF6B35", "#FF5722", "#E64A19"],
  success: "#00B761",
  successGradient: ["#00B761", "#00A050"],
  error: "#FF3B30",
  errorGradient: ["#FF3B30", "#D32F2F"],
  warning: "#FF9500",
  warningGradient: ["#FF9500", "#FF8800"],
  info: "#007AFF",
  infoGradient: ["#007AFF", "#0051D5"],
  
  text: {
    primary: "#1A1A1A",
    secondary: "#666666",
    tertiary: "#999999",
    inverse: "#FFFFFF",
    muted: "#B3B3B3",
  },
  
  background: {
    primary: "#FFFFFF",
    secondary: "#F8F9FA",
    tertiary: "#F0F0F0",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  
  border: {
    light: "#E5E5E5",
    medium: "#CCCCCC",
    dark: "#999999",
  },
  
  cartBadge: "#FF3B30",
  gradients: {
    primary: ["#00B761", "#00A050"],
    accent: ["#FF6B35", "#FF5722"],
    success: ["#00B761", "#00A050"],
    sunset: ["#FF6B35", "#FF9500", "#FFC107"],
    ocean: ["#007AFF", "#00B761"],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  "3xl": 64,
};

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  primary: {
    shadowColor: "#00B761",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
};

