import type { BudgetMode, HubCategory, ItineraryPick, PlaceCard } from "@/lib/types";
import { haversineMeters } from "@/lib/utils";

export const CATEGORY_TYPES: Record<HubCategory, string[]> = {
  eat: ["restaurant", "cafe", "meal_takeaway", "bakery"],
  stay: ["lodging"],
  do: ["tourist_attraction", "museum", "park", "art_gallery", "zoo", "aquarium"]
};

export function budgetToPriceRange(budget: BudgetMode): { minPrice?: number; maxPrice?: number } {
  if (budget === "budget") return { minPrice: 0, maxPrice: 1 };
  if (budget === "mid") return { minPrice: 2, maxPrice: 2 };
  return { minPrice: 3, maxPrice: 4 };
}

export function scorePlace(place: PlaceCard, centerLat: number, centerLng: number): { score: number; distanceMeters: number } {
  const rating = place.rating ?? 3.5;
  const total = place.userRatingsTotal ?? 15;
  const distanceMeters = haversineMeters(centerLat, centerLng, place.lat, place.lng);
  const distancePenalty = distanceMeters / 5000;
  const score = rating * Math.log1p(total) - distancePenalty;
  return { score, distanceMeters };
}

export function pickTopPlaces(
  places: PlaceCard[],
  centerLat: number,
  centerLng: number,
  count: number,
  usedIds = new Set<string>()
): ItineraryPick[] {
  return places
    .filter((p) => !usedIds.has(p.placeId))
    .map((p) => {
      const scored = scorePlace(p, centerLat, centerLng);
      return {
        ...p,
        ...scored,
        rationale: "High-rated and popular within a short walk of the center."
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
