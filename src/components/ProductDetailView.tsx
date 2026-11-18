import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  Gauge,
  GitCompareArrows,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { isPartCompatible } from '../data/catalog';
import {
  CurrencyCode,
  DutyProfile,
  PricingMode,
  SparePart,
  VariantType,
  VehicleFitment,
} from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { buildSinglePartWhatsAppUrl } from '../utils/whatsapp';
import { AnimatedCounter } from './AnimatedCounter';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface ProductDetailViewProps {
  part: SparePart;
  fitment: VehicleFitment;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  selectedVariant: VariantType;
  isSaved: boolean;
  isCompared: boolean;
  onVariantChange: (variant: VariantType) => void;
  onPricingModeChange: (mode: PricingMode) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onToggleSave: () => void;
  onToggleCompare: () => void;
  onBack: () => void;
  onAddToBag: (partId: string, variantId: VariantType, quantity: number) => void;
}

const DUTY_PROFILES: Record<
  DutyProfile,
  {
    label: string;
    multiplier: number;
    recommendedVariant: VariantType;
    note: string;
  }
> = {
  urban: {
    label: 'Urban Highway',
    multiplier: 1.0,
    recommendedVariant: 'standard_oem',
    note: 'Standard factory operating heat & smooth tarmac load; OEM grade delivers full rated interval.',
  },
  gcc_heavy: {
    label: '50°C+ GCC Traffic & Towing',
    multiplier: 0.78,
    recommendedVariant: 'heavy_duty',
    note: 'Extended stationary idle heat and heavy curb loads favor Heavy-Duty thermal tolerance.',
  },
  desert_offroad: {
    label: 'Desert & Expedition',
    multiplier: 0.68,
    recommendedVariant: 'heavy_duty',
    note: 'Fine silica dust, high shock loads, and sustained RPM make Heavy-Duty essential.',
  },
};

