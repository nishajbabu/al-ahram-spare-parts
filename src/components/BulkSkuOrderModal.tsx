import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ClipboardList, Plus, X } from 'lucide-react';
import { SPARE_PARTS } from '../data/catalog';
import {
  CurrencyCode,
  PricingMode,
  SparePart,
  VariantType,
} from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

const SAMPLE_WORKSHOP_MANIFEST = `AA-BRK-4012-HD, 6
AA-WTP-3108-HD, 4
43512-60210, 8
AA-FLT-1055-OEM, 12
AA-STR-8804-HD, 2`;

interface ParsedLine {
  raw: string;
  query: string;
  quantity: number;
  match: {
    part: SparePart;
    variantId: VariantType;
  } | null;
}

function parseManifestText(rawText: string): ParsedLine[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((raw) => {
    // Support "SKU, qty" | "SKU x qty" | "SKU * qty" | "SKU qty" | "SKU"
    let queryPart = raw;
    let quantity = 1;

    const commaMatch = raw.match(/^(.+?)[,;\t]+\s*(\d+)\s*$/);
    const multMatch = raw.match(/^(.+?)\s+[xX×*]\s*(\d+)\s*$/);
    const spaceQtyMatch = raw.match(/^(.+?)\s+(\d+)\s*$/);

    if (commaMatch) {
      queryPart = commaMatch[1].trim();
      quantity = Math.max(1, parseInt(commaMatch[2], 10));
    } else if (multMatch) {
      queryPart = multMatch[1].trim();
      quantity = Math.max(1, parseInt(multMatch[2], 10));
    } else if (spaceQtyMatch && spaceQtyMatch[1].length >= 4) {
      queryPart = spaceQtyMatch[1].trim();
      quantity = Math.max(1, parseInt(spaceQtyMatch[2], 10));
    }

    const q = queryPart.toLowerCase();
    let found: { part: SparePart; variantId: VariantType } | null = null;

    for (const part of SPARE_PARTS) {
      const oem = part.variants.standard_oem;
      const hd = part.variants.heavy_duty;

      if (hd.sku.toLowerCase() === q || hd.oeReference.toLowerCase().includes(q)) {
        found = { part, variantId: 'heavy_duty' };
        break;
      }
      if (oem.sku.toLowerCase() === q || oem.oeReference.toLowerCase().includes(q)) {
        found = { part, variantId: 'standard_oem' };
        break;
      }
    }

    if (!found && q.length >= 3) {
      for (const part of SPARE_PARTS) {
        const oem = part.variants.standard_oem;
        const hd = part.variants.heavy_duty;
        if (
          hd.sku.toLowerCase().includes(q) ||
          (q.includes('heavy') && part.name.toLowerCase().includes(q.replace('heavy', '').trim()))
        ) {
          found = { part, variantId: 'heavy_duty' };
          break;
        }
        if (
          oem.sku.toLowerCase().includes(q) ||
          part.name.toLowerCase().includes(q)
        ) {
          found = { part, variantId: 'standard_oem' };
          break;
        }
      }
    }

    return { raw, query: queryPart, quantity, match: found };
  });
}

interface BulkSkuOrderModalProps {
  isOpen: boolean;
  currency: CurrencyCode;
  pricingMode: PricingMode;
  onClose: () => void;
  onAddBulkLines: (
    entries: Array<{ partId: string; variantId: VariantType; quantity: number }>
  ) => void;
}

