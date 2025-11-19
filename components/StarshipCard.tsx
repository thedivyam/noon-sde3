import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/design";
import { useCart } from "@/context/CartContext";
import { Starship } from "@/types";
import { calculatePriceAED } from "@/utils/calculations";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { JSX } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedButton } from "./AnimatedButton";
import { IconSymbol } from "./ui/icon-symbol";

interface StarshipCardProps {
  item: Starship;
  index?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function StarshipCard({
  item,
  index = 0,
}: StarshipCardProps): JSX.Element {
  const { addToCart, removeFromCart, cart } = useCart();
  const qty = cart[item.name]?.quantity || 0;
  const scale = useSharedValue(1);
  const priceAED = calculatePriceAED(item.cost_in_credits, item).toFixed(2);
  const isEstimatedPrice =
    !item.cost_in_credits || item.cost_in_credits === "unknown";

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(item);
    scale.value = withSpring(1.05, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
  };

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removeFromCart(item);
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedView style={[styles.container, animatedCardStyle]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${item.name}/200` }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        />
        {qty > 0 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityBadgeText}>{qty}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.starship_class && (
          <Text style={styles.category} numberOfLines={1}>
            {item.starship_class}
          </Text>
        )}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>AED</Text>
          <Text style={styles.price}>{priceAED}</Text>
          {isEstimatedPrice && <Text style={styles.estimatedLabel}>*est.</Text>}
        </View>
        {qty > 0 ? (
          <View style={styles.quantityControls}>
            <AnimatedButton
              onPress={handleRemove}
              style={
                [
                  styles.quantityButton,
                  styles.quantityButtonLeft,
                ] as unknown as ViewStyle
              }
              haptic={true}
            >
              <IconSymbol name="minus" size={20} color={Colors.text.inverse} />
            </AnimatedButton>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantity}>{qty}</Text>
            </View>
            <AnimatedButton
              onPress={handleAdd}
              style={
                [
                  styles.quantityButton,
                  styles.quantityButtonRight,
                ] as unknown as ViewStyle
              }
              haptic={true}
            >
              <IconSymbol name="plus" size={20} color={Colors.text.inverse} />
            </AnimatedButton>
          </View>
        ) : (
          <AnimatedButton
            onPress={handleAdd}
            style={styles.addButton}
            haptic={true}
          >
            <IconSymbol
              name="plus"
              size={18}
              color={Colors.text.inverse}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>Add</Text>
          </AnimatedButton>
        )}
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm + 2,
    padding: Spacing.md + 2,
    ...Shadows.lg,
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    backgroundColor: Colors.background.tertiary,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  quantityBadge: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.cartBadge,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  quantityBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "space-between",
  },
  name: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.tight,
  },
  category: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  price: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  estimatedLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
    fontStyle: "italic",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  quantityButtonLeft: {
    borderTopLeftRadius: BorderRadius.full,
    borderBottomLeftRadius: BorderRadius.full,
  },
  quantityButtonRight: {
    borderTopRightRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
  },
  quantity: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    ...Shadows.primary,
  },
  addButtonIcon: {
    marginRight: Spacing.xs / 2,
  },
  addButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
});
