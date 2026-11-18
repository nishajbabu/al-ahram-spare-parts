import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  location: string;
  outcome: string;
}

const REVIEWS: TestimonialItem[] = [
  {
    id: 'al-qusais',
    quote:
      'Switching our Land Cruiser 300 and G-Class brake rotor jobs to Al Ahram Heavy-Duty sets stopped thermal-judder comebacks entirely. Same-day Sharjah dispatch keeps our six service bays turning.',
    author: 'Tariq Al Mansoori',
    role: 'Service Director',
    organization: 'Al Qusais Euro-Japanese Motors',
    location: 'Dubai, UAE',
    outcome: 'Zero brake fade returns across 14 months',
  },
  {
    id: 'apex-autobahn',
    quote:
      'Having both OEM and Heavy-Duty tolerances verified side-by-side eliminates cross-reference guesswork on BMW X5 struts and billet water pumps. Bulk Workshop tiers save us 12–22% monthly.',
    author: 'Marcus Lindemann',
    role: 'Lead Diagnostics Technician',
    organization: 'Apex Autobahn Garage',
    location: 'Sharjah, UAE',
    outcome: '48-hour faster bay turnaround on German SUVs',
  },
  {
    id: 'rift-valley',
    quote:
      'We consolidate 20+ unit export orders of Patrol filters, starter motors, and control arms straight through WhatsApp. Every shipment arrives customs-ready and matched to our VIN sheet.',
    author: 'Samuel Kiprono',
    role: 'Fleet Procurement Manager',
    organization: 'Rift Valley Logistics Fleet',
    location: 'Nairobi, Kenya',
    outcome: '100% fitment accuracy across 6 export consignments',
  },
];

export function TestimonialsSection() {
  return (
    <section
      aria-label="Verified Workshop and Buyer Reviews"
      className="py-14 sm:py-20 lg:py-24 bg-[#0B0B0D] border-b border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-mono tracking-widest text-[#9CA3AF] mb-3">
              03. Verified Workshop &amp; Buyer Reviews
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
              Trusted on Workshop Lifts &amp; Export Routes.
            </h2>
          </div>
          <p className="text-sm text-[#9CA3AF] max-w-md leading-relaxed">
            Feedback from UAE specialist garages and international fleet procurement teams sourcing OEM and Heavy-Duty hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: GALLERY_EASE,
              }}
              className="p-7 bg-[#131317] border border-white/10 rounded-sm flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
                  <span>{review.location}</span>
                  <Quote className="w-4 h-4 text-[#DC2626]/80 shrink-0" />
                </div>
                <p className="text-sm text-[#D4D7DD]/90 leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 border-t border-white/10 space-y-2">
                <p className="text-xs font-mono text-[#DC2626]">
                  {review.outcome}
                </p>
                <div>
                  <p className="font-display text-sm font-semibold text-[#F4F5F7]">
                    {review.author}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {review.role} · {review.organization}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
