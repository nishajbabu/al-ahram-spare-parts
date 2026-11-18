import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronDown, MessageCircle, Plus } from 'lucide-react';
import { SPARE_PARTS } from '../data/catalog';
import { CurrencyCode, PricingMode, SparePart, VariantType } from '../types';
import { formatMoney, getBulkTierPricing } from '../utils/pricing';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

const SPECIAL_OFFERS: Array<{
  partId: string;
  variantId: VariantType;
  discountPercent: number;
  offerWindow: string;
}> = [
  {
    partId: 'brake-pads-rotors',
    variantId: 'heavy_duty',
    discountPercent: 18,
    offerWindow: 'Monthly UAE Offer',
  },
  {
    partId: 'water-pump',
    variantId: 'heavy_duty',
    discountPercent: 15,
    offerWindow: 'GCC Cooling Offer',
  },
  {
    partId: 'oil-fuel-air-filters',
    variantId: 'heavy_duty',
    discountPercent: 20,
    offerWindow: 'Service Bundle Rate',
  },
];

const FAQ_ITEMS = [
  {
    id: 'vin-check',
    question: 'How do I verify exact part fitment using my 17-digit VIN or Mulkiya?',
    answer:
      'Enter your 17-digit chassis number in the Mulkiya / VIN Check bar at the top of the page or inside the Quote Drawer. Our system auto-decodes your vehicle platform, and for rare GCC/import trims you can send a photo of your Mulkiya card or old part directly to our Sharjah specialists on WhatsApp (+971 55 224 8090) for 24x7 cross-referencing.',
  },
  {
    id: 'uae-vs-intl',
    question: 'What is the turnaround for UAE Same-Day delivery vs. International shipping?',
    answer:
      'Orders confirmed for Dubai, Sharjah, and Abu Dhabi ship via direct courier within 2–6 hours. Cross-border GCC overland freight (KSA, Oman, Kuwait, Bahrain, Qatar) arrives in 24–48 hours, while worldwide DHL/Aramex air freight reaches international garages within 3–5 business days complete with HS-coded packing lists.',
  },
  {
    id: 'sharjah-pickup',
    question: 'Can workshops or walk-in buyers collect orders directly in Sharjah?',
    answer:
      'Yes. Walk-in buyers and workshop dispatch drivers can collect pre-picked orders directly from Al Ahram Auto Parts LLC at Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE), or call our counter landline on +971 6 539 6988 before arrival.',
  },
  {
    id: 'oem-vs-hd',
    question: 'What is the difference between Standard OEM and Heavy-Duty / Performance grades?',
    answer:
      'Standard OEM assemblies match factory dealer tolerances and quiet NVH ride characteristics. Heavy-Duty / Performance upgrades feature higher-temp alloys (e.g. cryo-treated high-carbon rotors, billet water pump impellers, and Viton seals) built specifically for 50°C+ GCC summer heat and fleet towing, backed by extended warranties.',
  },
];

interface OffersAndFaqSectionProps {
  currency: CurrencyCode;
  pricingMode: PricingMode;
  onSelectPart: (part: SparePart) => void;
  onQuickAddPart: (partId: string, variantId: VariantType) => void;
}

export function OffersAndFaqSection({
  currency,
  pricingMode,
  onSelectPart,
  onQuickAddPart,
}: OffersAndFaqSectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <section
      aria-label="Monthly Special Offers and Frequently Asked Questions"
      className="py-14 sm:py-20 lg:py-24 bg-[#0B0B0D] border-b border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 space-y-16 sm:space-y-20">
        {/* Monthly Special Offers Row */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-mono tracking-widest text-[#DC2626] mb-2">
                Competitive Trade &amp; Seasonal Pricing
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
                Parts on Special Offer
              </h2>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Al Ahram Auto Spare Parts, I would like to claim this month’s Special Offer pricing.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#D4D7DD] hover:text-white border border-white/15 hover:border-[#DC2626] px-4 py-2.5 rounded-sm transition-colors self-start md:self-auto"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Request Custom Offer List on WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPECIAL_OFFERS.map((offer) => {
              const part = SPARE_PARTS.find((p) => p.id === offer.partId);
              if (!part) return null;
              const variant = part.variants[offer.variantId];
              const baseAED = getBulkTierPricing(
                variant.priceAED,
                pricingMode === 'bulk' ? 5 : 1,
                pricingMode
              ).unitPriceAED;
              const offerAED = Math.round(
                baseAED * (1 - offer.discountPercent / 100)
              );

              return (
                <article
                  key={`${offer.partId}-${offer.variantId}`}
                  className="bg-[#131317] border border-white/10 hover:border-[#DC2626]/60 rounded-sm overflow-hidden flex flex-col justify-between transition-colors"
                >
                  <div className="p-5 sm:p-6 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-[#0B0B0D] border border-white/10 rounded-sm overflow-hidden shrink-0">
                      <SafeImage
                        src={part.image}
                        alt={part.name}
                        className="w-full h-full object-cover"
                        fallbackLabel={part.name}
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-[11px] font-mono text-[#DC2626]">
                        {offer.offerWindow} · Save {offer.discountPercent}%
                      </p>
                      <h3 className="font-display text-base font-semibold text-[#F4F5F7] line-clamp-2">
                        {part.name}
                      </h3>
                      <p className="text-xs font-mono text-[#9CA3AF]">
                        {variant.shortLabel} · {variant.sku}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 py-4 bg-[#0E0E12] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-lg font-semibold text-[#F4F5F7] tabular-nums">
                        {formatMoney(offerAED, currency)}
                      </span>
                      <span className="font-mono text-xs text-[#6B7280] line-through tabular-nums">
                        {formatMoney(baseAED, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onQuickAddPart(part.id, offer.variantId)}
                        className="px-3 py-1.5 inline-flex items-center gap-1 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Offer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectPart(part)}
                        className="px-2.5 py-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#D4D7DD] hover:text-white border border-white/15 rounded-sm transition-colors cursor-pointer"
                      >
                        <span>Specs</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Clean Dark Accordion FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-white/10">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF]">
              Buyer &amp; Dispatch Guide
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4F5F7]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Clear answers on VIN fitment verification, local UAE courier timelines, international export shipping, and Sharjah walk-in counter pickup.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-white/10 border-t border-b border-white/10">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                    aria-expanded={isOpen}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="font-display text-sm sm:text-base font-medium text-[#F4F5F7] group-hover:text-white transition-colors">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9CA3AF] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#DC2626]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: GALLERY_EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm text-[#9CA3AF] leading-relaxed pr-6">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
