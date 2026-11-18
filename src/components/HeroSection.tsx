import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bookmark,
  Camera,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { HERO_IMAGE_PATH, VEHICLE_MAKES, VEHICLE_MODELS, VEHICLE_YEARS } from '../data/catalog';
import {
  CurrencyCode,
  SavedVehicle,
  VehicleFitment,
  VehicleMake,
} from '../types';
import { decodeVin, SAMPLE_VINS, sanitizeVin } from '../utils/vin';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';

const GALLERY_EASE = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  fitment: VehicleFitment;
  currency: CurrencyCode;
  compatibleCount: number;
  savedVehicles: SavedVehicle[];
  onFitmentChange: (next: VehicleFitment) => void;
  onCurrencyChange: (next: CurrencyCode) => void;
  onSaveVehicle: () => void;
  onRemoveSavedVehicle: (id: string) => void;
  onSearchOem?: (query: string) => void;
  onExploreCatalog: () => void;
}

export function HeroSection({
  fitment,
  currency,
  compatibleCount,
  savedVehicles,
  onFitmentChange,
  onCurrencyChange,
  onSaveVehicle,
  onRemoveSavedVehicle,
  onSearchOem,
  onExploreCatalog,
}: HeroSectionProps) {
  const [vinInput, setVinInput] = useState(fitment.vin || '');
  const availableModels = fitment.make ? VEHICLE_MODELS[fitment.make] : [];
  const isFitmentActive = Boolean(fitment.make || fitment.model || fitment.year || fitment.vin);
  const cleanVinCandidate = sanitizeVin(vinInput);
  const vinStatus = decodeVin(cleanVinCandidate);

  useEffect(() => {
    if (!fitment.vin && vinInput.length === 17) {
      setVinInput('');
    }
  }, [fitment.vin, vinInput.length]);

  const handleMakeChange = (makeValue: string) => {
    const make = makeValue as VehicleMake | '';
    onFitmentChange({
      ...fitment,
      make,
      model: '',
    });
  };

  const handleVinChange = (raw: string) => {
    const normalized = raw.toUpperCase().replace(/[^A-Z0-9- ]/g, '').slice(0, 24);
    setVinInput(normalized);
    const clean = sanitizeVin(normalized);
    const decoded = decodeVin(clean);
    if (decoded.validFormat && !normalized.includes('-')) {
      setVinInput(clean);
      onFitmentChange({
        make: decoded.make || fitment.make,
        model: decoded.suggestedModel || fitment.model,
        year: decoded.year || fitment.year,
        vin: decoded.vin,
      });
    } else if (normalized.trim().length === 0) {
      onFitmentChange({
        ...fitment,
        vin: undefined,
      });
    }
  };

  const quickPhotoWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Al Ahram Sharjah Specialist Desk, please verify part fitment${
      vinInput.trim() ? ` for VIN / OEM Part No: ${vinInput.trim()}` : ''
    }${
      fitment.make
        ? ` (${[fitment.year, fitment.make, fitment.model].filter(Boolean).join(' ')})`
        : ''
    }. I am attaching a photo of the part / Mulkiya.`
  )}`;

  const handleResetAll = () => {
    setVinInput('');
    onFitmentChange({ make: '', model: '', year: '', vin: undefined });
  };

  return (
    <section className="relative bg-[#0B0B0D] border-b border-white/10">
      {/* Main Full-Bleed Art Gallery Hero Frame */}
      <div className="relative min-h-[430px] sm:min-h-[540px] lg:min-h-[620px] flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <SafeImage
            src={HERO_IMAGE_PATH}
            alt="Precision engineered automotive suspension, wheel hub, and crimson multi-piston brake assembly"
            className="w-full h-full object-cover object-center lg:object-right"
            fallbackLabel="Al Ahram Precision Automotive Hardware"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/85 to-[#0B0B0D]/20 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/40" />
        </div>

        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: GALLERY_EASE }}
            className="max-w-2xl"
          >
            <p className="text-[11px] sm:text-xs font-mono tracking-widest text-[#9CA3AF] mb-3 sm:mb-4">
              UAE Flagship Hub · Worldwide Dispatch · OEM &amp; Heavy-Duty
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#F4F5F7] leading-[1.08] mb-4 sm:mb-5">
              Precision spare parts, curated like fine hardware.
            </h1>
            <p className="text-sm sm:text-lg text-[#D4D7DD]/85 leading-relaxed max-w-xl mb-7 sm:mb-8">
              Engineered OEM and Heavy-Duty components for Toyota, Nissan, Lexus, Mercedes-Benz, BMW, Mitsubishi, and Hyundai—verified for fitment and dispatched globally from Sharjah, UAE.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="#chassis-explorer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#D4D7DD] border border-white/20 hover:border-white/50 hover:text-white transition-colors rounded-sm whitespace-nowrap shrink-0"
              >
                <span>Inspect Chassis Zones</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-Width Docked Vehicle Fitment Finder, VIN Decoder & Currency Row */}
      <div
        id="fitment-finder"
        className="bg-[#121216] border-t border-white/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Make */}
              <div>
                <label
                  htmlFor="fitment-make"
                  className="block text-xs font-medium text-[#9CA3AF] mb-2"
                >
                  Vehicle Make
                </label>
                <select
                  id="fitment-make"
                  value={fitment.make}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none text-base sm:text-sm text-[#F4F5F7] rounded-sm transition-colors cursor-pointer"
                >
                  <option value="">All Makes (GCC &amp; Global)</option>
                  {VEHICLE_MAKES.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label
                  htmlFor="fitment-model"
                  className="block text-xs font-medium text-[#9CA3AF] mb-2"
                >
                  Model Series
                </label>
                <select
                  id="fitment-model"
                  value={fitment.model}
                  disabled={!fitment.make}
                  onChange={(e) =>
                    onFitmentChange({ ...fitment, model: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none text-base sm:text-sm text-[#F4F5F7] rounded-sm transition-colors disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="">
                    {fitment.make ? `All ${fitment.make} Models` : 'Select Make first'}
                  </option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="fitment-year"
                  className="block text-xs font-medium text-[#9CA3AF] mb-2"
                >
                  Model Year
                </label>
                <select
                  id="fitment-year"
                  value={fitment.year}
                  onChange={(e) =>
                    onFitmentChange({ ...fitment, year: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none text-base sm:text-sm text-[#F4F5F7] rounded-sm transition-colors cursor-pointer"
                >
                  <option value="">All Years (2016–2026)</option>
                  {VEHICLE_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Controls: Guaranteed Fit Status + Currency Toggle */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-5 pt-2 lg:pt-0">
              <div className="flex items-center gap-3 text-sm">
                {isFitmentActive ? (
                  <div className="flex items-center gap-2 text-[#F4F5F7]">
                    <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <span className="font-medium">Guaranteed Fit</span>
                    <span className="text-[#9CA3AF]" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-mono tabular-nums text-xs text-[#D4D7DD]">
                      {compatibleCount} assemblies matched
                    </span>
                    <button
                      type="button"
                      onClick={onSaveVehicle}
                      disabled={!fitment.make}
                      className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-[#0B0B0D] border border-white/15 hover:border-[#DC2626] text-[#D4D7DD] hover:text-white rounded-sm transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Bookmark className="w-3 h-3 text-[#DC2626]" />
                      <span>Save Vehicle</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="ml-1 inline-flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
                      aria-label="Reset vehicle fitment filter"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-[#9CA3AF]">
                    Select Make, Model &amp; Year or enter 17-digit VIN
                  </span>
                )}
              </div>

              {/* Currency Segmented Toggle */}
              <div
                className="inline-flex items-center p-1 bg-[#0B0B0D] border border-white/15 rounded-sm shrink-0"
                role="group"
                aria-label="Display currency"
              >
                {(['AED', 'USD'] as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onCurrencyChange(code)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

          {/* VIN / OEM Part Number / Photo Quick-Check Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="flex items-center gap-2 text-xs text-[#D4D7DD] shrink-0">
                <KeyRound className="w-3.5 h-3.5 text-[#DC2626]" />
                <label htmlFor="vin-decoder-input" className="font-medium">
                  VIN / OEM Part Quick-Check
                </label>
              </div>

              <div className="relative flex-1 max-w-md flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="vin-decoder-input"
                    type="text"
                    maxLength={24}
                    value={vinInput}
                    onChange={(e) => handleVinChange(e.target.value)}
                    placeholder="17-digit VIN or OEM No. (e.g. 43512-60210)"
                    className="w-full h-10 sm:h-9 px-3 pr-14 bg-[#0B0B0D] border border-white/15 focus:border-[#DC2626] focus:outline-none font-mono text-base sm:text-xs uppercase tracking-wider text-[#F4F5F7] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#6B7280] rounded-sm"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#9CA3AF] tabular-nums">
                    {cleanVinCandidate.length <= 17 && !vinInput.includes('-')
                      ? `${cleanVinCandidate.length}/17`
                      : 'OEM'}
                  </span>
                </div>

                {vinInput.trim().length >= 3 && !vinStatus.validFormat && onSearchOem && (
                  <button
                    type="button"
                    onClick={() => onSearchOem(vinInput.trim())}
                    className="h-9 px-3 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#1E1E26] border border-white/15 hover:border-[#DC2626] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Find Part</span>
                  </button>
                )}
              </div>

              {vinInput.length > 0 && (
                <div className="text-xs">
                  {vinStatus.validFormat ? (
                    <span className="text-[#F4F5F7] font-mono">
                      VIN Verified · {vinStatus.make || 'Matched'}{' '}
                      {vinStatus.year || ''} ({vinStatus.regionLabel})
                    </span>
                  ) : vinInput.includes('-') || vinInput.length < 10 ? (
                    <span className="text-[#9CA3AF]">
                      Ready for OEM catalog lookup or Sharjah WhatsApp check
                    </span>
                  ) : (
                    <span className="text-[#9CA3AF]">{vinStatus.error}</span>
                  )}
                </div>
              )}
            </div>

            {/* Direct Sharjah Specialist Photo Check + Sample VINs */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <a
                href={quickPhotoWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 inline-flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-sm transition-colors whitespace-nowrap shrink-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Send Part Photo on WhatsApp</span>
              </a>
              <span className="text-[#9CA3AF] ml-1">Sample VINs:</span>
              {SAMPLE_VINS.map((sample) => (
                <button
                  key={sample.vin}
                  type="button"
                  onClick={() => handleVinChange(sample.vin)}
                  className="px-2.5 py-1 bg-[#0B0B0D] border border-white/10 hover:border-[#DC2626]/70 text-[#D4D7DD] hover:text-white rounded-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Garage Fleet Strip */}
          {savedVehicles.length > 0 && (
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2.5 text-[11px]">
              <span className="font-mono text-[#9CA3AF]">My Garage ({savedVehicles.length}/5):</span>
              {savedVehicles.map((entry) => {
                const isSelected =
                  entry.fitment.make === fitment.make &&
                  entry.fitment.model === fitment.model &&
                  entry.fitment.year === fitment.year &&
                  (entry.fitment.vin || '') === (fitment.vin || '');

                return (
                  <div
                    key={entry.id}
                    className={`inline-flex items-center rounded-sm border transition-colors ${
                      isSelected
                        ? 'bg-[#1D1D24] border-[#DC2626] text-white'
                        : 'bg-[#0B0B0D] border-white/10 text-[#D4D7DD] hover:border-white/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setVinInput(entry.fitment.vin || '');
                        onFitmentChange(entry.fitment);
                      }}
                      className="px-2.5 py-1 text-left whitespace-nowrap cursor-pointer"
                    >
                      {entry.label}
                      {entry.fitment.vin ? ` · ${entry.fitment.vin.slice(-6)}` : ''}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveSavedVehicle(entry.id)}
                      aria-label={`Remove ${entry.label} from garage`}
                      className="pr-2 pl-1 py-1 text-[#9CA3AF] hover:text-[#DC2626] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
