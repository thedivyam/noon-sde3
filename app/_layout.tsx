import { Spacing } from "@/constants/design";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider as NavigationThemeProvider } from "@/context/ThemeContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

function ToastContainer() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 70 + insets.bottom + Spacing.md;

  return <Toast bottomOffset={tabBarHeight + Spacing.sm} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <NavigationThemeProvider>
          <CartProvider>
            <ThemeWrapper>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
              <ToastContainer />
            </ThemeWrapper>
          </CartProvider>
        </NavigationThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
