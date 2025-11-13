import { Cart, Starship } from "@/types";
import React, {
  createContext,
  JSX,
  ReactNode,
  useContext,
  useState,
} from "react";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Starship) => void;
  removeFromCart: (item: Starship) => void;
  emptyCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [cart, setCart] = useState<Cart>({});

  const addToCart = (item: Starship) => {
    setCart((prev) => {
      const newQty = (prev[item.name]?.quantity || 0) + 1;
      return {
        ...prev,
        [item.name]: { ...item, quantity: Math.min(newQty, 5) },
      };
    });
  };

  const removeFromCart = (item: Starship) => {
    setCart((prev) => {
      const newQty = (prev[item.name]?.quantity || 0) - 1;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[item.name];
        return updated;
      }
      return { ...prev, [item.name]: { ...item, quantity: newQty } };
    });
  };

  const emptyCart = () => setCart({});
  const totalItems = Object.values(cart).reduce((a, i) => a + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, emptyCart, totalItems }}
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
