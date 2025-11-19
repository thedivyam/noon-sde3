import { Cart, Starship } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Toast from "react-native-toast-message";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Starship) => void;
  removeFromCart: (item: Starship) => void;
  emptyCart: (showToast?: boolean) => void;
  totalItems: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "@noon_cart";

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [cart, setCart] = useState<Cart>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
          console.error("Failed to save cart to storage:", error);
        }
      };

      saveCart();
    }
  }, [cart, isLoading]);

  const addToCart = useCallback((item: Starship) => {
    setCart((prev) => {
      const currentQty = prev[item.name]?.quantity || 0;
      const newQty = currentQty + 1;
      const finalQty = Math.min(newQty, 5);
      
      if (currentQty >= 5) {
        Toast.show({
          type: "info",
          text1: "Maximum quantity reached",
          text2: `${item.name} - Maximum 5 items allowed`,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Added to cart",
          text2: `${item.name} (${finalQty})`,
          position: "bottom",
        });
      }
      
      return {
        ...prev,
        [item.name]: { ...item, quantity: finalQty },
      };
    });
  }, []);

  const removeFromCart = useCallback((item: Starship) => {
    setCart((prev) => {
      const newQty = (prev[item.name]?.quantity || 0) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[item.name];
        Toast.show({
          type: "info",
          text1: "Removed from cart",
          text2: `${item.name}`,
          position: "bottom",
        });
        return updated;
      }
      Toast.show({
        type: "info",
        text1: "Quantity updated",
        text2: `${item.name} (${newQty})`,
        position: "bottom",
      });
      return { ...prev, [item.name]: { ...item, quantity: newQty } };
    });
  }, []);

  const emptyCart = useCallback((showToast: boolean = true) => {
    setCart({});
    if (showToast) {
      Toast.show({
        type: "success",
        text1: "Cart cleared",
        text2: "All items have been removed",
        position: "bottom",
      });
    }
  }, []);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((a, i) => a + i.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, emptyCart, totalItems, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
