export type Species = "TERRAN" | "CENTAURIAN";

export interface PricingInput {
  basePrice: number;
  species: Species;
  age: number;
  groupSize: number;
  visitDate: Date;
  isLunarHoliday: boolean;
  projectedCapacityMultiplier: number;
  dayOfWeekMultiplier: number;
}

export interface PricingBreakdown {
  basePrice: number;
  dayOfWeekMultiplier: number;
  capacityMultiplier: number;
  discountLabel: string | null;
  discountPct: number;
  subtotal: number;
  lunarTaxRate: number;
  lunarTaxAmount: number;
  finalPrice: number;
}

export type TicketDeliveryChannel = "EMAIL" | "DEVICE_DOWNLOAD" | "CYBERNETIC_IMPLANT";

export type POIType = "ATTRACTION" | "SHOP" | "RESTAURANT";
export type POIStatus = "OPEN" | "CLOSED" | "UNDER_CONSTRUCTION";

export interface POIOffering {
  name: string;
  price: number;
}

export interface POI {
  slug: string;
  type: POIType;
  name: string;
  descriptionText: string;
  voiceoverUrl?: string;
  imageUrls: string[];
  videoUrl?: string;
  holoAssetUrl?: string;
  waitTimeMins?: number;
  status: POIStatus;
  offerings: POIOffering[];
  updatedAt: string;
}
