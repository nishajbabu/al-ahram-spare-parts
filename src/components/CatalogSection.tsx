import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  ClipboardList,
  GitCompareArrows,
  Layers,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { CATEGORIES, isPartCompatible, SPARE_PARTS } from '../data/catalog';
import {
  CatalogSortOption,
  CategoryId,
  CurrencyCode,
  PricingMode,
  SparePart,
  VariantType,
  VehicleFitment,
} from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

const SERVICE_BUNDLES: Array<{
  id: string;
  title: string;
  subtitle: string;
  items: Array<{ partId: string; variantId: VariantType }>;
}> = [
  {
    id: 'summer-cooling',
    title: 'GCC Summer Cooling Overhaul',
    subtitle: 'Billet Water Pump + 3-Row Aluminum Radiator',
    items: [
      { partId: 'water-pump', variantId: 'heavy_duty' },
      { partId: 'radiator-ac-core', variantId: 'heavy_duty' },
    ],
  },
  {
    id: 'braking-refresh',
    title: 'Complete Braking Refresh',
    subtitle: 'Ventilated Rotors & Pads + Hydraulic Master Cylinder',
    items: [
      { partId: 'brake-pads-rotors', variantId: 'heavy_duty' },
      { partId: 'master-cylinder', variantId: 'standard_oem' },
    ],
  },
  {
    id: 'desert-service',
    title: '10,000 km Desert Service Pack',
    subtitle: 'Oil/Fuel/Air Filter Kit + Laser Iridium Spark Plugs',
    items: [
      { partId: 'oil-fuel-air-filters', variantId: 'heavy_duty' },
      { partId: 'spark-plugs', variantId: 'standard_oem' },
    ],
  },
];

interface CatalogSectionProps {
  selectedCategory: CategoryId | 'all';
  onlyFastMoving: boolean;
  onlySaved: boolean;
  sortBy: CatalogSortOption;
  searchQuery: string;
  fitment: VehicleFitment;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  savedPartIds: string[];
  comparePartIds: string[];
  onCategoryChange: (category: CategoryId | 'all') => void;
  onFastMovingChange: (val: boolean) => void;
  onOnlySavedChange: (val: boolean) => void;
  onSortChange: (sort: CatalogSortOption) => void;
  onSearchChange: (val: string) => void;
  onPricingModeChange: (mode: PricingMode) => void;
  onSelectPart: (part: SparePart) => void;
  onToggleSavePart: (partId: string) => void;
  onToggleComparePart: (partId: string) => void;
  onQuickAddPart: (partId: string, variantId: VariantType) => void;
  onOpenBulkOrder: () => void;
  onAddBundle: (items: Array<{ partId: string; variantId: VariantType }>) => void;
  onResetFilters: () => void;
}

