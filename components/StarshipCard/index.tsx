import { AED_CONVERSION } from "@/constants/utils";
import { useCart } from "@/context/CartContext";
import { Starship } from "@/types";
import React, { JSX } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Starship;
}

export default function StarshipCard({ item }: Props): JSX.Element {
  const { addToCart, removeFromCart, cart } = useCart();
  const qty = cart[item.name]?.quantity || 0;
  const priceAED = item.cost_in_credits
    ? (item.cost_in_credits / AED_CONVERSION).toFixed(2)
    : "N/A";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        margin: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: `https://picsum.photos/seed/${item.name}/80` }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text>Cost: {priceAED} AED</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
        >
          <TouchableOpacity
            onPress={() => removeFromCart(item)}
            style={{
              backgroundColor: "#ddd",
              padding: 6,
              borderRadius: 6,
              marginRight: 6,
            }}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{qty}</Text>
          <TouchableOpacity
            onPress={() => addToCart(item)}
            style={{
              backgroundColor: "#ddd",
              padding: 6,
              borderRadius: 6,
              marginLeft: 6,
            }}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
