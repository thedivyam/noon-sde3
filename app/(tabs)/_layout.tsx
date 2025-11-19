import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing } from "@/constants/design";
import { useDesignColors } from "@/hooks/use-design-colors";
import { useDesignShadows } from "@/hooks/use-design-shadows";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const Colors = useDesignColors();
  const Shadows = useDesignShadows();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopWidth: 0,
          borderTopColor: Colors.border.light,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + Spacing.md,
          paddingTop: Spacing.sm,
          ...Shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: Spacing.xs,
        },
        tabBarIconStyle: {
          marginTop: Spacing.xs,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={24}
              name={focused ? "house.fill" : "house"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="cart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
