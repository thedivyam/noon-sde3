import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

type ColorScheme = "light" | "dark" | "auto";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  themePreference: ColorScheme;
  setThemePreference: (preference: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@noon_theme_preference";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ColorScheme>("auto");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && (saved === "light" || saved === "dark" || saved === "auto")) {
          setThemePreferenceState(saved as ColorScheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const setThemePreference = async (preference: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
      setThemePreferenceState(preference);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const toggleTheme = () => {
    const currentEffectiveTheme =
      themePreference === "auto"
        ? systemColorScheme ?? "light"
        : themePreference;

    const newPreference = currentEffectiveTheme === "light" ? "dark" : "light";
    setThemePreference(newPreference);
  };

  const colorScheme: "light" | "dark" =
    themePreference === "auto"
      ? (systemColorScheme ?? "light")
      : themePreference;

  if (isLoading) {
    return (
      <ThemeContext.Provider
        value={{
          colorScheme: systemColorScheme ?? "light",
          themePreference: "auto",
          setThemePreference,
          toggleTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        themePreference,
        setThemePreference,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

