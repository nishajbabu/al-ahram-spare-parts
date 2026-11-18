import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, GitCompareArrows, Plus, X } from 'lucide-react';
import {
  CurrencyCode,
  PricingMode,
  SparePart,
  VariantType,
} from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface CompareDockAndModalProps {
  compareParts: SparePart[];
  isOpen: boolean;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onRemovePart: (partId: string) => void;
  onClearCompare: () => void;
  onSelectPart: (part: SparePart) => void;
  onAddToBag: (partId: string, variantId: VariantType, qty: number) => void;
}

export function CompareDockAndModal({
  compareParts,
  isOpen,
  currency,
  pricingMode,
  onOpenModal,
  onCloseModal,
  onRemovePart,
  onClearCompare,
  onSelectPart,
  onAddToBag,
}: CompareDockAndModalProps) {
  const qty = pricingMode === 'bulk' ? 5 : 1;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCloseModal]);

  return (
    <>
      {/* Floating Comparison Dock — positioned bottom-left so it never overlaps bottom-right WhatsApp */}
      <AnimatePresence>
        {compareParts.length > 0 && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.3, ease: GALLERY_EASE }}
            className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 sm:bottom-5 sm:left-6 z-40 max-w-[calc(100vw-4.5rem)] sm:max-w-xl bg-[#131317]/95 backdrop-blur-md border border-white/20 rounded-sm shadow-2xl px-3 sm:px-3.5 py-2.5 flex flex-wrap items-center gap-2.5 sm:gap-3"
            role="region"
            aria-label="Part comparison tray"
          >
            <div className="flex items-center gap-2 text-xs text-[#F4F5F7] shrink-0">
              <GitCompareArrows className="w-3.5 h-3.5 text-[#DC2626]" />
              <span className="font-mono tabular-nums font-medium">
                Compare ({compareParts.length}/3)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {compareParts.map((part) => (
                <span
                  key={part.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0B0B0D] border border-white/15 rounded-sm text-[11px] text-[#D4D7DD] max-w-[150px]"
                >
                  <span className="truncate">{part.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemovePart(part.id)}
                    aria-label={`Remove ${part.name} from compare`}
                    className="text-[#9CA3AF] hover:text-white cursor-pointer shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClearCompare}
                className="text-[11px] text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onOpenModal}
                disabled={compareParts.length < 2}
                className="px-3 py-1.5 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-45 disabled:cursor-not-allowed rounded-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                {compareParts.length < 2 ? 'Add 1 More' : 'Compare Specs'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Side-by-Side Comparison Matrix Modal */}
      <AnimatePresence>
        {isOpen && compareParts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[65] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Hardware Specification Comparison"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: GALLERY_EASE }}
              className="w-full max-w-5xl bg-[#111116] border border-white/20 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 bg-[#14141A] border-b border-white/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-[#DC2626]">
                    Engineering Comparison Matrix
                  </p>
                  <h3 className="font-display text-lg font-semibold text-[#F4F5F7]">
                    Side-by-Side Hardware Specifications ({compareParts.length} Selected)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={onCloseModal}
                  aria-label="Close comparison matrix"
                  className="w-9 h-9 inline-flex items-center justify-center text-[#9CA3AF] hover:text-white border border-white/15 hover:border-white/40 rounded-sm transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <table className="w-full min-w-[680px] text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/15 align-top">
                      <th className="py-3 pr-4 w-44 text-[#9CA3AF] font-mono font-normal">
                        Specification
                      </th>
                      {compareParts.map((part) => (
                        <th key={part.id} className="py-3 px-4 w-64 align-top">
                          <div className="relative aspect-[4/3] bg-[#0B0B0D] border border-white/10 rounded-sm overflow-hidden mb-3">
                            <SafeImage
                              src={part.image}
                              alt={part.name}
                              className="w-full h-full object-cover"
                              fallbackLabel={part.name}
                            />
                            <button
                              type="button"
                              onClick={() => onRemovePart(part.id)}
                              aria-label={`Remove ${part.name}`}
                              className="absolute top-2 right-2 w-6 h-6 bg-black/75 border border-white/20 rounded-sm flex items-center justify-center text-[#D4D7DD] hover:text-white cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] font-mono text-[#9CA3AF] font-normal">
                            {part.categoryName}
                          </p>
                          <p className="font-display text-sm font-semibold text-[#F4F5F7] mt-0.5">
                            {part.name}
                          </p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">Standard OEM Price</td>
                      {compareParts.map((part) => {
                        const tier = getBulkTierPricing(
                          part.variants.standard_oem.priceAED,
                          qty,
                          pricingMode
                        );
                        return (
                          <td
                            key={part.id}
                            className="py-3 px-4 font-mono tabular-nums text-[#F4F5F7]"
                          >
                            {formatMoney(tier.unitPriceAED, currency)}
                            <span className="block text-[10px] text-[#9CA3AF]">
                              {part.variants.standard_oem.sku}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">Heavy-Duty Price</td>
                      {compareParts.map((part) => {
                        const tier = getBulkTierPricing(
                          part.variants.heavy_duty.priceAED,
                          qty,
                          pricingMode
                        );
                        return (
                          <td
                            key={part.id}
                            className="py-3 px-4 font-mono tabular-nums text-[#F4F5F7]"
                          >
                            {formatMoney(tier.unitPriceAED, currency)}
                            <span className="block text-[10px] text-[#DC2626]">
                              {part.variants.heavy_duty.sku}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">OE Reference</td>
                      {compareParts.map((part) => (
                        <td key={part.id} className="py-3 px-4 font-mono text-[#D4D7DD]">
                          {part.variants.standard_oem.oeReference}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">
                        Peak Thermal Rating (HD)
                      </td>
                      {compareParts.map((part) => (
                        <td
                          key={part.id}
                          className="py-3 px-4 font-mono tabular-nums text-[#F4F5F7]"
                        >
                          {part.variants.heavy_duty.specs.thermalRatingC} °C
                          <span className="ml-1.5 text-[10px] text-[#9CA3AF]">
                            (OEM {part.variants.standard_oem.specs.thermalRatingC} °C)
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">
                        Tensile Yield (HD)
                      </td>
                      {compareParts.map((part) => (
                        <td
                          key={part.id}
                          className="py-3 px-4 font-mono tabular-nums text-[#F4F5F7]"
                        >
                          {part.variants.heavy_duty.specs.tensileMPa} MPa
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">
                        Service Lifespan (HD)
                      </td>
                      {compareParts.map((part) => (
                        <td
                          key={part.id}
                          className="py-3 px-4 font-mono tabular-nums text-[#F4F5F7]"
                        >
                          {Math.round(part.variants.heavy_duty.specs.lifespanKm / 1000)}k km
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">
                        CNC Tolerance (HD)
                      </td>
                      {compareParts.map((part) => (
                        <td
                          key={part.id}
                          className="py-3 px-4 font-mono tabular-nums text-[#DC2626]"
                        >
                          ±{part.variants.heavy_duty.specs.toleranceMicron} µm
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">Warranty Coverage</td>
                      {compareParts.map((part) => (
                        <td
                          key={part.id}
                          className="py-3 px-4 font-mono tabular-nums text-[#D4D7DD]"
                        >
                          {part.variants.standard_oem.warrantyMonths} mo OEM ·{' '}
                          {part.variants.heavy_duty.warrantyMonths} mo HD
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-[#9CA3AF]">Compatible Makes</td>
                      {compareParts.map((part) => (
                        <td key={part.id} className="py-3 px-4 text-[#D4D7DD]">
                          {part.compatibleMakes.join(' · ')}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-4 pr-4 text-[#9CA3AF]">Quick Actions</td>
                      {compareParts.map((part) => (
                        <td key={part.id} className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onAddToBag(part.id, 'heavy_duty', qty);
                                onCloseModal();
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add HD</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onCloseModal();
                                onSelectPart(part);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#D4D7DD] border border-white/20 hover:border-white/45 rounded-sm transition-colors cursor-pointer"
                            >
                              <span>Inspect</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
