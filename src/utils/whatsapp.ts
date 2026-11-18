import {
  CurrencyCode,
  DispatchLane,
  PricingMode,
  QuoteBagItem,
  SparePart,
  VariantType,
  VehicleFitment,
} from '../types';
import { formatMoney, getBulkTierPricing } from './pricing';

export const WHATSAPP_NUMBER = '971552248090';

export const DISPATCH_LANES: Record<
  DispatchLane,
  { label: string; transit: string; detail: string }
> = {
  uae_same_day: {
    label: 'UAE Same-Day Courier',
    transit: '2–6 Hours (Sharjah / Dubai / Abu Dhabi)',
    detail: 'Direct van dispatch from Industrial Hub Sharjah',
  },
  gcc_overland: {
    label: 'GCC Overland Express',
    transit: '24–48 Hours (KSA / Oman / Kuwait / Bahrain / Qatar)',
    detail: 'Customs-cleared cross-border workshop freight',
  },
  intl_air: {
    label: 'International Air Freight',
    transit: '3–5 Business Days Worldwide',
    detail: 'DHL / Aramex export airway bill & packing list included',
  },
};

export function buildSinglePartWhatsAppUrl(params: {
  part: SparePart;
  variantId: VariantType;
  quantity: number;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  fitment: VehicleFitment;
}): string {
  const { part, variantId, quantity, currency, pricingMode, fitment } = params;
  const variant = part.variants[variantId];
  const tier = getBulkTierPricing(variant.priceAED, quantity, pricingMode);
  const totalAED = tier.unitPriceAED * quantity;

  const fitmentText =
    fitment.make && fitment.model && fitment.year
      ? `${fitment.year} ${fitment.make} ${fitment.model}`
      : fitment.make
        ? `${fitment.make}${fitment.model ? ` ${fitment.model}` : ''}`
        : 'Vehicle not specified (please advise compatibility)';

  const lines = [
    'Hello Al Ahram Auto Spare Parts,',
    'I would like to order / request a quote for:',
    '',
    `• Part: ${part.name}`,
    `• Category: ${part.categoryName}`,
    `• Variant: ${variant.label} (${variant.sku})`,
    `• OE Reference: ${variant.oeReference}`,
    `• Order Type: ${pricingMode === 'bulk' ? 'Bulk Workshop / Trade' : 'Retail Direct'}`,
    `• Quantity: ${quantity} unit(s)`,
    `• Estimated Total: ${formatMoney(totalAED, currency)} (${tier.tierLabel})`,
    `• Vehicle Fitment: ${fitmentText}`,
  ];

  if (fitment.vin) {
    lines.push(`• Chassis / VIN: ${fitment.vin}`);
  }

  lines.push('', 'Please confirm availability and dispatch timeline.');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildBagWhatsAppUrl(params: {
  items: QuoteBagItem[];
  catalogMap: Record<string, SparePart>;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  fitment: VehicleFitment;
  dispatchLane?: DispatchLane;
  customerName?: string;
  customerPhone?: string;
  destination?: string;
  notes?: string;
}): string {
  const {
    items,
    catalogMap,
    currency,
    pricingMode,
    fitment,
    dispatchLane = 'uae_same_day',
    customerName,
    customerPhone,
    destination,
    notes,
  } = params;

  if (items.length === 0) {
    const fitmentLine =
      fitment.make || fitment.model || fitment.year
        ? ` for ${[fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ')}`
        : '';
    const vinLine = fitment.vin ? ` (VIN: ${fitment.vin})` : '';
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hello Al Ahram Auto Spare Parts, I need assistance sourcing OEM / Heavy-Duty spare parts${fitmentLine}${vinLine}.`
    )}`;
  }

  let grandTotalAED = 0;
  const itemLines = items.map((item, idx) => {
    const part = catalogMap[item.partId];
    if (!part) return '';
    const variant = part.variants[item.variantId];
    const tier = getBulkTierPricing(variant.priceAED, item.quantity, pricingMode);
    const lineAED = tier.unitPriceAED * item.quantity;
    grandTotalAED += lineAED;

    const itemFitment = item.fitment?.make
      ? [item.fitment.year, item.fitment.make, item.fitment.model].filter(Boolean).join(' ')
      : fitment.make
        ? [fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ')
        : 'General Fitment';

    return `${idx + 1}. ${part.name} — ${variant.shortLabel} (${variant.sku}) × ${item.quantity} | ${formatMoney(lineAED, currency)} | Fit: ${itemFitment}`;
  });

  const laneInfo = DISPATCH_LANES[dispatchLane];

  const lines = [
    'Hello Al Ahram Auto Spare Parts,',
    `New ${pricingMode === 'bulk' ? 'BULK WORKSHOP' : 'RETAIL'} Inquiry:`,
    '',
    ...itemLines.filter(Boolean),
    '',
    `Estimated Subtotal: ${formatMoney(grandTotalAED, currency)} (${currency})`,
    `Dispatch Route: ${laneInfo.label} (${laneInfo.transit})`,
  ];

  if (fitment.vin) lines.push(`Verified VIN / Chassis: ${fitment.vin}`);
  if (customerName) lines.push(`Contact: ${customerName}`);
  if (customerPhone) lines.push(`Phone: ${customerPhone}`);
  if (destination) lines.push(`Delivery Destination: ${destination}`);
  if (notes) lines.push(`Notes: ${notes}`);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
