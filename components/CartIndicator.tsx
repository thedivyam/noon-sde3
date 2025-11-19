import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/design";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedButton } from "./AnimatedButton";
import { IconSymbol } from "./ui/icon-symbol";

interface CartIndicatorProps {
  itemCount: number;
  total: number;
}

export function CartIndicator({ itemCount, total }: CartIndicatorProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (itemCount > 0) {
      scale.value = withSpring(1.05, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [itemCount, scale]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (itemCount === 0) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.navigate("/cart");
  };

  return (
    <Animated.View style={[styles.container, scaleStyle]}>
      <AnimatedButton
        onPress={handlePress}
        style={styles.button}
        haptic={false}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>View Cart</Text>
          <Text style={styles.total}>{total.toFixed(2)} AED</Text>
        </View>
        <IconSymbol
          name="arrow.right"
          size={20}
          color={Colors.text.inverse}
          style={styles.arrow}
        />
      </AnimatedButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Spacing.lg + Spacing.sm,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 1000,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md + Spacing.xs,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...Shadows.xl,
  },
  badge: {
    position: "absolute",
    left: Spacing.lg,
    backgroundColor: Colors.cartBadge,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  badgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginLeft: 40,
  },
  label: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 2,
  },
  total: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extrabold,
  },
  arrow: {
    marginLeft: Spacing.sm,
  },
});
