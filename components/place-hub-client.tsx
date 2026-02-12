"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapView } from "@/components/map-view";
import { PlaceCard } from "@/components/place-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BudgetMode, HubCategory, PlaceCard as PlaceCardType } from "@/lib/types";

type HubData = {
  place: PlaceCardType;
  byCategory: Record<HubCategory, PlaceCardType[]>;
};

export function PlaceHubClient({
  apiKey,
  initial,
  placeId
}: {
  apiKey: string;
  initial: HubData;
  placeId: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<HubCategory>("eat");
  const [budget, setBudget] = useState<BudgetMode>("mid");
  const [radius, setRadius] = useState(3000);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | undefined>();
  const [byCategory, setByCategory] = useState(initial.byCategory);

  const activePlaces = byCategory[category] || [];

  const allVisible = useMemo(() => {
    const map = new Map<string, PlaceCardType>();
    Object.values(byCategory)
      .flat()
      .forEach((p) => map.set(p.placeId, p));
    return Array.from(map.values());
  }, [byCategory]);

  async function refreshCategory(next: HubCategory) {
    setCategory(next);
    setLoading(true);
    try {
      const type =
        next === "eat" ? "restaurant" :
        next === "stay" ? "lodging" : "tourist_attraction";
      const response = await fetch(
        `/api/places/nearby?lat=${initial.place.lat}&lng=${initial.place.lng}&type=${type}&radius=${radius}&budget=${budget}`
      );
      const data = await response.json();
      setByCategory((prev) => ({ ...prev, [next]: data.places || [] }));
    } finally {
      setLoading(false);
    }
  }

  async function createTrip() {
    setLoading(true);
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          title: `${initial.place.name} Plan`,
          centerLat: initial.place.lat,
          centerLng: initial.place.lng,
          days: 2,
          budget
        })
      });

      const data = await response.json();
      if (data.trip?.slug) {
        router.push(`/trip/${data.trip.slug}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select value={budget} onChange={(e) => setBudget(e.target.value as BudgetMode)} className="rounded border bg-white px-3 py-2 text-sm">
          <option value="budget">Budget</option>
          <option value="mid">Mid</option>
          <option value="luxury">Luxury</option>
        </select>
        <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="rounded border bg-white px-3 py-2 text-sm">
          <option value={2000}>2 km radius</option>
          <option value={3000}>3 km radius</option>
          <option value={5000}>5 km radius</option>
        </select>
        <Button onClick={() => refreshCategory(category)} variant="outline" disabled={loading}>
          Refresh
        </Button>
        <Button onClick={createTrip} disabled={loading}>Create trip</Button>
      </div>

      <MapView
        apiKey={apiKey}
        center={{ lat: initial.place.lat, lng: initial.place.lng }}
        places={allVisible}
        highlightedPlaceId={focused}
        onPinClick={setFocused}
      />

      <Tabs value={category} onValueChange={(v) => refreshCategory(v as HubCategory)}>
        <TabsList>
          <TabsTrigger value="eat">Eat</TabsTrigger>
          <TabsTrigger value="stay">Stay</TabsTrigger>
          <TabsTrigger value="do">Do</TabsTrigger>
        </TabsList>

        {(["eat", "stay", "do"] as HubCategory[]).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-3 md:grid-cols-2">
              {(tab === category ? activePlaces : byCategory[tab] || []).map((place) => (
                <PlaceCard key={place.placeId} place={place} focused={focused === place.placeId} onClick={() => setFocused(place.placeId)} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
