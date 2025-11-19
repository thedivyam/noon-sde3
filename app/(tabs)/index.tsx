import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { AnimatedButton } from "@/components/AnimatedButton";
import { CartIndicator } from "@/components/CartIndicator";
import StarshipCard from "@/components/StarshipCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
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

export default function HomeScreen(): JSX.Element {
  const [data, setData] = useState<Starship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { totalItems, cart } = useCart();

  const cartTotal = useMemo(() => {
    return calculateSubtotal(Object.values(cart));
  }, [cart]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const starships = await fetchStarships();
      setData(starships);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load starships. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Starships" subtitle="Explore our collection" />
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <ProductCardSkeleton count={1} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <AnimatedButton
          onPress={loadData}
          style={styles.retryButton}
          haptic={true}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </AnimatedButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Starships" subtitle="Explore our collection" />
      {data.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No starships found"
          subtitle="Pull down to refresh"
        />
      ) : (
        <FlatList
          data={data}
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
      <CartIndicator itemCount={totalItems} total={cartTotal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
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
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  retryButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
});
