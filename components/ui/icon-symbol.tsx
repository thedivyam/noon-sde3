import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMap = Partial<
  Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>
>;
type IconName = keyof typeof iconMap;

const iconMap: IconMap = {
  "house.fill": "home",
  house: "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "magnifyingglass.circle.fill": "search",
  "magnifyingglass.circle": "search",
  magnifyingglass: "search",
  "cart.circle.fill": "shopping-cart",
  "cart.circle": "shopping-cart",
  cart: "shopping-cart",
  "creditcard.fill": "credit-card",
  creditcard: "credit-card",
  "banknote.fill": "account-balance-wallet",
  banknote: "account-balance-wallet",
  "xmark.circle.fill": "cancel",
  "xmark.circle": "cancel",
  xmark: "close",
  "checkmark.circle.fill": "check-circle",
  "checkmark.circle": "check-circle",
  checkmark: "check",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "plus.circle.fill": "add-circle",
  "plus.circle": "add-circle",
  plus: "add",
  "minus.circle.fill": "remove-circle",
  "minus.circle": "remove-circle",
  minus: "remove",
  "sun.max.fill": "wb-sunny",
  "moon.fill": "nightlight-round",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconMap[name]}
      style={style}
    />
  );
}