export function ProductDetailView({
  part,
  fitment,
  currency,
  pricingMode,
  selectedVariant,
  isSaved,
  isCompared,
  onVariantChange,
  onPricingModeChange,
  onCurrencyChange,
  onToggleSave,
  onToggleCompare,
  onBack,
  onAddToBag,
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(pricingMode === 'bulk' ? 5 : 1);
  const [justAdded, setJustAdded] = useState(false);
  const [dutyProfile, setDutyProfile] = useState<DutyProfile>('gcc_heavy');

  const variant = part.variants[selectedVariant];
  const tier = getBulkTierPricing(variant.priceAED, quantity, pricingMode);
  const totalAED = tier.unitPriceAED * quantity;

  const activeDuty = DUTY_PROFILES[dutyProfile];
  const projectedKm = Math.round(
    (variant.specs.lifespanKm * activeDuty.multiplier) / 1000
  );
  const projectedMonths = Math.max(6, Math.round((projectedKm * 1000) / 2100));

  const isFitmentSelected = Boolean(fitment.make || fitment.model || fitment.year);
  const fitsActiveVehicle = isPartCompatible(part, fitment);

  const handleModeSwitch = (nextMode: PricingMode) => {
    onPricingModeChange(nextMode);
    if (nextMode === 'bulk' && quantity < 5) {
      setQuantity(5);
    } else if (nextMode === 'retail' && quantity >= 5) {
      setQuantity(1);
    }
  };

  const handleAdd = () => {
    onAddToBag(part.id, selectedVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const whatsappUrl = buildSinglePartWhatsAppUrl({
    part,
    variantId: selectedVariant,
    quantity,
    currency,
    pricingMode,
    fitment,
  });

  return (
    <motion.section
      key={part.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: GALLERY_EASE }}
      className="py-8 sm:py-12 lg:py-20 bg-[#0B0B0D] min-h-[82vh]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Breadcrumb & Currency Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-[#D4D7DD] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Parts Collection</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-[#9CA3AF]">
              {part.categoryName} · {variant.sku}
            </span>
            <button
              type="button"
              onClick={onToggleCompare}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#DC2626] border-[#DC2626] text-white'
                  : 'bg-[#131317] border-white/15 text-[#D4D7DD] hover:text-white'
              }`}
            >
              <GitCompareArrows className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Compare' : 'Compare'}</span>
            </button>
            <button
              type="button"
              onClick={onToggleSave}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#DC2626] border-[#DC2626] text-white'
                  : 'bg-[#131317] border-white/15 text-[#D4D7DD] hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <div
              className="inline-flex items-center p-1 bg-[#131317] border border-white/10 rounded-sm"
              role="group"
              aria-label="Currency selector"
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
        </div>

        {/* Contiguous Two-Column PDP Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Sticky Studio Gallery & Engineering Telemetry */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-[4/3] bg-[#131317] border border-white/10 rounded-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVariant}
                  initial={{ opacity: 0.4, scale: 1.03 }}
                  animate={{
                    opacity: 1,
                    scale: selectedVariant === 'heavy_duty' ? 1.05 : 1,
                  }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.45, ease: GALLERY_EASE }}
                  className="w-full h-full"
                >
                  <SafeImage
                    src={part.image}
                    alt={`${part.name} — ${variant.label}`}
                    className={`w-full h-full object-cover object-center transition-all duration-500 ${
                      selectedVariant === 'heavy_duty'
                        ? 'contrast-110 saturate-110'
                        : 'contrast-100'
                    }`}
                    fallbackLabel={`${part.name} (${variant.shortLabel})`}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Bottom Optical Caption inside Frame */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0B0B0D]/95 via-[#0B0B0D]/60 to-transparent flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-mono text-[#9CA3AF]">
                    Material Specification
                  </p>
                  <p className="text-sm font-medium text-[#F4F5F7]">
                    {variant.materialFinish}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#D4D7DD] shrink-0">
                  {variant.warrantyMonths}-Month Warranty
                </span>
              </div>
            </div>

            {/* Animated Engineering Tolerance & Durability Specs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: GALLERY_EASE }}
              className="bg-[#131317] border border-white/10 rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-sm font-semibold text-[#F4F5F7]">
                  Verified Engineering Tolerances
                </h3>
                <span className="text-xs font-mono text-[#9CA3AF]">
                  {variant.shortLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div>
                  <span className="block text-[11px] text-[#9CA3AF] mb-1">
                    Thermal Rating
                  </span>
                  <span className="text-xl font-semibold text-[#F4F5F7]">
                    <AnimatedCounter value={variant.specs.thermalRatingC} suffix=" °C" />
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-[#9CA3AF] mb-1">
                    Tensile Strength
                  </span>
                  <span className="text-xl font-semibold text-[#F4F5F7]">
                    <AnimatedCounter value={variant.specs.tensileMPa} suffix=" MPa" />
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-[#9CA3AF] mb-1">
                    Service Lifespan
                  </span>
                  <span className="text-xl font-semibold text-[#F4F5F7]">
                    <AnimatedCounter
                      value={Math.round(variant.specs.lifespanKm / 1000)}
                      suffix="k km"
                    />
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-[#9CA3AF] mb-1">
                    CNC Tolerance
                  </span>
                  <span className="text-xl font-semibold text-[#DC2626]">
                    <AnimatedCounter
                      value={variant.specs.toleranceMicron}
                      prefix="±"
                      suffix=" µm"
                    />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Compatible GCC & Global Platforms */}
            <div className="bg-[#131317] border border-white/10 rounded-sm p-6">
              <p className="text-xs font-mono text-[#9CA3AF] mb-3">
                Verified Platform Matrix ({part.yearMin}–{part.yearMax})
              </p>
              <div className="space-y-2 text-xs">
                {part.compatibleMakes.map((make) => {
                  const models = part.compatibleModels[make];
                  if (!models || models.length === 0) return null;
                  return (
                    <div
                      key={make}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1.5 border-b border-white/5 last:border-none"
                    >
                      <span className="font-medium text-[#F4F5F7] min-w-[120px]">
                        {make}
                      </span>
                      <span className="text-[#9CA3AF]">{models.join(' · ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Contiguous Purchase & Configuration Module */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: GALLERY_EASE }}
            className="lg:col-span-6 space-y-7"
          >
            {/* Header & Fitment Status */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#9CA3AF] mb-3">
                <span>{part.categoryName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#D4D7DD]">{variant.oeReference}</span>
                <span aria-hidden="true">·</span>
                <span>{variant.stockStatus}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#F4F5F7] mb-3">
                {part.name}
              </h1>

              <p className="text-base text-[#D4D7DD]/85 leading-relaxed">
                {part.description}
              </p>

              {isFitmentSelected && (
                <div
                  className={`mt-4 flex items-center gap-2 text-sm ${
                    fitsActiveVehicle ? 'text-[#F4F5F7]' : 'text-[#F59E0B]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      fitsActiveVehicle ? 'text-[#DC2626]' : 'text-[#F59E0B]'
                    }`}
                  />
                  <span>
                    {fitsActiveVehicle
                      ? `Guaranteed Fit for ${[fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ')}${fitment.vin ? ` · VIN ${fitment.vin}` : ''}`
                      : `Verify VIN on WhatsApp for ${[fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ')}`}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Variant Toggle: Standard OEM vs Heavy-Duty / Performance */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#9CA3AF]">
                  Select Hardware Grade
                </span>
                <span className="text-xs font-mono text-[#D4D7DD]">
                  SKU: {variant.sku}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['standard_oem', 'heavy_duty'] as VariantType[]).map((vKey) => {
                  const vObj = part.variants[vKey];
                  const active = selectedVariant === vKey;
                  return (
                    <button
                      key={vKey}
                      type="button"
                      onClick={() => onVariantChange(vKey)}
                      className={`p-4 text-left rounded-sm border transition-all duration-150 cursor-pointer ${
                        active
                          ? 'bg-[#1A1A20] border-[#DC2626] text-[#F4F5F7]'
                          : 'bg-[#131317] border-white/10 text-[#9CA3AF] hover:border-white/25 hover:text-[#F4F5F7]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-[#F4F5F7]">
                          {vObj.label}
                        </span>
                        <span className="font-mono text-xs text-[#D4D7DD] tabular-nums">
                          {formatMoney(vObj.priceAED, currency)}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] leading-relaxed">
                        {vObj.summary}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Variant Highlights */}
              <ul className="mt-4 space-y-2">
                {variant.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#D4D7DD]/90"
                  >
                    <Check className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Side-by-Side OEM vs. Heavy-Duty Delta Matrix */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[#9CA3AF]">
                    Side-by-Side Engineering Delta
                  </span>
                  <span className="text-[11px] font-mono text-[#DC2626]">
                    Click column to switch
                  </span>
                </div>

                <div className="overflow-hidden border border-white/10 rounded-sm bg-[#101014]">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#15151B]">
                        <th className="py-2.5 px-3 font-medium text-[#9CA3AF]">
                          Parameter
                        </th>
                        <th className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => onVariantChange('standard_oem')}
                            className={`font-semibold transition-colors cursor-pointer ${
                              selectedVariant === 'standard_oem'
                                ? 'text-white underline underline-offset-4 decoration-[#DC2626]'
                                : 'text-[#9CA3AF] hover:text-white'
                            }`}
                          >
                            Standard OEM
                          </button>
                        </th>
                        <th className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => onVariantChange('heavy_duty')}
                            className={`font-semibold transition-colors cursor-pointer ${
                              selectedVariant === 'heavy_duty'
                                ? 'text-white underline underline-offset-4 decoration-[#DC2626]'
                                : 'text-[#9CA3AF] hover:text-white'
                            }`}
                          >
                            Heavy-Duty
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono tabular-nums">
                      <tr>
                        <td className="py-2 px-3 font-sans text-[#9CA3AF]">
                          Thermal Ceiling
                        </td>
                        <td className="py-2 px-3 text-[#D4D7DD]">
                          {part.variants.standard_oem.specs.thermalRatingC} °C
                        </td>
                        <td className="py-2 px-3 text-[#F4F5F7]">
                          {part.variants.heavy_duty.specs.thermalRatingC} °C
                          <span className="ml-1.5 text-[10px] text-[#DC2626]">
                            +
                            {Math.round(
                              ((part.variants.heavy_duty.specs.thermalRatingC -
                                part.variants.standard_oem.specs.thermalRatingC) /
                                part.variants.standard_oem.specs.thermalRatingC) *
                                100
                            )}
                            %
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-[#9CA3AF]">
                          Tensile Strength
                        </td>
                        <td className="py-2 px-3 text-[#D4D7DD]">
                          {part.variants.standard_oem.specs.tensileMPa} MPa
                        </td>
                        <td className="py-2 px-3 text-[#F4F5F7]">
                          {part.variants.heavy_duty.specs.tensileMPa} MPa
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-[#9CA3AF]">
                          Rated Lifespan
                        </td>
                        <td className="py-2 px-3 text-[#D4D7DD]">
                          {Math.round(
                            part.variants.standard_oem.specs.lifespanKm / 1000
                          )}
                          k km
                        </td>
                        <td className="py-2 px-3 text-[#F4F5F7]">
                          {Math.round(
                            part.variants.heavy_duty.specs.lifespanKm / 1000
                          )}
                          k km
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-[#9CA3AF]">
                          CNC Tolerance
                        </td>
                        <td className="py-2 px-3 text-[#D4D7DD]">
                          ±{part.variants.standard_oem.specs.toleranceMicron} µm
                        </td>
                        <td className="py-2 px-3 text-[#DC2626]">
                          ±{part.variants.heavy_duty.specs.toleranceMicron} µm
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-[#9CA3AF]">
                          Warranty
                        </td>
                        <td className="py-2 px-3 text-[#D4D7DD]">
                          {part.variants.standard_oem.warrantyMonths} Months
                        </td>
                        <td className="py-2 px-3 text-[#F4F5F7]">
                          {part.variants.heavy_duty.warrantyMonths} Months
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GCC Duty & Climate Lifespan Estimator */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#9CA3AF] inline-flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>GCC Climate &amp; Duty Interval Simulator</span>
                  </span>
                  {selectedVariant !== activeDuty.recommendedVariant && (
                    <button
                      type="button"
                      onClick={() => onVariantChange(activeDuty.recommendedVariant)}
                      className="text-[11px] font-mono text-[#DC2626] hover:underline cursor-pointer"
                    >
                      Switch to Recommended ({activeDuty.recommendedVariant === 'heavy_duty' ? 'Heavy-Duty' : 'Standard OEM'})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(DUTY_PROFILES) as DutyProfile[]).map((key) => {
                    const prof = DUTY_PROFILES[key];
                    const active = dutyProfile === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setDutyProfile(key)}
                        className={`px-3 py-2 text-xs font-medium rounded-sm border text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1A1A20] border-[#DC2626] text-white'
                            : 'bg-[#101014] border-white/10 text-[#9CA3AF] hover:text-white'
                        }`}
                      >
                        {prof.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 bg-[#101014] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-md">
                    {activeDuty.note}
                  </p>
                  <div className="sm:text-right shrink-0">
                    <span className="block text-[10px] font-mono text-[#9CA3AF]">
                      Projected Service ({variant.shortLabel})
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#F4F5F7] tabular-nums">
                      ~{projectedKm}k km · {projectedMonths} mo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Tier & Retail / Bulk Workshop Switch */}
            <div className="bg-[#131317] border border-white/10 rounded-sm p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-[#9CA3AF] mb-1">
                    {tier.tierLabel}
                    {tier.discountPercent > 0 && ` · ${tier.discountPercent}% Trade Savings`}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-semibold text-[#F4F5F7] tabular-nums">
                      {formatMoney(totalAED, currency)}
                    </span>
                    <span className="text-xs font-mono text-[#9CA3AF] tabular-nums">
                      ({formatMoney(tier.unitPriceAED, currency)} / unit)
                    </span>
                  </div>
                </div>

                {/* Retail / Bulk Mode Toggle */}
                <div
                  className="inline-flex items-center p-1 bg-[#0B0B0D] border border-white/10 rounded-sm"
                  role="group"
                  aria-label="Order pricing tier"
                >
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('retail')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      pricingMode === 'retail'
                        ? 'bg-[#F4F5F7] text-[#0B0B0D]'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    Retail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('bulk')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      pricingMode === 'bulk'
                        ? 'bg-[#DC2626] text-white'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    Bulk Workshop
                  </button>
                </div>
              </div>

              {/* Bulk Tier Reference Strip */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
                <div className="p-2.5 bg-[#0B0B0D] border border-white/10 rounded-sm">
                  <span className="block text-[#9CA3AF]">1–4 Units</span>
                  <span className="font-mono font-medium text-[#F4F5F7] tabular-nums">
                    {formatMoney(variant.priceAED, currency)}
                  </span>
                </div>
                <div className="p-2.5 bg-[#0B0B0D] border border-white/10 rounded-sm">
                  <span className="block text-[#9CA3AF]">5–19 Workshop (-12%)</span>
                  <span className="font-mono font-medium text-[#F4F5F7] tabular-nums">
                    {formatMoney(Math.round(variant.priceAED * 0.88), currency)}
                  </span>
                </div>
                <div className="p-2.5 bg-[#0B0B0D] border border-white/10 rounded-sm">
                  <span className="block text-[#9CA3AF]">20+ Fleet (-22%)</span>
                  <span className="font-mono font-medium text-[#DC2626] tabular-nums">
                    {formatMoney(Math.round(variant.priceAED * 0.78), currency)}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper + Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <div className="inline-flex items-center justify-between bg-[#0B0B0D] border border-white/15 rounded-sm h-12 px-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono text-sm font-medium text-[#F4F5F7] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-9 h-9 flex items-center justify-center text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 h-12 px-5 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{justAdded ? 'Added to Quote Bag' : 'Add to Quote Bag'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-5 inline-flex items-center justify-center gap-2 text-sm font-medium text-[#F4F5F7] bg-[#1A1A20] border border-white/20 hover:border-white/50 transition-colors rounded-sm whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9CA3AF] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span>
                  100% secure sourcing · Worldwide air &amp; sea dispatch from UAE · 24x7 specialist support
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
