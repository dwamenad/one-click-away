export type BudgetMode = "budget" | "mid" | "luxury";
export type HubCategory = "eat" | "stay" | "do";

export type PlaceCard = {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  openNow?: boolean;
  address?: string;
  photoUrl?: string;
  types: string[];
};

export type NearbySearchInput = {
  lat: number;
  lng: number;
  type: string;
  radiusMeters: number;
  minPrice?: number;
  maxPrice?: number;
};

export type PlaceSuggestion = {
  placeId: string;
  text: string;
};

export type PlaceDetails = PlaceCard;

export type ItineraryPick = PlaceCard & {
  rationale: string;
  score: number;
  distanceMeters: number;
};
