import type { NearbySearchInput, PlaceDetails, PlaceSuggestion } from "@/lib/types";

export interface PlacesProvider {
  autocomplete(query: string, sessionToken?: string): Promise<PlaceSuggestion[]>;
  placeDetails(placeId: string): Promise<PlaceDetails>;
  nearbySearch(input: NearbySearchInput): Promise<PlaceDetails[]>;
}
