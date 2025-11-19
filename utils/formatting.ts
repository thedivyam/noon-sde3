export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
  if (Number.isNaN(numPrice)) return "N/A";
  return numPrice.toFixed(2);
}

export function formatCurrency(amount: number, currency: string = "AED"): string {
  return `${formatPrice(amount)} ${currency}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

