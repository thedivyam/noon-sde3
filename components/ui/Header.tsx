import { BorderRadius, Spacing, Typography } from "@/constants/design";
import { useTheme } from "@/context/ThemeContext";
import { useDesignColors } from "@/hooks/use-design-colors";
import { useDesignShadows } from "@/hooks/use-design-shadows";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedButton } from "../AnimatedButton";
import { GradientView } from "./GradientView";
import { IconSymbol } from "./icon-symbol";

interface HeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  showThemeToggle?: boolean;
}

export function Header({
  title,
  subtitle,
  gradient = false,
  showThemeToggle = true,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const Colors = useDesignColors();
  const Shadows = useDesignShadows();
  const { colorScheme, toggleTheme } = useTheme();

  const headerStyle = {
    backgroundColor: Colors.background.primary,
    paddingBottom: Spacing.md + Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingTop: insets.top + Spacing.lg + Spacing.sm,
    ...Shadows.md,
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const content = (
    <View style={headerStyle}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: Colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: Colors.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {showThemeToggle && (
          <AnimatedButton
            onPress={handleThemeToggle}
            style={
              [
                styles.themeToggle,
                { backgroundColor: Colors.background.tertiary },
              ] as unknown as ViewStyle
            }
            haptic={false}
          >
            <IconSymbol
              name={colorScheme === "dark" ? "sun.max.fill" : "moon.fill"}
              size={22}
              color={Colors.text.primary}
            />
          </AnimatedButton>
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <GradientView
        colors={
          Colors.gradients.primary as unknown as readonly [
            string,
            string,
            ...string[]
          ]
        }
        style={Shadows.md}
      >
        {content}
      </GradientView>
    );
  }

  return <View>{content}</View>;
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.extrabold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
  },
});
