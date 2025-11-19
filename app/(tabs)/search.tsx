import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AnimatedButton } from "@/components/AnimatedButton";
import { CartIndicator } from "@/components/CartIndicator";
import StarshipCard from "@/components/StarshipCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/design";
import { useCart } from "@/context/CartContext";
import { fetchStarships } from "@/services/api";
import { Starship } from "@/types";
import { calculateSubtotal } from "@/utils/calculations";

export default function SearchScreen(): JSX.Element {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Starship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { totalItems, cart } = useCart();
  const abortControllerRef = useRef<AbortController | null>(null);

  const cartTotal = useMemo(() => {
    return calculateSubtotal(Object.values(cart));
  }, [cart]);

  const search = async (searchQuery: string, signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const starships = await fetchStarships(searchQuery, signal);
      setResults(starships);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : "Failed to search starships. Please try again."
      );
      setResults([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const delayDebounce = setTimeout(() => {
      search(query, abortController.signal);
    }, 400);

    return () => {
      clearTimeout(delayDebounce);
      abortController.abort();
    };
  }, [query]);

  const handleRefresh = () => {
    if (!query.trim()) return;
    setIsRefreshing(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    search(query, abortController.signal);
  };

  return (
    <View style={styles.container}>
      <Header title="Search" subtitle="Find your perfect starship" />
      <View style={styles.searchContainer}>
        <IconSymbol
          name="magnifyingglass"
          size={24}
          color={Colors.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search starships..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholderTextColor={Colors.text.tertiary}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <AnimatedButton
            onPress={() => setQuery("")}
            style={styles.clearButton}
            haptic={true}
          >
            <IconSymbol name="xmark" size={18} color={Colors.text.secondary} />
          </AnimatedButton>
        )}
      </View>
      {isLoading && query.trim() ? (
        <FlatList
          data={Array.from({ length: 3 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <ProductCardSkeleton count={1} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results.length === 0 && query.trim() ? (
        <EmptyState
          icon="🔎"
          title="No results found"
          subtitle={`Try searching for something else`}
        />
      ) : query.trim() && results.length > 0 ? (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {results.length} {results.length === 1 ? "result" : "results"} found
          </Text>
        </View>
      ) : null}
      {query.trim() && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(i) => i.name}
          renderItem={({ item, index }) => (
            <StarshipCard item={item} index={index} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: 140,
            offset: 140 * index,
            index,
          })}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      )}
      {!query.trim() && (
        <EmptyState
          icon="🚀"
          title="Start Searching"
          subtitle="Enter a starship name to begin"
        />
      )}
      <CartIndicator itemCount={totalItems} total={cartTotal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md + Spacing.xs,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md + Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.lg,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  resultsCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  listContent: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing["3xl"],
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
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.error,
    textAlign: "center",
    fontWeight: Typography.fontWeight.medium,
  },
  cartButton: {
    position: "absolute",
    bottom: Spacing.lg + Spacing.sm,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md + Spacing.xs,
    ...Shadows.xl,
  },
  cartButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    left: Spacing.lg,
    backgroundColor: Colors.cartBadge,
    borderRadius: BorderRadius.full,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  cartBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  cartButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  cartButtonArrow: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xl,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.bold,
  },
});
