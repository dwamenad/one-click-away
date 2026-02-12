import { describe, expect, it } from "vitest";
import type { PlacesProvider } from "@/lib/providers/types";

describe("places provider interface", () => {
  it("supports autocomplete, details, and nearby search contract", async () => {
    const mockProvider: PlacesProvider = {
      async autocomplete(query) {
        return [{ placeId: "abc", text: `${query} result` }];
      },
      async placeDetails(placeId) {
        return {
          placeId,
          name: "Mock Place",
          lat: 10,
          lng: 20,
          rating: 4.4,
          userRatingsTotal: 100,
          priceLevel: 2,
          openNow: true,
          address: "Mock Address",
          photoUrl: "https://example.com/photo.jpg",
          types: ["restaurant"]
        };
      },
      async nearbySearch() {
        return [
          {
            placeId: "near-1",
            name: "Nearby Mock",
            lat: 11,
            lng: 21,
            types: ["cafe"]
          }
        ];
      }
    };

    await expect(mockProvider.autocomplete("Paris")).resolves.toEqual([
      { placeId: "abc", text: "Paris result" }
    ]);

    await expect(mockProvider.placeDetails("abc")).resolves.toMatchObject({
      placeId: "abc",
      name: "Mock Place"
    });

    await expect(
      mockProvider.nearbySearch({ lat: 1, lng: 2, type: "restaurant", radiusMeters: 1000, minPrice: 0, maxPrice: 2 })
    ).resolves.toHaveLength(1);
  });
});
