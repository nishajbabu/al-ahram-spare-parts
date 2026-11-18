import { CurrencyCode, PricingMode } from '../types';

const AED_TO_USD_RATE = 0.27229;

export interface BulkTierInfo {
  tierLabel: string;
  discountPercent: number;
  unitPriceAED: number;
  nextTierHint?: string;
}

export function getBulkTierPricing(
  basePriceAED: number,
  quantity: number,
  mode: PricingMode
): BulkTierInfo {
  if (mode === 'retail' && quantity < 5) {
    return {
      tierLabel: 'Retail Standard',
      discountPercent: 0,
      unitPriceAED: basePriceAED,
      nextTierHint: 'Switch to Bulk Workshop (5+ units) for 12% off',
    };
  }

  if (quantity >= 20) {
    return {
      tierLabel: 'Fleet & Export Tier II (20+)',
      discountPercent: 22,
      unitPriceAED: Math.round(basePriceAED * 0.78),
    };
  }

  if (quantity >= 5 || mode === 'bulk') {
    const discount = quantity >= 20 ? 22 : 12;
    return {
      tierLabel: quantity >= 5 ? 'Workshop Tier I (5–19)' : 'Workshop Base Rate',
      discountPercent: discount,
      unitPriceAED: Math.round(basePriceAED * (1 - discount / 100)),
      nextTierHint: quantity < 20 ? `Add ${20 - quantity} more for 22% Fleet Tier II` : undefined,
    };
  }

  return {
    tierLabel: 'Retail Standard',
    discountPercent: 0,
    unitPriceAED: basePriceAED,
  };
}

export function formatMoney(amountAED: number, currency: CurrencyCode): string {
  if (currency === 'USD') {
    const usd = amountAED * AED_TO_USD_RATE;
    return `$${usd.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `AED ${amountAED.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function convertAED(amountAED: number, currency: CurrencyCode): number {
  return currency === 'USD' ? Math.round(amountAED * AED_TO_USD_RATE) : amountAED;
}
