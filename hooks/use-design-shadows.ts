import { useColorScheme } from "@/hooks/use-color-scheme";
import { Shadows as DesignShadows } from "@/constants/design";

export function useDesignShadows() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";

  if (isDark) {
    return {
      sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      },
      md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      },
      lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
      },
      xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
        elevation: 16,
      },
      primary: {
        shadowColor: "#00B761",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
      },
    };
  }

  return DesignShadows;
}

