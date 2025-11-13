import StarshipCard from "@/components/StarshipCard";
import { useCart } from "@/context/CartContext";
import { Starship } from "@/types";
import { router } from "expo-router";
import React, { JSX, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen(): JSX.Element {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Starship[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    if (!query) return;
    const delayDebounce = setTimeout(() => {
      fetch(`https://swapi.dev/api/starships/?search=${query}`)
        .then((res) => res.json())
        .then((json) => setResults(json.results || []));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Search starships..."
        value={query}
        onChangeText={setQuery}
        style={{
          backgroundColor: "#f2f2f2",
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />
      <FlatList
        data={results}
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
        <Text style={{ color: "#fff" }}>View Cart ({totalItems})</Text>
      </TouchableOpacity>
    </View>
  );
}
