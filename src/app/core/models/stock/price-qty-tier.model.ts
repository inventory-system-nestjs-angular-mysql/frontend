/**
 * Price Quantity Tier Model
 * Represents price tiers based on quantity
 */
export interface PriceQtyTier {
  qtyFrom: number;
  qtyTo?: number | null;
  price?: number | null;
  discountPercent?: number | null;
}