export function BulkSkuOrderModal({
  isOpen,
  currency,
  pricingMode,
  onClose,
  onAddBulkLines,
}: BulkSkuOrderModalProps) {
  const [manifestText, setManifestText] = useState(SAMPLE_WORKSHOP_MANIFEST);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const parsedLines = useMemo(() => parseManifestText(manifestText), [manifestText]);
  const matchedLines = parsedLines.filter((l) => l.match !== null);

  const manifestTotalAED = matchedLines.reduce((sum, line) => {
    if (!line.match) return sum;
    const base = line.match.part.variants[line.match.variantId].priceAED;
    const tier = getBulkTierPricing(base, line.quantity, pricingMode);
    return sum + tier.unitPriceAED * line.quantity;
  }, 0);

  const handleImportAll = () => {
    if (matchedLines.length === 0) return;
    const entries = matchedLines.map((line) => ({
      partId: line.match!.part.id,
      variantId: line.match!.variantId,
      quantity: line.quantity,
    }));
    onAddBulkLines(entries);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[65] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Bulk Workshop SKU and OE Quick-Order"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: GALLERY_EASE }}
            className="w-full max-w-4xl bg-[#111116] border border-white/20 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 bg-[#14141A] border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[#DC2626]">
                  Trade &amp; Fleet Manifest Importer
                </p>
                <h3 className="font-display text-lg font-semibold text-[#F4F5F7]">
                  Bulk SKU &amp; OE Reference Quick-Order
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Bulk Quick-Order"
                className="w-9 h-9 inline-flex items-center justify-center text-[#9CA3AF] hover:text-white border border-white/15 hover:border-white/40 rounded-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Input Area */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="bulk-manifest-textarea"
                    className="text-xs font-medium text-[#D4D7DD] flex items-center gap-2"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Paste SKUs or OE Numbers (1 per line)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setManifestText(SAMPLE_WORKSHOP_MANIFEST)}
                    className="text-[11px] font-mono text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    Load Sample
                  </button>
                </div>

                <textarea
                  id="bulk-manifest-textarea"
                  rows={9}
                  value={manifestText}
                  onChange={(e) => setManifestText(e.target.value)}
                  placeholder="AA-BRK-4012-HD, 6&#10;43512-60210 x 4&#10;Water Pump, 2"
                  className="w-full p-3.5 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none font-mono text-xs text-[#F4F5F7] placeholder:text-[#6B7280] rounded-sm resize-none leading-relaxed"
                />

                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Accepted formats: <span className="font-mono text-[#D4D7DD]">SKU, qty</span> ·{' '}
                  <span className="font-mono text-[#D4D7DD]">OE Number x qty</span> · or part keyword. Tier discounts (-12% for 5+, -22% for 20+) calculate live.
                </p>
              </div>

              {/* Right Live Resolution Table */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-[#0B0B0D] border border-white/10 rounded-sm p-4">
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                    <span className="font-mono text-[#9CA3AF]">
                      Parsed Lines ({matchedLines.length}/{parsedLines.length} matched)
                    </span>
                    <span className="font-mono text-[#F4F5F7] tabular-nums">
                      Total: {formatMoney(manifestTotalAED, currency)}
                    </span>
                  </div>

                  {parsedLines.length === 0 ? (
                    <p className="py-10 text-center text-xs text-[#9CA3AF]">
                      Enter SKUs or OE references on the left to preview instant availability and tier pricing.
                    </p>
                  ) : (
                    parsedLines.map((line, i) => {
                      if (!line.match) {
                        return (
                          <div
                            key={`${line.raw}-${i}`}
                            className="p-2.5 bg-[#131317] border border-white/10 rounded-sm flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 text-[#9CA3AF] min-w-0">
                              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                              <span className="truncate font-mono">{line.raw}</span>
                            </div>
                            <span className="text-[11px] text-[#F59E0B] shrink-0">
                              Not matched
                            </span>
                          </div>
                        );
                      }

                      const { part, variantId } = line.match;
                      const v = part.variants[variantId];
                      const tier = getBulkTierPricing(
                        v.priceAED,
                        line.quantity,
                        pricingMode
                      );
                      const lineAED = tier.unitPriceAED * line.quantity;

                      return (
                        <div
                          key={`${line.raw}-${i}`}
                          className="p-2.5 bg-[#131317] border border-white/10 rounded-sm flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DC2626] mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-[#F4F5F7] truncate">
                                {part.name}
                              </p>
                              <p className="text-[11px] font-mono text-[#9CA3AF] truncate">
                                {v.sku} · {v.shortLabel} · Qty {line.quantity}
                                {tier.discountPercent > 0 && ` (-${tier.discountPercent}%)`}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono tabular-nums font-medium text-[#F4F5F7] shrink-0">
                            {formatMoney(lineAED, currency)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#9CA3AF]">
                    Unmatched OE lines can still be sent via WhatsApp desk.
                  </span>

                  <button
                    type="button"
                    disabled={matchedLines.length === 0}
                    onClick={handleImportAll}
                    className="h-10 px-5 inline-flex items-center gap-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-45 disabled:cursor-not-allowed rounded-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      Add {matchedLines.length} Matched {matchedLines.length === 1 ? 'Item' : 'Items'} to Bag
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
