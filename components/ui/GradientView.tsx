import { Colors } from "@/constants/design";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";

interface GradientViewProps {
  children?: ReactNode;
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
}

export function GradientView({
  children,
  colors = [Colors.primary, Colors.primaryDark],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
}: GradientViewProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
