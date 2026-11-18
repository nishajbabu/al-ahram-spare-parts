import { VehicleMake } from '../types';

export interface VinDecodeResult {
  validFormat: boolean;
  vin: string;
  make?: VehicleMake;
  suggestedModel?: string;
  year?: string;
  regionLabel?: string;
  error?: string;
}

const VIN_YEAR_MAP: Record<string, string> = {
  G: '2016',
  H: '2017',
  J: '2018',
  K: '2019',
  L: '2020',
  M: '2021',
  N: '2022',
  P: '2023',
  R: '2024',
  S: '2025',
  T: '2026',
};

const WMI_MAP: Array<{
  prefixes: string[];
  make: VehicleMake;
  model: string;
  region: string;
}> = [
  { prefixes: ['JTM', 'JTE'], make: 'Toyota', model: 'Land Cruiser 300', region: 'Japan / GCC Spec' },
  { prefixes: ['JTD', '4T1'], make: 'Toyota', model: 'Camry', region: 'Global Spec' },
  { prefixes: ['JTN', '5TD', 'MR0'], make: 'Toyota', model: 'Land Cruiser Prado', region: 'GCC Spec' },
  { prefixes: ['JTJ', '2T2'], make: 'Lexus', model: 'LX 600', region: 'Japan / GCC Spec' },
  { prefixes: ['JTH', '58A'], make: 'Lexus', model: 'ES 350', region: 'Japan Spec' },
  { prefixes: ['JN1', 'JN8'], make: 'Nissan', model: 'Patrol Y62 / Y63', region: 'Japan / GCC Spec' },
  { prefixes: ['1N4', '5N1'], make: 'Nissan', model: 'Altima', region: 'North America / GCC' },
  { prefixes: ['W1N', '4JG'], make: 'Mercedes-Benz', model: 'G-Class (W463)', region: 'Germany / Austria' },
  { prefixes: ['W1K', 'WDD', 'WDB'], make: 'Mercedes-Benz', model: 'S-Class (W223)', region: 'Germany' },
  { prefixes: ['5UX', '5YM'], make: 'BMW', model: 'X5 (G05)', region: 'Bavaria / Global' },
  { prefixes: ['WBA', 'WBS'], make: 'BMW', model: '5 Series (G30)', region: 'Germany' },
  { prefixes: ['JA3', 'JA4', 'MMB'], make: 'Mitsubishi', model: 'Pajero', region: 'Japan / GCC Spec' },
  { prefixes: ['KMH', 'KM8', '5NM'], make: 'Hyundai', model: 'Palisade', region: 'Korea / GCC Spec' },
];

export const SAMPLE_VINS: Array<{ label: string; vin: string }> = [
  { label: 'Land Cruiser 300 (2024)', vin: 'JTMAA7BJ0R4018291' },
  { label: 'G-Class W463 (2023)', vin: 'W1NYC7HJ8PX492014' },
  { label: 'BMW X5 G05 (2025)', vin: '5UXCR6C09S9284110' },
];

export function sanitizeVin(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
}

export function decodeVin(rawVin: string): VinDecodeResult {
  const vin = sanitizeVin(rawVin);

  if (vin.length === 0) {
    return { validFormat: false, vin };
  }

  if (/[IOQ]/.test(vin)) {
    return {
      validFormat: false,
      vin,
      error: 'Standard 17-digit VINs never contain letters I, O, or Q.',
    };
  }

  if (vin.length < 17) {
    return {
      validFormat: false,
      vin,
      error: `Enter ${17 - vin.length} more character${17 - vin.length === 1 ? '' : 's'} to verify chassis.`,
    };
  }

  const wmi = vin.slice(0, 3);
  const yearCode = vin.charAt(9);
  const matchedWmi = WMI_MAP.find((entry) => entry.prefixes.includes(wmi));
  const decodedYear = VIN_YEAR_MAP[yearCode];

  return {
    validFormat: true,
    vin,
    make: matchedWmi?.make,
    suggestedModel: matchedWmi?.model,
    year: decodedYear,
    regionLabel: matchedWmi?.region || 'International Chassis',
  };
}
