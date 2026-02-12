import { GooglePlacesProvider } from "@/lib/providers/google-places";
import type { PlacesProvider } from "@/lib/providers/types";
import { getNearbyCache, getPlaceCache, setNearbyCache, setPlaceCache } from "@/lib/server/cache";
import type { NearbySearchInput, PlaceDetails, PlaceSuggestion } from "@/lib/types";

const provider = new GooglePlacesProvider();

function key(input: NearbySearchInput) {
  return [
    input.lat.toFixed(4),
    input.lng.toFixed(4),
    input.type,
    input.radiusMeters,
    input.minPrice ?? "na",
    input.maxPrice ?? "na"
  ].join(":");
}

export const placesProvider: PlacesProvider = {
  autocomplete(query: string, sessionToken?: string): Promise<PlaceSuggestion[]> {
    return provider.autocomplete(query, sessionToken);
  },
  async placeDetails(placeId: string): Promise<PlaceDetails> {
    const cached = await getPlaceCache<PlaceDetails>(placeId, 24);
    if (cached) return cached;
    const fresh = await provider.placeDetails(placeId);
    await setPlaceCache(placeId, fresh);
    return fresh;
  },
  async nearbySearch(input: NearbySearchInput): Promise<PlaceDetails[]> {
    const cacheKey = key(input);
    const cached = await getNearbyCache<PlaceDetails[]>(cacheKey, 6);
    if (cached) return cached;
    const fresh = await provider.nearbySearch(input);
    await setNearbyCache(cacheKey, fresh);
    return fresh;
  }
};
