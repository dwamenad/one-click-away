import { describe, expect, it } from "vitest";
import { pickTopPlaces, scorePlace } from "@/lib/itinerary";

describe("itinerary scoring", () => {
  it("scores closer and better-rated places higher", () => {
    const near = scorePlace(
      {
        placeId: "a",
        name: "Near Place",
        lat: 5.6038,
        lng: -0.1871,
        rating: 4.7,
        userRatingsTotal: 200,
        types: []
      },
      5.6037,
      -0.187
    );

    const far = scorePlace(
      {
        placeId: "b",
        name: "Far Place",
        lat: 5.8,
        lng: -0.3,
        rating: 4.1,
        userRatingsTotal: 20,
        types: []
      },
      5.6037,
      -0.187
    );

    expect(near.score).toBeGreaterThan(far.score);
  });

  it("picks deterministic top places", () => {
    const picks = pickTopPlaces(
      [
        { placeId: "1", name: "One", lat: 5.6038, lng: -0.1871, rating: 4.8, userRatingsTotal: 300, types: [] },
        { placeId: "2", name: "Two", lat: 5.7, lng: -0.2, rating: 4.2, userRatingsTotal: 10, types: [] },
        { placeId: "3", name: "Three", lat: 5.604, lng: -0.1874, rating: 4.6, userRatingsTotal: 220, types: [] }
      ],
      5.6037,
      -0.187,
      2
    );

    expect(picks).toHaveLength(2);
    expect(picks[0].placeId).toBe("1");
    expect(picks[1].placeId).toBe("3");
  });
});