export function CatalogSection({
  selectedCategory,
  onlyFastMoving,
  onlySaved,
  sortBy,
  searchQuery,
  fitment,
  currency,
  pricingMode,
  savedPartIds,
  comparePartIds,
  onCategoryChange,
  onFastMovingChange,
  onOnlySavedChange,
  onSortChange,
  onSearchChange,
  onPricingModeChange,
  onSelectPart,
  onToggleSavePart,
  onToggleComparePart,
  onQuickAddPart,
  onOpenBulkOrder,
  onAddBundle,
  onResetFilters,
}: CatalogSectionProps) {
  const isFitmentActive = Boolean(fitment.make || fitment.model || fitment.year);

  const filteredParts = SPARE_PARTS.filter((part) => {
    if (selectedCategory !== 'all' && part.categoryId !== selectedCategory) {
      return false;
    }
    if (onlyFastMoving && !part.fastMoving) {
      return false;
    }
    if (onlySaved && !savedPartIds.includes(part.id)) {
      return false;
    }
    if (!isPartCompatible(part, fitment)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const modelsJoined = Object.values(part.compatibleModels)
        .flat()
        .join(' ')
        .toLowerCase();
      const makesJoined = part.compatibleMakes.join(' ').toLowerCase();
      const matchesText =
        part.name.toLowerCase().includes(q) ||
        part.categoryName.toLowerCase().includes(q) ||
        part.tagline.toLowerCase().includes(q) ||
        part.variants.standard_oem.sku.toLowerCase().includes(q) ||
        part.variants.standard_oem.oeReference.toLowerCase().includes(q) ||
        part.variants.heavy_duty.sku.toLowerCase().includes(q) ||
        makesJoined.includes(q) ||
        modelsJoined.includes(q);
      if (!matchesText) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') {
      return a.variants.standard_oem.priceAED - b.variants.standard_oem.priceAED;
    }
    if (sortBy === 'price_desc') {
      return b.variants.standard_oem.priceAED - a.variants.standard_oem.priceAED;
    }
    if (sortBy === 'thermal_desc') {
      return (
        b.variants.heavy_duty.specs.thermalRatingC -
        a.variants.heavy_duty.specs.thermalRatingC
      );
    }
    if (sortBy === 'warranty_desc') {
      return (
        b.variants.heavy_duty.warrantyMonths - a.variants.heavy_duty.warrantyMonths
      );
    }
    // Featured: fast-moving first
    return Number(b.fastMoving) - Number(a.fastMoving);
  });

  const activeCategoryMeta =
    selectedCategory === 'all'
      ? null
      : CATEGORIES.find((c) => c.id === selectedCategory) || null;

  return (
    <section id="catalog" className="py-14 sm:py-20 lg:py-28 bg-[#0B0B0D] border-b border-white/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Heading + Pricing Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF] mb-3">
              02. Spare Parts Collection
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
              {activeCategoryMeta ? activeCategoryMeta.name : 'All Precision Assemblies'}
            </h2>
            {activeCategoryMeta && (
              <p className="mt-2 text-sm text-[#9CA3AF] max-w-xl">
                {activeCategoryMeta.description}
              </p>
            )}
          </div>

          {/* Retail vs Bulk Workshop Mode & Fast-Moving Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center p-1 bg-[#131317] border border-white/10 rounded-sm"
              role="group"
              aria-label="Catalog pricing mode"
            >
              <button
                type="button"
                onClick={() => onPricingModeChange('retail')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  pricingMode === 'retail'
                    ? 'bg-[#F4F5F7] text-[#0B0B0D]'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                Retail Single Unit
              </button>
              <button
                type="button"
                onClick={() => onPricingModeChange('bulk')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  pricingMode === 'bulk'
                    ? 'bg-[#DC2626] text-white'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                Bulk Workshop (-12% to -22%)
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs + Search + Fast-Moving */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => onCategoryChange('all')}
              className={`px-4 py-2 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#DC2626] border-[#DC2626] text-white'
                  : 'bg-[#131317] border-white/10 text-[#9CA3AF] hover:text-white hover:border-white/25'
              }`}
            >
              All Categories ({SPARE_PARTS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#DC2626] border-[#DC2626] text-white'
                    : 'bg-[#131317] border-white/10 text-[#9CA3AF] hover:text-white hover:border-white/25'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search part, model, SKU, or OE number..."
                aria-label="Search spare parts by name, model, SKU, or OE reference"
                className="w-full h-10 pl-10 pr-9 bg-[#131317] border border-white/10 focus:border-[#DC2626] focus:outline-none text-base sm:text-sm text-[#F4F5F7] placeholder:text-[#6B7280] rounded-sm transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onFastMovingChange(!onlyFastMoving)}
                className={`px-3 py-2 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  onlyFastMoving
                    ? 'bg-[#1A1A20] border-[#DC2626] text-white'
                    : 'bg-transparent border-white/15 text-[#9CA3AF] hover:text-white'
                }`}
              >
                {onlyFastMoving ? 'Fast-Moving Active' : 'Fast-Moving Only'}
              </button>

              <button
                type="button"
                onClick={() => onOnlySavedChange(!onlySaved)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  onlySaved
                    ? 'bg-[#1A1A20] border-[#DC2626] text-white'
                    : 'bg-transparent border-white/15 text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved ({savedPartIds.length})</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
                aria-label="Sort spare parts"
                className="h-9 px-3 bg-[#131317] border border-white/15 focus:border-[#DC2626] focus:outline-none text-base sm:text-xs text-[#D4D7DD] rounded-sm cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="thermal_desc">Thermal Ceiling</option>
                <option value="warranty_desc">Longest Warranty</option>
              </select>

              <button
                type="button"
                onClick={onOpenBulkOrder}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F4F5F7] bg-[#131317] border border-white/20 hover:border-[#DC2626] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Bulk SKU Order</span>
              </button>

              <span className="text-xs font-mono tabular-nums text-[#9CA3AF] ml-1">
                {filteredParts.length} {filteredParts.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>

          {/* Curated Service & Overhaul Bundles */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF] mb-3">
              <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>One-Click Workshop Overhaul Bundles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SERVICE_BUNDLES.map((bundle) => {
                const bundleTotalAED = bundle.items.reduce((sum, item) => {
                  const p = SPARE_PARTS.find((sp) => sp.id === item.partId);
                  if (!p) return sum;
                  const unitAED = p.variants[item.variantId].priceAED;
                  const tier = getBulkTierPricing(
                    unitAED,
                    pricingMode === 'bulk' ? 5 : 1,
                    pricingMode
                  );
                  return sum + tier.unitPriceAED;
                }, 0);

                return (
                  <button
                    key={bundle.id}
                    type="button"
                    onClick={() => onAddBundle(bundle.items)}
                    className="p-3.5 bg-[#131317] border border-white/10 hover:border-[#DC2626]/70 rounded-sm flex items-center justify-between gap-3 text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F4F5F7] group-hover:text-white truncate">
                        {bundle.title}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                        {bundle.subtitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-mono text-xs text-[#F4F5F7] tabular-nums">
                        {formatMoney(bundleTotalAED, currency)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#DC2626]">
                        <Plus className="w-3 h-3" />
                        <span>Add Kit</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredParts.length === 0 ? (
          <div className="py-20 px-6 text-center bg-[#131317] border border-white/10 rounded-sm">
            <p className="font-display text-xl text-[#F4F5F7] mb-2">
              No assemblies match the active filter combination.
            </p>
            <p className="text-sm text-[#9CA3AF] mb-6 max-w-md mx-auto">
              Clear your search term or reset category and vehicle fitment filters to view available inventory.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="px-5 py-2.5 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredParts.map((part, index) => {
              const oem = part.variants.standard_oem;
              const hd = part.variants.heavy_duty;
              const oemTier = getBulkTierPricing(
                oem.priceAED,
                pricingMode === 'bulk' ? 5 : 1,
                pricingMode
              );

              const isSaved = savedPartIds.includes(part.id);
              const isCompared = comparePartIds.includes(part.id);

              return (
                <motion.article
                  key={part.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.04, 0.25),
                    ease: GALLERY_EASE,
                  }}
                  onClick={() => onSelectPart(part)}
                  className="group bg-[#131317] border border-white/10 hover:border-white/25 rounded-sm overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div>
                    {/* 4:3 Studio Hardware Image */}
                    <div className="relative aspect-[4/3] bg-[#0B0B0D] overflow-hidden border-b border-white/10">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          background:
                            'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.20) 0%, rgba(212,215,221,0.08) 42%, transparent 74%)',
                        }}
                      />
                      <SafeImage
                        src={part.image}
                        alt={part.name}
                        className="relative z-10 w-full h-full object-cover object-center mix-blend-lighten group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        fallbackLabel={part.name}
                      />

                      {/* Subtle Top-Right Action Controls (Save & Compare) */}
                      <div
                        className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onToggleComparePart(part.id)}
                          aria-label={isCompared ? `Remove ${part.name} from compare` : `Compare ${part.name}`}
                          className={`h-7 px-2 inline-flex items-center gap-1 text-[11px] font-medium rounded-sm border backdrop-blur-md transition-colors cursor-pointer ${
                            isCompared
                              ? 'bg-[#DC2626] border-[#DC2626] text-white'
                              : 'bg-[#0B0B0D]/80 border-white/15 text-[#D4D7DD] hover:text-white hover:border-white/40'
                          }`}
                        >
                          <GitCompareArrows className="w-3 h-3" />
                          <span>{isCompared ? 'Compared' : 'Compare'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleSavePart(part.id)}
                          aria-label={isSaved ? `Remove ${part.name} from shortlist` : `Save ${part.name} to shortlist`}
                          className={`w-7 h-7 inline-flex items-center justify-center rounded-sm border backdrop-blur-md transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-[#DC2626] border-[#DC2626] text-white'
                              : 'bg-[#0B0B0D]/80 border-white/15 text-[#D4D7DD] hover:text-white hover:border-white/40'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Content: Strict Unboxed Metadata & Clean Hierarchy */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-2">
                        <span>{part.categoryName}</span>
                        {part.fastMoving && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#D4D7DD]">Fast-Moving</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-semibold text-[#F4F5F7] group-hover:text-white transition-colors mb-2">
                        {part.name}
                      </h3>

                      <p className="text-sm text-[#9CA3AF] leading-relaxed line-clamp-2 mb-4">
                        {part.tagline}
                      </p>

                      {isFitmentActive && (
                        <div className="flex items-center gap-1.5 text-xs text-[#F4F5F7] mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                          <span>
                            Guaranteed Fit ·{' '}
                            {[fitment.year, fitment.make, fitment.model]
                              .filter(Boolean)
                              .join(' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Baseline: Price + Quick Add + Inspect CTA */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-mono text-[#9CA3AF]">
                        {pricingMode === 'bulk' ? 'Workshop Tier (5+)' : 'OEM From'}
                      </span>
                      <span className="font-mono text-base font-medium text-[#F4F5F7] tabular-nums">
                        {formatMoney(oemTier.unitPriceAED, currency)}
                      </span>
                      <span className="ml-2 text-[11px] font-mono text-[#9CA3AF]">
                        / HD {formatMoney(
                          getBulkTierPricing(
                            hd.priceAED,
                            pricingMode === 'bulk' ? 5 : 1,
                            pricingMode
                          ).unitPriceAED,
                          currency
                        )}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onQuickAddPart(part.id, 'standard_oem')}
                        className="px-2.5 py-1.5 text-[11px] font-medium text-[#D4D7DD] hover:text-white bg-[#0B0B0D] border border-white/15 hover:border-[#DC2626] rounded-sm transition-colors cursor-pointer"
                        title="Quick add Standard OEM to Quote Bag"
                      >
                        + Bag
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectPart(part)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#D4D7DD] group-hover:text-[#DC2626] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Configure</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
