import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data/catalog';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface ShowroomPageProps {
  onBackHome: () => void;
  onExploreCatalog: () => void;
}

const QA_STAGES = [
  {
    step: '01.',
    title: 'Chassis & OE Cross-Verification',
    detail:
      'Every order is checked against 17-digit Mulkiya VINs and factory OEM/supersession catalogs before picking from warehouse racks.',
  },
  {
    step: '02.',
    title: 'Metallurgical & Bench Tolerance Check',
    detail:
      'Rotors, master cylinders, water pumps, and cylinder heads undergo micron flatness and hydraulic pressure-decay verification.',
  },
  {
    step: '03.',
    title: 'GCC Tropicalized Spec Screening',
    detail:
      'Cooling cores, Viton seals, and heavy-duty friction compounds are graded specifically for 50°C+ summer idle heat and desert silica.',
  },
  {
    step: '04.',
    title: 'Same-Day UAE & Export Consolidation',
    detail:
      'Direct courier dispatch across Dubai, Sharjah, and Abu Dhabi within hours, plus tracked international air and overland freight.',
  },
];

export function ShowroomPage({
  onBackHome,
  onExploreCatalog,
}: ShowroomPageProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease: GALLERY_EASE }}
      className="py-10 sm:py-16 lg:py-20 bg-[#0B0B0D] min-h-[82vh]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 space-y-14">
        {/* Top Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm text-[#D4D7DD] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Flagship Home</span>
          </button>

          <span className="text-xs font-mono text-[#9CA3AF]">
            Sharjah Industrial Flagship · United Arab Emirates
          </span>
        </div>

        {/* Heritage & Showroom Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-xs font-mono tracking-widest text-[#DC2626] mb-3">
                Al Ahram Auto Parts LLC
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#F4F5F7] leading-[1.08] mb-5">
                Sharjah Flagship Counter &amp; Global Parts Hub.
              </h1>
              <p className="text-base text-[#D4D7DD]/85 leading-relaxed">
                Serving UAE workshops, GCC automotive fleets, and international export clients from our Sharjah showroom with fast-moving OEM and Heavy-Duty assemblies ready for immediate dispatch.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Hello Al Ahram Auto Spare Parts, I would like to connect with your Sharjah Showroom Desk.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 inline-flex items-center gap-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onExploreCatalog}
                className="px-5 py-3 inline-flex items-center gap-2 text-xs font-medium text-[#D4D7DD] border border-white/20 hover:border-white/50 hover:text-white rounded-sm transition-colors cursor-pointer"
              >
                <span>Explore Full Catalog</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[16/10] bg-[#131317] border border-white/10 rounded-sm overflow-hidden">
            <SafeImage
              src={HERO_IMAGE_PATH}
              alt="Al Ahram Auto Spare Parts precision automotive hardware"
              className="w-full h-full object-cover object-center"
              fallbackLabel="Al Ahram Auto Parts LLC Sharjah Showroom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-mono text-[#9CA3AF]">
                  Showroom Location
                </p>
                <p className="text-sm font-medium text-[#F4F5F7]">
                  Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE)
                </p>
              </div>
              <span className="text-xs font-mono text-[#DC2626]">
                24x7 Online Desk
              </span>
            </div>
          </div>
        </div>

        {/* 4-Stage Engineering & Inspection Standard */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF] mb-2">
              Zero-Guesswork Sourcing Protocol
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4F5F7]">
              How Every Assembly Is Verified Before Dispatch
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QA_STAGES.map((stage) => (
              <div
                key={stage.step}
                className="p-6 bg-[#131317] border border-white/10 rounded-sm space-y-3"
              >
                <span className="font-mono text-xs text-[#DC2626]">
                  {stage.step}
                </span>
                <h3 className="font-display text-base font-semibold text-[#F4F5F7]">
                  {stage.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {stage.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Cards with 1-Click Copy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              key: 'whatsapp',
              icon: MessageCircle,
              label: 'WhatsApp Direct',
              value: '+971 55 224 8090',
              sub: '24x7 VIN & Quote Desk',
            },
            {
              key: 'landline',
              icon: Phone,
              label: 'Showroom Landline',
              value: '+971 6 539 6988',
              sub: 'Sharjah Parts Counter',
            },
            {
              key: 'email',
              icon: Mail,
              label: 'Official Trade Email',
              value: 'alahram123@outlook.com',
              sub: 'RFQs & Proforma Invoices',
            },
            {
              key: 'address',
              icon: MapPin,
              label: 'Physical Address',
              value: 'Lateefa Building, Wheeling, Shop #6, Street 69, 33868 (UAE)',
              sub: 'Customer Pickup & Courier Hub',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.key;
            return (
              <div
                key={item.key}
                className="p-5 bg-[#131317] border border-white/10 rounded-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-[#DC2626]" />
                    <button
                      type="button"
                      onClick={() => handleCopy(item.key, item.value)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#9CA3AF] hover:text-white cursor-pointer"
                    >
                      {isCopied ? (
                        <Check className="w-3 h-3 text-[#22C55E]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-[#9CA3AF]">{item.label}</p>
                  <p className="text-sm font-medium text-[#F4F5F7] break-words">
                    {item.value}
                  </p>
                </div>
                <p className="text-[11px] text-[#9CA3AF] pt-2 border-t border-white/10">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#131317] border border-white/10 rounded-sm text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-2 text-[#D4D7DD]">
            <Clock className="w-4 h-4 text-[#DC2626]" />
            <span>
              Counter Hours: Mon–Sat 08:30–20:30 GST · Online WhatsApp Support: 24x7 Worldwide
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
            <span>100% Secure Shopping &amp; Verified Warranty Backed</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
