import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  Globe2,
  MessageCircle,
  PackageCheck,
  Plane,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { SPARE_PARTS } from '../data/catalog';
import { CurrencyCode, DispatchLane } from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { DISPATCH_LANES, WHATSAPP_NUMBER } from '../utils/whatsapp';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface WholesaleExportPageProps {
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  onBackHome: () => void;
  onOpenBulkOrder: () => void;
  onSelectDispatchLane: (lane: DispatchLane) => void;
  onGoToCatalogBulk: () => void;
}

export function WholesaleExportPage({
  currency,
  onCurrencyChange,
  onBackHome,
  onOpenBulkOrder,
  onSelectDispatchLane,
  onGoToCatalogBulk,
}: WholesaleExportPageProps) {
  const [simPartId, setSimPartId] = useState(SPARE_PARTS[0].id);
  const [simQty, setSimQty] = useState(12);

  const selectedPart =
    SPARE_PARTS.find((p) => p.id === simPartId) || SPARE_PARTS[0];
  const oemBase = selectedPart.variants.standard_oem.priceAED;
  const hdBase = selectedPart.variants.heavy_duty.priceAED;
  const oemTier = getBulkTierPricing(oemBase, simQty, 'bulk');
  const hdTier = getBulkTierPricing(hdBase, simQty, 'bulk');
  const oemTotal = oemTier.unitPriceAED * simQty;
  const hdTotal = hdTier.unitPriceAED * simQty;

  const wholesaleWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Al Ahram Auto Parts LLC, I would like to register a Bulk Workshop / Export Trade account. Example estimate: ${simQty}× ${selectedPart.name} (${formatMoney(oemTotal, currency)} OEM / ${formatMoney(hdTotal, currency)} HD).`
  )}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease: GALLERY_EASE }}
      className="py-10 sm:py-16 lg:py-20 bg-[#0B0B0D] min-h-[82vh]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 space-y-14">
        {/* Top Breadcrumb & Currency */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm text-[#D4D7DD] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Flagship Home</span>
          </button>

          <div
            className="inline-flex items-center p-1 bg-[#131317] border border-white/10 rounded-sm"
            role="group"
            aria-label="Wholesale currency toggle"
          >
            {(['AED', 'USD'] as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onCurrencyChange(code)}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-colors cursor-pointer ${
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

        {/* Page Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <p className="text-xs font-mono tracking-widest text-[#DC2626] mb-3">
              B2B Workshop Accounts · Worldwide Container &amp; Air Export
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F5F7] leading-[1.08] mb-5">
              Fleet &amp; Export Trade Desk.
            </h1>
            <p className="text-base text-[#D4D7DD]/85 leading-relaxed max-w-2xl">
              Direct wholesale spare parts supply from Sharjah, UAE to independent specialist garages, fleet operators, and international distributors across the GCC, Africa, Europe, and Asia.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
            <button
              type="button"
              onClick={onOpenBulkOrder}
              className="px-5 py-3 inline-flex items-center gap-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Launch Bulk SKU Importer</span>
            </button>
            <button
              type="button"
              onClick={onGoToCatalogBulk}
              className="px-5 py-3 inline-flex items-center gap-2 text-xs font-medium text-[#D4D7DD] border border-white/20 hover:border-white/50 hover:text-white rounded-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Browse Bulk Catalog</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Workshop Margin & Volume Tier Simulator */}
        <div className="bg-[#131317] border border-white/10 rounded-sm p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="text-xs font-mono text-[#9CA3AF] mb-1">
                Interactive Trade Margin Calculator
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#F4F5F7]">
                Volume Discount Preview (-12% to -22%)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="wholesale-part-select"
                  className="block text-xs text-[#9CA3AF] mb-2"
                >
                  Select Spare Part Assembly
                </label>
                <select
                  id="wholesale-part-select"
                  value={simPartId}
                  onChange={(e) => setSimPartId(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none text-sm text-[#F4F5F7] rounded-sm cursor-pointer"
                >
                  {SPARE_PARTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.categoryName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#9CA3AF]">Order Quantity</span>
                  <span className="font-mono font-semibold text-[#F4F5F7] tabular-nums">
                    {simQty} units · {oemTier.tierLabel}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={simQty}
                  onChange={(e) => setSimQty(Number(e.target.value))}
                  aria-label="Bulk order quantity slider"
                  className="w-full accent-[#DC2626] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9CA3AF] mt-1">
                  <span>1 Unit</span>
                  <span>5+ Workshop (-12%)</span>
                  <span>20+ Export (-22%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-[#0B0B0D] border border-white/10 rounded-sm space-y-2">
              <p className="text-xs font-mono text-[#9CA3AF]">
                Standard OEM · {simQty} Units
              </p>
              <p className="font-mono text-2xl font-semibold text-[#F4F5F7] tabular-nums">
                {formatMoney(oemTotal, currency)}
              </p>
              <p className="text-xs font-mono text-[#D4D7DD] tabular-nums">
                {formatMoney(oemTier.unitPriceAED, currency)} / unit (
                {oemTier.discountPercent}% off)
              </p>
              <p className="text-[11px] text-[#9CA3AF] pt-2 border-t border-white/10">
                SKU: {selectedPart.variants.standard_oem.sku}
              </p>
            </div>

            <div className="p-5 bg-[#0B0B0D] border border-[#DC2626]/50 rounded-sm space-y-2">
              <p className="text-xs font-mono text-[#DC2626]">
                Heavy-Duty · {simQty} Units
              </p>
              <p className="font-mono text-2xl font-semibold text-[#F4F5F7] tabular-nums">
                {formatMoney(hdTotal, currency)}
              </p>
              <p className="text-xs font-mono text-[#D4D7DD] tabular-nums">
                {formatMoney(hdTier.unitPriceAED, currency)} / unit (
                {hdTier.discountPercent}% off)
              </p>
              <p className="text-[11px] text-[#9CA3AF] pt-2 border-t border-white/10">
                SKU: {selectedPart.variants.heavy_duty.sku}
              </p>
            </div>

            <a
              href={wholesaleWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-2 h-11 px-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Request Trade Proforma via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Worldwide Dispatch Architecture */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF] mb-2">
              Global Fulfillment Matrix
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4F5F7]">
              Customs-Cleared Export &amp; Local Express Lanes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(DISPATCH_LANES) as DispatchLane[]).map((key, idx) => {
              const lane = DISPATCH_LANES[key];
              const Icons = [Truck, Globe2, Plane];
              const Icon = Icons[idx] || PackageCheck;
              return (
                <div
                  key={key}
                  className="p-6 bg-[#131317] border border-white/10 rounded-sm flex flex-col justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                      <span className="text-xs font-mono text-[#D4D7DD]">
                        {lane.transit}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#F4F5F7]">
                      {lane.label}
                    </h3>
                    <p className="text-sm text-[#9CA3AF] leading-relaxed">
                      {lane.detail}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDispatchLane(key);
                      onGoToCatalogBulk();
                    }}
                    className="w-full py-2.5 text-xs font-medium text-[#D4D7DD] hover:text-white border border-white/15 hover:border-[#DC2626] rounded-sm transition-colors cursor-pointer"
                  >
                    Select Lane &amp; Build Order
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs text-[#9CA3AF]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
            <span>
              Complete HS-Code Commercial Invoice, Certificate of Origin, and Packing List generated for every international consignment.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <PackageCheck className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
            <span>
              Multi-layer foam &amp; wooden crate protection for CNC cylinder heads, 3-row radiators, and adaptive coilover struts.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
            <span>
              Dedicated export desk reachable 24x7 at +971 55 224 8090 and alahram123@outlook.com.
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
