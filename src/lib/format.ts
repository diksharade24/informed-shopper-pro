const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatPrice = (n: number) => inr.format(n);

/** Discount percent, only when original price is a valid, higher value. */
export function discountPercent(price: number, original?: number): number | null {
  if (!original || original <= price || price <= 0) return null;
  return Math.round(((original - price) / original) * 100);
}

export function stockLabel(stock: number): { label: string; tone: "ok" | "low" | "out" } {
  if (stock <= 0) return { label: "Out of stock", tone: "out" };
  if (stock <= 5) return { label: `Only ${stock} left`, tone: "low" };
  return { label: "In stock", tone: "ok" };
}
