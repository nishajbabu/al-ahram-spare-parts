import { MessageCircle } from 'lucide-react';
import { CurrencyCode, PricingMode, SparePart, VariantType, VehicleFitment } from '../types';
import { buildSinglePartWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  activePart: SparePart | null;
  selectedVariant: VariantType;
  fitment: VehicleFitment;
  currency: CurrencyCode;
  pricingMode: PricingMode;
}

export function FloatingWhatsApp({
  activePart,
  selectedVariant,
  fitment,
  currency,
  pricingMode,
}: FloatingWhatsAppProps) {
  const href = activePart
    ? buildSinglePartWhatsAppUrl({
        part: activePart,
        variantId: selectedVariant,
        quantity: pricingMode === 'bulk' ? 5 : 1,
        currency,
        pricingMode,
        fitment,
      })
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hello Al Ahram Auto Spare Parts, I need help sourcing parts${
          fitment.make
            ? ` for ${[fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ')}`
            : ''
        }.`
      )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Al Ahram Auto Parts on WhatsApp"
      title="WhatsApp Support (+971 55 224 8090)"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 sm:bottom-4 sm:right-4 z-40 inline-flex items-center justify-center gap-2 h-10 w-10 sm:h-9 sm:w-auto sm:px-3 rounded-full bg-[#111115]/90 border border-white/15 hover:border-[#25D366] text-[11px] font-medium text-[#D4D7DD] hover:text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
      <span className="hidden md:inline whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
