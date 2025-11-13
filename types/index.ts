export interface Starship {
  name: string;
  cost_in_credits: number;
  [key: string]: any;
}

export interface CartItem extends Starship {
  quantity: number;
}

export type Cart = Record<string, CartItem>;
