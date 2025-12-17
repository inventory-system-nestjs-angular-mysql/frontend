import { StockPriceRow } from './stock-price-row.model';
import { PriceQtyTier } from './price-qty-tier.model';

/**
 * Create Stock Model
 * DTO for creating a new stock item
 */
export interface CreateStockModel {
  stockName: string;
  stockGroupId?: string | null;
  minStock?: number;
  maxStock?: number;
  purchasePrice?: number;
  purchasePriceDollar?: number;
  extraFee?: number;
  extraFeeDollar?: number;
  cogs?: number;
  cogsDollar?: number;
  grossPrice?: number;
  grossPriceDollar?: number;
  previousPrice?: number;
  previousPriceDollar?: number;
  supplier?: string;
  taxOption: 'Tax' | 'Tax Free' | 'Non Tax';
  isService?: boolean;
  isConsignment?: boolean;
  isSuspended?: boolean;
  selectPriceTags?: boolean;
  isDiscontinue?: boolean;
  brand?: string;
  partNo1?: string;
  partNo2?: string;
  imagePath?: string;
  memo?: string;
  copyMemoToSalesInvoice?: boolean;
  copyMemoToPurchasing?: boolean;
  // Markup tab fields
  wholesaleMarkup?: number;
  retailMarkup?: number;
  price3Markup?: number;
  price4Markup?: number;
  price5Markup?: number;
  priceDollar?: number;
  roundingMode?: '10' | '100' | '1000' | 'none';
  roundUp?: boolean;
  // Attributes / misc
  color?: string;
  weight?: number;
  dimLength?: number;
  dimWidth?: number;
  dimHeight?: number;
  rack1?: string;
  rack2?: string;
  rack3?: string;
  rack4?: string;
  storeType?: string;
  // Misc tab fields
  storeMin?: number;
  storeMax?: number;
  blockIfBelowPurchase?: boolean;
  warnIfBelowCogs?: boolean;
  blockIfInsufficientStock?: boolean;
  discMember?: string;
  miscPurchase?: string;
  miscSold?: string;
  kodeCoretax?: string;
  commissionB?: number;
  commissionValue?: number;
  commissionPerPiece?: boolean;
  movementSpeed?: 'fast' | 'slow';
  productionStage?: 'finished' | 'material' | 'wip';
  permitLicense?: string;
  // Price/Qty tab
  priceByQty?: boolean;
  applyToSmallestUnit?: boolean;
  priceQtyTiers?: PriceQtyTier[];
  // POS tab
  discItemForMember?: string;
  discHappyHour?: string;
  purchasingUnits?: number;
  posValidFrom?: string | Date;
  posValidTo?: string | Date;
  maxSalesAllowed?: number;
  openPrice?: boolean;
  roundUnitNoDecimal?: boolean;
  qtyManual?: boolean;
  smallBusinessItem?: boolean;
  pharmacyItem?: boolean;
  // Mapping tab
  mappingAstraOtoparts?: string;
  mappingKino?: string;
  mappingArnotts?: string;
  mappingAdis?: string;
  mappingJJ?: string;
  mappingUnzaVitalis?: string;
  mappingScji?: string;
  mappingUnifam?: string;
  mappingNutrifood?: string;
  mappingSiOdie?: string;
  mappingMenkes?: string;
  mappingAbcPresiden?: string;
  mappingMotasa?: string;
  mappingAsis?: string;
  mappingNetSuite?: string;
  mappingNetSuiteAlt?: string;
  stockDetails?: StockPriceRow[];
}

