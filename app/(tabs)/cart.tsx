import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AED_CONVERSION } from "@/constants/utils";
import React, { JSX, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity } from "react-native";
import { useCart } from "../../context/CartContext";
import { CartItem } from "../../types";

export default function CartScreen(): JSX.Element {
  const { cart, emptyCart } = useCart();
  const [payment, setPayment] = useState<"Credit Card" | "Cash on Delivery">(
    "Credit Card"
  );

  const items = Object.values(cart) as CartItem[];
  console.log("items", items);
  const subtotal = items.reduce(
    (a, i) => a + (i.cost_in_credits / AED_CONVERSION) * i.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const placeOrder = () => {
    Alert.alert("Order Placed", "Your order has been placed successfully!");
    emptyCart();
  };

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.name}
        renderItem={({ item }) => (
          <ThemedText>{`${item.name} x${item.quantity} - ${(
            item.cost_in_credits / AED_CONVERSION
          ).toFixed(2)} AED`}</ThemedText>
        )}
      />
      <ThemedText style={{ marginTop: 10 }}>Payment Method:</ThemedText>
      <ThemedView style={{ flexDirection: "row", marginVertical: 8 }}>
        {["Credit Card", "Cash on Delivery"].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setPayment(m as "Credit Card" | "Cash on Delivery")}
            style={{ marginRight: 10 }}
          >
            <Text style={{ color: m === payment ? "#25935F" : "#000" }}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </ThemedView>
      <ThemedText>Subtotal: {subtotal.toFixed(2)} AED</ThemedText>
      <ThemedText>Tax (5%): {tax.toFixed(2)} AED</ThemedText>
      <ThemedText style={{ fontWeight: "bold" }}>
        Total: {total.toFixed(2)} AED
      </ThemedText>
      <TouchableOpacity
        onPress={placeOrder}
        style={{
          backgroundColor: "#25935F",
          padding: 14,
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Place Order
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
