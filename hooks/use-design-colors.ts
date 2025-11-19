import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors as DesignColors } from "@/constants/design";

export function useDesignColors() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";

  return {
    primary: DesignColors.primary,
    primaryDark: DesignColors.primaryDark,
    primaryLight: isDark ? "#1A3D2A" : DesignColors.primaryLight,
    primaryGradient: DesignColors.primaryGradient,

    accent: DesignColors.accent,
    accentLight: isDark ? "#3D1F15" : DesignColors.accentLight,
    accentGradient: DesignColors.accentGradient,

    success: DesignColors.success,
    successGradient: DesignColors.successGradient,
    error: DesignColors.error,
    errorGradient: DesignColors.errorGradient,
    warning: DesignColors.warning,
    warningGradient: DesignColors.warningGradient,
    info: DesignColors.info,
    infoGradient: DesignColors.infoGradient,

    text: {
      primary: isDark ? "#FFFFFF" : DesignColors.text.primary,
      secondary: isDark ? "#B3B3B3" : DesignColors.text.secondary,
      tertiary: isDark ? "#808080" : DesignColors.text.tertiary,
      inverse: isDark ? "#1A1A1A" : DesignColors.text.inverse,
      muted: isDark ? "#666666" : DesignColors.text.muted,
    },

    background: {
      primary: isDark ? "#1A1A1A" : DesignColors.background.primary,
      secondary: isDark ? "#121212" : DesignColors.background.secondary,
      tertiary: isDark ? "#2A2A2A" : DesignColors.background.tertiary,
      overlay: isDark ? "rgba(0, 0, 0, 0.7)" : DesignColors.background.overlay,
    },

    border: {
      light: isDark ? "#333333" : DesignColors.border.light,
      medium: isDark ? "#444444" : DesignColors.border.medium,
      dark: isDark ? "#666666" : DesignColors.border.dark,
    },

    cartBadge: DesignColors.cartBadge,
    gradients: DesignColors.gradients,
  };
}

