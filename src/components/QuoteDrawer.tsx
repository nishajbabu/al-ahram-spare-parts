import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Camera,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  Printer,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import {
  CurrencyCode,
  DispatchLane,
  PricingMode,
  QuoteBagItem,
  SparePart,
  VariantType,
  VehicleFitment,
} from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import {
  buildBagWhatsAppUrl,
  DISPATCH_LANES,
  WHATSAPP_NUMBER,
} from '../utils/whatsapp';
import { ProformaQuoteModal } from './ProformaQuoteModal';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface QuoteDrawerProps {
  isOpen: boolean;
  items: QuoteBagItem[];
  catalogMap: Record<string, SparePart>;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  dispatchLane: DispatchLane;
  fitment: VehicleFitment;
  onClose: () => void;
  onPricingModeChange: (mode: PricingMode) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onDispatchLaneChange: (lane: DispatchLane) => void;
  onUpdateQuantity: (partId: string, variantId: VariantType, qty: number) => void;
  onRemoveItem: (partId: string, variantId: VariantType) => void;
  onClearBag: () => void;
}

export function QuoteDrawer({
  isOpen,
  items,
  catalogMap,
  currency,
  pricingMode,
  dispatchLane,
  fitment,
  onClose,
  onPricingModeChange,
  onCurrencyChange,
  onDispatchLaneChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: QuoteDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [destination, setDestination] = useState('UAE / GCC');
  const [notes, setNotes] = useState('');
  const [quickCheckRef, setQuickCheckRef] = useState(fitment.vin || '');
  const [submittedNote, setSubmittedNote] = useState(false);
  const [isProformaOpen, setIsProformaOpen] = useState(false);

  useEffect(() => {
    if (fitment.vin) {
      setQuickCheckRef(fitment.vin);
    }
  }, [fitment.vin]);

  useEffect(() => {
    if (!isOpen || isProformaOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isProformaOpen, onClose]);

  const quickPhotoWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Al Ahram Sharjah Specialist (+971 55 224 8090), please verify part availability${
      quickCheckRef.trim() ? ` for VIN / OEM Ref: ${quickCheckRef.trim()}` : ''
    }. Sending part photo now.`
  )}`;

  const subtotalAED = items.reduce((sum, item) => {
    const part = catalogMap[item.partId];
    if (!part) return sum;
    const basePrice = part.variants[item.variantId].priceAED;
    const tier = getBulkTierPricing(basePrice, item.quantity, pricingMode);
    return sum + tier.unitPriceAED * item.quantity;
  }, 0);

  const retailBaselineAED = items.reduce((sum, item) => {
    const part = catalogMap[item.partId];
    if (!part) return sum;
    return sum + part.variants[item.variantId].priceAED * item.quantity;
  }, 0);

  const totalSavingsAED = Math.max(0, retailBaselineAED - subtotalAED);

  const combinedNotes = [
    quickCheckRef.trim() ? `VIN / OEM Ref: ${quickCheckRef.trim()}` : '',
    notes.trim(),
  ]
    .filter(Boolean)
    .join(' | ');

  const whatsappUrl = buildBagWhatsAppUrl({
    items,
    catalogMap,
    currency,
    pricingMode,
    fitment,
    dispatchLane,
    customerName: customerName.trim() || undefined,
    customerPhone: customerPhone.trim() || undefined,
    destination: destination.trim() || undefined,
    notes: combinedNotes || undefined,
  });

  const mailtoSubject = encodeURIComponent(
    `Al Ahram ${pricingMode === 'bulk' ? 'Bulk Workshop' : 'Retail'} Quote Request (${items.length} items)`
  );
  const mailtoBody = encodeURIComponent(
    decodeURIComponent(whatsappUrl.split('?text=')[1] || '')
  );
  const mailtoHref = `mailto:alahram123@outlook.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  const handleOpenProforma = () => {
    setIsProformaOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-Over Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.42, ease: GALLERY_EASE }}
              aria-label="Quote and Order Drawer"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0E0E12] border-l border-white/15 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#F4F5F7]">
                    Quote &amp; Order Desk
                  </h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Direct dispatch from Sharjah, UAE · Worldwide Export
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close quote drawer"
                  className="w-9 h-9 flex items-center justify-center rounded-sm border border-white/15 text-[#9CA3AF] hover:text-white hover:border-white/40 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pricing Mode + Currency Toolbar */}
              <div className="px-6 py-3.5 bg-[#131317] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div
                  className="inline-flex items-center p-1 bg-[#0B0B0D] border border-white/10 rounded-sm"
                  role="group"
                  aria-label="Drawer order mode"
                >
                  <button
                    type="button"
                    onClick={() => onPricingModeChange('retail')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                      pricingMode === 'retail'
                        ? 'bg-[#F4F5F7] text-[#0B0B0D]'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    Retail
                  </button>
                  <button
                    type="button"
                    onClick={() => onPricingModeChange('bulk')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                      pricingMode === 'bulk'
                        ? 'bg-[#DC2626] text-white'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    Bulk Workshop
                  </button>
                </div>

                <div
                  className="inline-flex items-center p-1 bg-[#0B0B0D] border border-white/10 rounded-sm"
                  role="group"
                  aria-label="Drawer currency"
                >
                  {(['AED', 'USD'] as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onCurrencyChange(code)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
                        currency === code
                          ? 'bg-[#DC2626] text-white'
                          : 'text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* VIN / OEM Part Number / Photo Quick-Check */}
                <div className="p-4 bg-[#131317] border border-white/10 rounded-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="drawer-vin-oem-input"
                      className="text-xs font-medium text-[#F4F5F7]"
                    >
                      VIN / OEM Part Number Quick-Check
                    </label>
                    <span className="text-[11px] font-mono text-[#9CA3AF]">
                      Sharjah +971 55 224 8090
                    </span>
                  </div>

                  <input
                    id="drawer-vin-oem-input"
                    type="text"
                    value={quickCheckRef}
                    onChange={(e) => setQuickCheckRef(e.target.value)}
                    placeholder="Type 17-digit VIN or OEM part number..."
                    className="w-full h-10 sm:h-9 px-3 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none font-mono text-base sm:text-xs uppercase text-[#F4F5F7] placeholder:normal-case placeholder:text-[#6B7280] rounded-sm"
                  />

                  <a
                    href={quickPhotoWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-9 px-3 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#F4F5F7] bg-[#0B0B0D] border border-white/15 hover:border-[#25D366] rounded-sm transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Send Part Photo on WhatsApp</span>
                  </a>
                </div>

                {items.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-white/15 rounded-sm px-6">
                    <p className="font-display text-base font-medium text-[#F4F5F7] mb-2">
                      Your Quote Bag is empty
                    </p>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed mb-5">
                      Select any spare part or one-click overhaul bundle from the catalog to configure OEM or Heavy-Duty variants, or message our team directly for VIN sourcing.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <span className="font-mono tabular-nums">
                        {items.length} {items.length === 1 ? 'line item' : 'line items'}
                      </span>
                      <button
                        type="button"
                        onClick={onClearBag}
                        className="text-xs text-[#9CA3AF] hover:text-[#DC2626] transition-colors cursor-pointer"
                      >
                        Clear Bag
                      </button>
                    </div>

                    {items.map((item) => {
                      const part = catalogMap[item.partId];
                      if (!part) return null;
                      const variant = part.variants[item.variantId];
                      const tier = getBulkTierPricing(
                        variant.priceAED,
                        item.quantity,
                        pricingMode
                      );
                      const lineAED = tier.unitPriceAED * item.quantity;

                      return (
                        <div
                          key={`${item.partId}-${item.variantId}`}
                          className="p-4 bg-[#131317] border border-white/10 rounded-sm flex gap-4"
                        >
                          <div className="w-20 h-16 bg-[#0B0B0D] border border-white/10 rounded-sm overflow-hidden shrink-0">
                            <SafeImage
                              src={part.image}
                              alt={part.name}
                              className="w-full h-full object-cover"
                              fallbackLabel={part.name}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-semibold text-[#F4F5F7] truncate">
                                {part.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.partId, item.variantId)}
                                aria-label={`Remove ${part.name}`}
                                className="text-[#9CA3AF] hover:text-[#DC2626] transition-colors shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-xs text-[#9CA3AF] mt-0.5">
                              {variant.shortLabel} · <span className="font-mono">{variant.sku}</span>
                            </p>

                            {item.fitment?.make && (
                              <p className="text-[11px] text-[#D4D7DD] mt-1">
                                Fitment: {[item.fitment.year, item.fitment.make, item.fitment.model].filter(Boolean).join(' ')}
                              </p>
                            )}

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="inline-flex items-center bg-[#0B0B0D] border border-white/15 rounded-sm">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.partId,
                                      item.variantId,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  aria-label="Decrease item quantity"
                                  className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-mono text-xs text-[#F4F5F7] tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.partId,
                                      item.variantId,
                                      item.quantity + 1
                                    )
                                  }
                                  aria-label="Increase item quantity"
                                  className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="block font-mono text-sm font-medium text-[#F4F5F7] tabular-nums">
                                  {formatMoney(lineAED, currency)}
                                </span>
                                {tier.discountPercent > 0 && (
                                  <span className="block text-[11px] font-mono text-[#DC2626]">
                                    -{tier.discountPercent}% {pricingMode === 'bulk' ? 'Workshop' : 'Tier'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Shipping & Dispatch Estimator */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
                    <Truck className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Dispatch &amp; Transit Route</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(DISPATCH_LANES) as DispatchLane[]).map((laneKey) => {
                      const lane = DISPATCH_LANES[laneKey];
                      const active = dispatchLane === laneKey;
                      return (
                        <button
                          key={laneKey}
                          type="button"
                          onClick={() => onDispatchLaneChange(laneKey)}
                          className={`p-3 text-left rounded-sm border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#1A1A20] border-[#DC2626] text-[#F4F5F7]'
                              : 'bg-[#131317] border-white/10 text-[#9CA3AF] hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#F4F5F7]">
                              {lane.label}
                            </span>
                            <span className="text-[11px] font-mono text-[#DC2626]">
                              {lane.transit}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                            {lane.detail}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer / Workshop Dispatch Details */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-xs font-mono text-[#9CA3AF]">
                    Optional Dispatch &amp; Workshop Details
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Name or Workshop LLC"
                      aria-label="Customer or Workshop name"
                      className="h-10 px-3 bg-[#131317] border border-white/15 focus:border-[#DC2626] focus:outline-none text-xs text-[#F4F5F7] placeholder:text-[#6B7280] rounded-sm"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone / WhatsApp (+971...)"
                      aria-label="Customer phone number"
                      className="h-10 px-3 bg-[#131317] border border-white/15 focus:border-[#DC2626] focus:outline-none text-xs text-[#F4F5F7] placeholder:text-[#6B7280] rounded-sm"
                    />
                  </div>

                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Delivery City / Export Country (e.g. Dubai, Riyadh, Nairobi)"
                    aria-label="Delivery destination"
                    className="w-full h-10 px-3 bg-[#131317] border border-white/15 focus:border-[#DC2626] focus:outline-none text-xs text-[#F4F5F7] placeholder:text-[#6B7280] rounded-sm"
                  />

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional VIN / chassis number or urgent courier instructions..."
                    aria-label="VIN or special delivery notes"
                    className="w-full p-3 bg-[#131317] border border-white/15 focus:border-[#DC2626] focus:outline-none text-xs text-[#F4F5F7] placeholder:text-[#6B7280] rounded-sm resize-none"
                  />
                </div>
              </div>

              {/* Footer Totals & WhatsApp / Email / Print Dispatch */}
              <div className="px-6 py-5 bg-[#131317] border-t border-white/10 space-y-4">
                {items.length > 0 && (
                  <div className="space-y-1.5">
                    {totalSavingsAED > 0 && (
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                        <span>Workshop Tier Savings</span>
                        <span className="font-mono text-[#DC2626] tabular-nums">
                          -{formatMoney(totalSavingsAED, currency)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-[#D4D7DD]">Estimated Total</span>
                      <span className="font-mono text-2xl font-semibold text-[#F4F5F7] tabular-nums">
                        {formatMoney(subtotalAED, currency)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubmittedNote(true)}
                    className="h-11 px-4 inline-flex items-center justify-center gap-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </a>

                  <a
                    href={mailtoHref}
                    onClick={() => setSubmittedNote(true)}
                    className="h-11 px-4 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#F4F5F7] bg-[#0B0B0D] border border-white/20 hover:border-white/50 transition-colors rounded-sm whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Official RFQ</span>
                  </a>
                </div>

                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleOpenProforma}
                    className="w-full h-9 px-3 inline-flex items-center justify-center gap-2 text-xs font-medium text-[#D4D7DD] hover:text-white border border-white/10 hover:border-white/30 rounded-sm transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save Proforma Quote PDF</span>
                  </button>
                )}

                {submittedNote && (
                  <p className="text-[11px] text-[#9CA3AF] text-center">
                    Quote payload prepared for +971 55 224 8090 / alahram123@outlook.com.
                  </p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ProformaQuoteModal
        isOpen={isProformaOpen}
        items={items}
        catalogMap={catalogMap}
        currency={currency}
        pricingMode={pricingMode}
        dispatchLane={dispatchLane}
        fitment={fitment}
        customerName={customerName}
        customerPhone={customerPhone}
        destination={destination}
        notes={notes}
        onClose={() => setIsProformaOpen(false)}
      />
    </>
  );
}
