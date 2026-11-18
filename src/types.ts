export type CategoryId =
  | 'braking'
  | 'cooling'
  | 'electrical'
  | 'engine'
  | 'exhaust'
  | 'filters'
  | 'suspension';

export type VariantType = 'standard_oem' | 'heavy_duty';

export type CurrencyCode = 'AED' | 'USD';

export type PricingMode = 'retail' | 'bulk';

export type VehicleMake =
  | 'Toyota'
  | 'Nissan'
  | 'Lexus'
  | 'Mercedes-Benz'
  | 'BMW'
  | 'Mitsubishi'
  | 'Hyundai';

export type DispatchLane = 'uae_same_day' | 'gcc_overland' | 'intl_air';

export type CatalogSortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'thermal_desc'
  | 'warranty_desc';

export type DutyProfile = 'urban' | 'gcc_heavy' | 'desert_offroad';

export interface VehicleFitment {
  make: VehicleMake | '';
  model: string;
  year: string;
  vin?: string;
}

export interface SavedVehicle {
  id: string;
  label: string;
  fitment: VehicleFitment;
}

export interface EngineeringSpecs {
  thermalRatingC: number;
  tensileMPa: number;
  lifespanKm: number;
  toleranceMicron: number;
}

export interface PartVariant {
  id: VariantType;
  label: string;
  shortLabel: string;
  sku: string;
  oeReference: string;
  summary: string;
  materialFinish: string;
  priceAED: number;
  warrantyMonths: number;
  stockStatus: 'In Stock · UAE Hub' | 'Ready for Dispatch' | 'Express Export';
  specs: EngineeringSpecs;
  highlights: string[];
}

export interface SparePart {
  id: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  fastMoving: boolean;
  tagline: string;
  description: string;
  image: string;
  compatibleMakes: VehicleMake[];
  compatibleModels: Partial<Record<VehicleMake, string[]>>;
  yearMin: number;
  yearMax: number;
  variants: Record<VariantType, PartVariant>;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  image: string;
  featuredPartIds: string[];
}

export interface ChassisHotspot {
  id: CategoryId;
  label: string;
  zoneName: string;
  xPercent: number;
  yPercent: number;
  summary: string;
  keyMetricLabel: string;
  keyMetricValue: string;
}

export interface QuoteBagItem {
  partId: string;
  variantId: VariantType;
  quantity: number;
  fitment?: VehicleFitment;
}
