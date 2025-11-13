import { FlatList, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";

import React, { JSX, useEffect, useState } from "react";
import StarshipCard from "../../components/StarshipCard";
import { useCart } from "../../context/CartContext";
import { Starship } from "../../types";

export default function HomeScreen(): JSX.Element {
  const [data, setData] = useState<Starship[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    fetch("https://swapi.dev/api/starships/")
      .then((res) => res.json())
      .then((json) => setData(json.results))
      .catch(console.error);
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.name}
        renderItem={({ item }) => <StarshipCard item={item} />}
      />
      <TouchableOpacity
        onPress={() => router.navigate("/cart")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#25935F",
          padding: 14,
          borderRadius: 30,
        }}
      >
        <ThemedText style={{ color: "#fff" }}>
          View Cart ({totalItems})
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
