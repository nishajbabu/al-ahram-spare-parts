import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Plus } from 'lucide-react';
import {
  CATEGORIES,
  CHASSIS_HOTSPOTS,
  CHASSIS_IMAGE_PATH,
  isPartCompatible,
  SPARE_PARTS,
} from '../data/catalog';
import { CategoryId, CurrencyCode, PricingMode, VehicleFitment } from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface ChassisExplorerProps {
  fitment: VehicleFitment;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  onSelectCategory: (categoryId: CategoryId) => void;
  onInspectPart: (partId: string) => void;
}

export function ChassisExplorer({
  fitment,
  currency,
  pricingMode,
  onSelectCategory,
  onInspectPart,
}: ChassisExplorerProps) {
  const [activeId, setActiveId] = useState<CategoryId>('braking');

  const activeHotspot =
    CHASSIS_HOTSPOTS.find((h) => h.id === activeId) || CHASSIS_HOTSPOTS[0];
  const activeCategory =
    CATEGORIES.find((c) => c.id === activeId) || CATEGORIES[0];
  const allZoneParts = SPARE_PARTS.filter((p) => p.categoryId === activeId);
  const compatibleZoneParts = allZoneParts.filter((p) =>
    isPartCompatible(p, fitment)
  );
  const hasFitment = Boolean(fitment.make);
  const vehicleLabel = [fitment.make, fitment.model, fitment.year]
    .filter(Boolean)
    .join(' · ');
  const displayedParts =
    hasFitment && compatibleZoneParts.length > 0
      ? compatibleZoneParts
      : allZoneParts;

  return (
    <section
      id="chassis-explorer"
      className="py-14 sm:py-20 lg:py-28 bg-[#0B0B0D] border-b border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF] mb-2 sm:mb-3">
              01. Interactive Chassis Architecture
              {vehicleLabel ? (
                <span className="text-[#DC2626]"> · {vehicleLabel}</span>
              ) : null}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
              Precision, Distilled by System.
            </h2>
          </div>
          <p className="text-sm text-[#9CA3AF] max-w-md leading-relaxed">
            Select any mechanical zone on the chassis silhouette to inspect engineering tolerances and jump directly to compatible OEM or Heavy-Duty hardware.
          </p>
        </div>

        {/* Split Layout: Left Interactive Chassis Profile + Right Synchronized Spec Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Interactive Vehicle Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-[#08080A] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between">
            {/* True 16:9 Stage locks image and hotspot coordinates across all screen widths */}
            <div className="relative w-full aspect-[16/9] bg-[#060608] flex items-center justify-center overflow-hidden">
              <SafeImage
                src={CHASSIS_IMAGE_PATH}
                alt="Side profile performance chassis highlighting mechanical system hotspots"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                fallbackLabel="Interactive Chassis Profile"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/60 via-transparent to-[#08080A]/20 pointer-events-none" />

              {/* Interactive Hotspots */}
              {CHASSIS_HOTSPOTS.map((spot) => {
                const isSelected = spot.id === activeId;
                const labelAlignClass =
                  spot.xPercent < 22
                    ? 'left-0 translate-x-0'
                    : spot.xPercent > 75
                      ? 'right-0 translate-x-0'
                      : 'left-1/2 -translate-x-1/2';

                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveId(spot.id)}
                    style={{
                      left: `${spot.xPercent}%`,
                      top: `${spot.yPercent}%`,
                    }}
                    aria-label={`Inspect ${spot.label} (${spot.zoneName})`}
                    aria-pressed={isSelected}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus-visible:outline-none p-1"
                  >
                    {isSelected && (
                      <motion.span
                        aria-hidden="true"
                        initial={{ scale: 0.9, opacity: 0.7 }}
                        animate={{ scale: [1, 1.85], opacity: [0.7, 0] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                        className="absolute inset-1 rounded-full border border-[#DC2626]"
                      />
                    )}
                    <span
                      className={`relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full border transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#DC2626] border-white text-white scale-110 shadow-[0_0_20px_rgba(220,38,38,0.65)]'
                          : 'bg-[#0B0B0D]/85 border-white/60 text-[#F4F5F7] hover:border-white hover:scale-105'
                      }`}
                    >
                      <Plus
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 ${
                          isSelected ? 'rotate-45' : ''
                        }`}
                      />
                    </span>

                    <span
                      className={`hidden sm:block absolute ${labelAlignClass} mt-2 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap rounded-sm border transition-opacity duration-200 pointer-events-none ${
                        isSelected
                          ? 'opacity-100 bg-[#0B0B0D]/95 border-[#DC2626]/70 text-white shadow-lg'
                          : 'opacity-0 group-hover:opacity-100 bg-[#0B0B0D]/90 border-white/15 text-[#D4D7DD]'
                      }`}
                    >
                      {spot.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clean Dedicated Telemetry Footer Strip below Vehicle Frame */}
            <div className="bg-[#0E0E12] border-t border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9CA3AF]">
              <span className="font-mono text-[#D4D7DD]">
                {vehicleLabel ? `${vehicleLabel} · ` : ''}
                {activeHotspot.zoneName} · {activeHotspot.label}
              </span>
              <span className="font-mono tabular-nums text-[#F4F5F7]">
                {activeHotspot.keyMetricLabel}:{' '}
                <span className="text-[#DC2626]">{activeHotspot.keyMetricValue}</span>
              </span>
            </div>
          </div>

          {/* Synchronized Inspection Panel (4 cols) */}
          <div className="lg:col-span-4 relative bg-[#131317] border border-white/10 rounded-sm p-5 sm:p-7 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: GALLERY_EASE }}
                className="space-y-5 sm:space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#9CA3AF] mb-2">
                    <span className="truncate">{activeHotspot.zoneName}</span>
                    <span className="text-[#DC2626] tabular-nums shrink-0">
                      {activeHotspot.keyMetricValue}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F4F5F7] mb-2.5 sm:mb-3">
                    {activeCategory.name}
                  </h3>
                  <p className="text-sm text-[#D4D7DD]/80 leading-relaxed">
                    {activeHotspot.summary}
                  </p>
                </div>

                {/* System Parts Quick List */}
                <div className="border-t border-white/10 pt-4 sm:pt-5 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-mono text-[#9CA3AF]">
                      {hasFitment && compatibleZoneParts.length > 0
                        ? `Matched for ${fitment.make}`
                        : 'Assemblies in this zone'}
                    </p>
                    {hasFitment && compatibleZoneParts.length === 0 && (
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hello Al Ahram Auto Spare Parts, please confirm ${activeCategory.name} fitment for my ${vehicleLabel || fitment.make}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-[#DC2626] hover:underline"
                      >
                        VIN Check on WhatsApp →
                      </a>
                    )}
                  </div>
                  <div className="divide-y divide-white/10">
                    {displayedParts.map((part) => {
                      const basePrice = part.variants.standard_oem.priceAED;
                      const tier = getBulkTierPricing(
                        basePrice,
                        pricingMode === 'bulk' ? 5 : 1,
                        pricingMode
                      );
                      return (
                        <button
                          key={part.id}
                          type="button"
                          onClick={() => onInspectPart(part.id)}
                          className="w-full py-3 flex items-center justify-between gap-4 text-left group cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#F4F5F7] group-hover:text-[#DC2626] transition-colors truncate">
                              {part.name}
                            </p>
                            <p className="text-xs font-mono text-[#9CA3AF] tabular-nums">
                              From {formatMoney(tier.unitPriceAED, currency)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => onSelectCategory(activeHotspot.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm cursor-pointer"
              >
                <span>Browse {activeCategory.shortName} Parts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal 7-System Selector Strip for Keyboard & Touch Parity */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {CHASSIS_HOTSPOTS.map((spot, idx) => {
            const isSelected = spot.id === activeId;
            const spanClass =
              idx === CHASSIS_HOTSPOTS.length - 1
                ? 'col-span-2 sm:col-span-2 lg:col-span-1'
                : '';
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveId(spot.id)}
                className={`px-3 py-2.5 text-left rounded-sm border transition-colors cursor-pointer ${spanClass} ${
                  isSelected
                    ? 'bg-[#1A1A20] border-[#DC2626] text-[#F4F5F7]'
                    : 'bg-[#101014] border-white/10 text-[#9CA3AF] hover:text-[#F4F5F7] hover:border-white/25'
                }`}
              >
                <span className="block text-xs font-medium truncate">
                  {spot.label}
                </span>
                <span className="block text-[11px] font-mono text-[#9CA3AF] mt-0.5 truncate">
                  {spot.keyMetricValue}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
