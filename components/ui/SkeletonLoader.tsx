import { Colors } from "@/constants/design";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [opacity]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const widthStyle =
    typeof width === "string"
      ? ({ width: width as any } as ViewStyle)
      : { width };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        widthStyle,
        { height, borderRadius },
        fadeStyle,
        style,
      ]}
    />
  );
}

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton({ count = 3 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.cardContainer}>
          <SkeletonLoader width={100} height={100} borderRadius={12} />
          <View style={styles.cardContent}>
            <SkeletonLoader width="80%" height={20} style={styles.title} />
            <SkeletonLoader width="60%" height={16} style={styles.subtitle} />
            <SkeletonLoader
              width={100}
              height={36}
              borderRadius={18}
              style={styles.button}
            />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.background.tertiary,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
  },
});
