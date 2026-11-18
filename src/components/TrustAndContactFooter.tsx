import { ArrowUpRight, Globe2, Headphones, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';

interface TrustAndContactFooterProps {
  onNavigatePage?: (page: 'wholesale' | 'showroom') => void;
}

export function TrustAndContactFooter({ onNavigatePage }: TrustAndContactFooterProps) {
  const pillars = [
    {
      index: '01.',
      title: 'Worldwide On-Time Dispatch',
      detail:
        'Air-freight and container consolidation for workshops and private vehicle owners outside the UAE with customs-ready packing lists.',
      icon: Globe2,
    },
    {
      index: '02.',
      title: '100% Secure OEM Sourcing',
      detail:
        'Every assembly is batch-verified against factory OE numbers, pressure tolerances, and manufacturer serial traceability.',
      icon: ShieldCheck,
    },
    {
      index: '03.',
      title: '24x7 Technical Support',
      detail:
        'Round-the-clock VIN cross-referencing, competitive wholesale pricing, and direct WhatsApp customer messaging.',
      icon: Headphones,
    },
  ];

  return (
    <footer id="support" className="bg-[#0B0B0D]">
      {/* Core Value & Trust Architecture */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF] mb-3">
              04. Commercial Standards
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
              Engineered Supply from UAE to the World.
            </h2>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              'Hello Al Ahram Auto Spare Parts, I would like to inquire about wholesale/retail parts availability.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message Parts Desk on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="p-7 bg-[#131317] border border-white/10 rounded-sm flex flex-col justify-between gap-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#DC2626]">{item.index}</span>
                  <Icon className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#F4F5F7] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Directory & Brand Footer */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <p className="font-display text-xl font-semibold text-[#F4F5F7]">
              Al Ahram Auto Spare Parts
            </p>
            <p className="text-xs font-mono text-[#9CA3AF]">
              Al Ahram Auto Parts LLC · United Arab Emirates
            </p>
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-md">
              Fast-moving OEM and Heavy-Duty spare parts specialists serving UAE workshops, GCC fleet operators, and international export clients with competitive trade offers.
            </p>
            {onNavigatePage && (
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => onNavigatePage('wholesale')}
                  className="inline-flex items-center gap-1 text-[#F4F5F7] hover:text-[#DC2626] transition-colors cursor-pointer"
                >
                  <span>Wholesale &amp; Export Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigatePage('showroom')}
                  className="inline-flex items-center gap-1 text-[#F4F5F7] hover:text-[#DC2626] transition-colors cursor-pointer"
                >
                  <span>Sharjah Showroom &amp; QA</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <p className="text-xs font-mono text-[#9CA3AF]">Direct Lines</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#F4F5F7] hover:text-[#DC2626] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                <span className="font-mono tabular-nums">+971 55 224 8090 (WhatsApp)</span>
              </a>
              <a
                href="tel:+97165396988"
                className="flex items-center gap-2.5 text-[#D4D7DD] hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span className="font-mono tabular-nums">+971 6 539 6988 (Landline)</span>
              </a>
              <a
                href="mailto:alahram123@outlook.com"
                className="flex items-center gap-2.5 text-[#D4D7DD] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span>alahram123@outlook.com</span>
              </a>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono text-[#9CA3AF]">Showroom &amp; Dispatch Hub</p>
              <div className="flex items-start gap-2.5 text-[#D4D7DD] leading-relaxed">
                <MapPin className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
                <span>
                  Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-10 sm:pb-8 sm:pr-32 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <span>
            © {new Date().getFullYear()} Al Ahram Auto Parts LLC. All rights reserved.
          </span>
          <span>100% Secure Shopping · Worldwide Delivery · 24x7 Support</span>
        </div>
      </div>
    </footer>
  );
}
