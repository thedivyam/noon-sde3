import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { JSX, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";

import { AnimatedButton } from "@/components/AnimatedButton";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { GradientView } from "@/components/ui/GradientView";
import { Header } from "@/components/ui/Header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/design";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types";
import {
  calculatePriceAED,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/utils/calculations";
import { formatPrice } from "@/utils/formatting";

export default function CartScreen(): JSX.Element {
  const { cart, emptyCart, addToCart, removeFromCart, isLoading } = useCart();
  const [payment, setPayment] = useState<"Credit Card" | "Cash on Delivery">(
    "Credit Card"
  );
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  const items = Object.values(cart) as CartItem[];

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const total = useMemo(() => calculateTotal(subtotal), [subtotal]);

  const placeOrder = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowOrderConfirmation(true);
  };

  const handleOrderConfirm = () => {
    setShowOrderConfirmation(false);
    emptyCart(false);
    Toast.show({
      type: "success",
      text1: "Order Placed Successfully! 🎉",
      text2: `Your order of ${total.toFixed(2)} AED has been confirmed`,
      position: "bottom",
      visibilityTime: 4000,
    });
    setTimeout(() => {
      router.push("/(tabs)" as any);
    }, 500);
  };

  const getItemPrice = (item: CartItem): string => {
    const price = calculatePriceAED(item.cost_in_credits, item) * item.quantity;
    return formatPrice(price);
  };

  const getUnitPrice = (item: CartItem): string => {
    const unitPrice = calculatePriceAED(item.cost_in_credits, item);
    return formatPrice(unitPrice);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Cart" subtitle="Your items" />
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          subtitle="Add items from the home or search screen"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Cart"
        subtitle={`${items.length} ${items.length === 1 ? "item" : "items"}`}
      />
      <FlatList
        data={items}
        keyExtractor={(i) => i.name}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.cartItemImageContainer}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${item.name}/200` }}
                style={styles.cartItemImage}
                contentFit="cover"
              />
            </View>
            <View style={styles.cartItemContent}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.unitPrice}>{getUnitPrice(item)} AED</Text>
                <Text style={styles.unitPriceLabel}>per unit</Text>
              </View>
            </View>
            <View style={styles.cartItemRight}>
              <View style={styles.cartItemPrice}>
                <Text style={styles.itemTotalPrice}>{getItemPrice(item)}</Text>
                <Text style={styles.itemTotalPriceLabel}> AED</Text>
              </View>
              <View style={styles.quantityControls}>
                <AnimatedButton
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    removeFromCart(item);
                  }}
                  style={
                    [
                      styles.quantityButton,
                      styles.quantityButtonLeft,
                    ] as unknown as ViewStyle
                  }
                  haptic={false}
                >
                  <IconSymbol
                    name="minus"
                    size={18}
                    color={Colors.text.inverse}
                  />
                </AnimatedButton>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                </View>
                <AnimatedButton
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    addToCart(item);
                  }}
                  style={
                    [
                      styles.quantityButton,
                      styles.quantityButtonRight,
                    ] as unknown as ViewStyle
                  }
                  haptic={false}
                >
                  <IconSymbol
                    name="plus"
                    size={18}
                    color={Colors.text.inverse}
                  />
                </AnimatedButton>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.summary}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
        </View>
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            {[
              {
                label: "Credit Card",
                icon: "creditcard.fill" as const,
                iconOutline: "creditcard" as const,
              },
              {
                label: "Cash on Delivery",
                icon: "banknote.fill" as const,
                iconOutline: "banknote" as const,
              },
            ].map(({ label, icon, iconOutline }) => (
              <AnimatedButton
                key={label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPayment(label as "Credit Card" | "Cash on Delivery");
                }}
                style={
                  [
                    styles.paymentOption,
                    payment === label && styles.paymentOptionSelected,
                  ] as unknown as ViewStyle
                }
                haptic={false}
              >
                <IconSymbol
                  name={payment === label ? icon : iconOutline}
                  size={20}
                  color={
                    payment === label ? Colors.primary : Colors.text.secondary
                  }
                  style={styles.paymentOptionIcon}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    payment === label && styles.paymentOptionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </AnimatedButton>
            ))}
          </View>
        </View>
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>{subtotal.toFixed(2)} AED</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (5%)</Text>
            <Text style={styles.priceValue}>{tax.toFixed(2)} AED</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{total.toFixed(2)} AED</Text>
          </View>
        </View>
        <AnimatedButton
          onPress={placeOrder}
          style={styles.orderButton}
          haptic={true}
        >
          <Text style={styles.orderButtonText}>Place Order</Text>
          <IconSymbol
            name="arrow.right"
            size={20}
            color={Colors.text.inverse}
            style={styles.orderButtonIcon}
          />
        </AnimatedButton>
      </View>
      <BottomSheet
        visible={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        title="Confirm Order"
      >
        <View style={styles.confirmationContent}>
          <View style={styles.confirmationIcon}>
            <IconSymbol name="checkmark" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.confirmationTitle}>
            Ready to place your order?
          </Text>
          <Text style={styles.confirmationSubtitle}>
            {items.length} {items.length === 1 ? "item" : "items"} • {payment}
          </Text>
          <View style={styles.confirmationTotal}>
            <Text style={styles.confirmationTotalLabel}>Total Amount</Text>
            <Text style={styles.confirmationTotalAmount}>
              {total.toFixed(2)} AED
            </Text>
          </View>
          <View style={styles.confirmationButtons}>
            <AnimatedButton
              onPress={() => setShowOrderConfirmation(false)}
              style={styles.cancelButton}
              haptic={true}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </AnimatedButton>
            <AnimatedButton
              onPress={handleOrderConfirm}
              style={styles.confirmButton}
              haptic={true}
            >
              <GradientView
                colors={
                  Colors.gradients.success as unknown as readonly [
                    string,
                    string,
                    ...string[]
                  ]
                }
                style={styles.confirmButtonGradient}
              >
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
              </GradientView>
            </AnimatedButton>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md + Spacing.xs,
    ...Shadows.lg,
  },
  cartItemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    backgroundColor: Colors.background.tertiary,
  },
  cartItemImage: {
    width: "100%",
    height: "100%",
  },
  cartItemContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "flex-start",
  },
  itemName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  priceContainer: {
    marginBottom: Spacing.sm,
  },
  unitPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs / 2,
  },
  unitPriceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  quantityButton: {
    width: 32,
    height: 32,
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
  quantityButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  quantityDisplay: {
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
  },
  quantity: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  cartItemRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: Spacing.md,
  },
  cartItemPrice: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.sm,
  },
  itemTotalPrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  itemTotalPriceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  summary: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.md + Spacing.xs,
    paddingTop: Spacing.lg,
    ...Shadows.xl,
  },
  summaryHeader: {
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  paymentSection: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  paymentOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  paymentOptionIcon: {
    marginRight: Spacing.xs,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  paymentOptionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  paymentOptionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  priceBreakdown: {
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.border.light,
  },
  totalLabel: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  totalAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.primary,
  },
  orderButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md + Spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.primary,
  },
  orderButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  orderButtonIcon: {
    marginLeft: Spacing.sm,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  confirmationContent: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  confirmationIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  confirmationTitle: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  confirmationSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  confirmationTotal: {
    width: "100%",
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  confirmationTotalLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  confirmationTotalAmount: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.primary,
  },
  confirmationButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.secondary,
  },
  confirmButton: {
    flex: 2,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  confirmButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.full,
  },
  confirmButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
});
