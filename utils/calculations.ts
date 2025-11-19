import { AED_CONVERSION } from "@/constants/utils";
import { CartItem, Starship } from "@/types";

function estimatePriceFromAttributes(starship: Starship): number {
  let price = 50000;

  const length = Number.parseFloat(starship.length) || 0;
  if (length > 0) {
    price += length * 1000;
  }

  const crew = Number.parseFloat(starship.crew.replace(/,/g, "")) || 0;
  if (crew > 0) {
    price += crew * 5000;
  }

  const cargo = Number.parseFloat(starship.cargo_capacity) || 0;
  if (cargo > 0) {
    price += cargo * 0.1;
  }

  const shipClass = starship.starship_class?.toLowerCase() || "";
  if (shipClass.includes("starfighter") || shipClass.includes("fighter")) {
    price *= 1.5;
  } else if (shipClass.includes("cruiser") || shipClass.includes("destroyer")) {
    price *= 2;
  } else if (shipClass.includes("transport") || shipClass.includes("freighter")) {
    price *= 0.8;
  }

  return price;
}

export function calculatePriceAED(
  costInCredits: string,
  starship?: Starship
): number {
  if (!costInCredits || costInCredits === "unknown") {
    if (starship) {
      const credits = estimatePriceFromAttributes(starship);
      return credits / AED_CONVERSION;
    }
    return 5;
  }
  const cost = Number.parseFloat(costInCredits);
  return Number.isNaN(cost) ? 5 : cost / AED_CONVERSION;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => {
    const price = calculatePriceAED(item.cost_in_credits, item);
    return acc + price * item.quantity;
  }, 0);
}

export function calculateTax(subtotal: number, taxRate: number = 0.05): number {
  return subtotal * taxRate;
}

export function calculateTotal(subtotal: number, taxRate: number = 0.05): number {
  return subtotal + calculateTax(subtotal, taxRate);
}

