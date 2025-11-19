import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/design";
import React, { ReactNode, useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "./icon-symbol";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}: BottomSheetProps) {
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(500, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [opacity, translateY, visible]);

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, sheetAnimatedStyle]}>
        <View style={styles.handle} />
        {title && <Text style={styles.title}>{title}</Text>}
        {showCloseButton && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    maxHeight: "90%",
    ...Shadows.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border.medium,
    borderRadius: BorderRadius.full,
    alignSelf: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  closeButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
