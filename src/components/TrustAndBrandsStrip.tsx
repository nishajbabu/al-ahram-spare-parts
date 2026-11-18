import { VehicleMake } from '../types';

const METRICS = [
  {
    value: '15,000+',
    label: 'SKUs Stocked',
    detail: 'Ready at Sharjah Hub',
  },
  {
    value: '7',
    label: 'Core Systems',
    detail: 'OEM & Heavy-Duty',
  },
  {
    value: 'UAE Same-Day',
    label: '& Worldwide Dispatch',
    detail: 'Air, Sea & GCC Overland',
  },
  {
    value: '24x7',
    label: 'Specialist Support',
    detail: 'VIN & OE Cross-Check',
  },
];

const SUPPORTED_VEHICLES: Array<{
  name: string;
  make: VehicleMake;
  platforms: string;
}> = [
  { name: 'TOYOTA', make: 'Toyota', platforms: 'Land Cruiser · Prado · Camry · Hilux' },
  { name: 'NISSAN', make: 'Nissan', platforms: 'Patrol · Altima · Pathfinder · X-Trail' },
  { name: 'LEXUS', make: 'Lexus', platforms: 'LX600 · RX350 · ES350 · LS500' },
  { name: 'MERCEDES-BENZ', make: 'Mercedes-Benz', platforms: 'G-Class · GLE · S-Class · E-Class' },
  { name: 'BMW', make: 'BMW', platforms: 'X5 · X7 · 5 Series · 7 Series' },
  { name: 'MITSUBISHI', make: 'Mitsubishi', platforms: 'Pajero · Montero Sport · L200' },
  { name: 'HYUNDAI', make: 'Hyundai', platforms: 'Palisade · Santa Fe · Tucson · Sonata' },
];

interface TrustAndBrandsStripProps {
  activeMake?: VehicleMake | '';
  onSelectMake?: (make: VehicleMake) => void;
}

export function TrustAndBrandsStrip({
  activeMake = '',
  onSelectMake,
}: TrustAndBrandsStripProps) {
  return (
    <section
      aria-label="Coverage metrics and vehicles supported"
      className="bg-[#0E0E12] border-b border-white/10"
    >
      {/* 1. Coverage & Trust Metrics Strip */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 border-b border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {METRICS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col justify-between border-white/10 lg:border-r lg:last:border-r-0 lg:pr-6"
            >
              <span className="font-mono text-xl sm:text-2xl font-semibold text-[#F4F5F7] tabular-nums tracking-tight">
                {item.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#D4D7DD] mt-1">
                {item.label}
              </span>
              <span className="text-[11px] font-mono text-[#9CA3AF] mt-0.5">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Vehicles Supported Grayscale-to-Silver Marquee Strip */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-[11px] font-mono tracking-widest text-[#9CA3AF] whitespace-nowrap shrink-0">
            Vehicles Supported
          </span>

          <div className="flex items-center justify-start md:justify-end gap-5 sm:gap-7 lg:gap-8 overflow-x-auto pb-1 md:pb-0">
            {SUPPORTED_VEHICLES.map((vehicle) => {
              const isSelected = activeMake === vehicle.make;
              return (
                <button
                  key={vehicle.name}
                  type="button"
                  title={`${vehicle.platforms} — Filter parts`}
                  onClick={() => onSelectMake?.(vehicle.make)}
                  aria-pressed={isSelected}
                  className={`group shrink-0 select-none transition-colors cursor-pointer pb-0.5 border-b ${
                    isSelected
                      ? 'border-[#DC2626]'
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <span
                    className={`font-display text-xs sm:text-sm lg:text-[15px] font-semibold tracking-[0.16em] transition-colors duration-300 ${
                      isSelected
                        ? 'text-[#F4F5F7]'
                        : 'text-[#6B7280] group-hover:text-[#F4F5F7]'
                    }`}
                  >
                    {vehicle.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
