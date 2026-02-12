"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlaceCard } from "@/components/place-card";
import type { PlaceCard as PlaceCardType } from "@/lib/types";

export function NearbyNow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<{ eat: PlaceCardType[]; coffee: PlaceCardType[]; do: PlaceCardType[] } | null>(null);

  async function locate() {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`/api/nearby?lat=${latitude}&lng=${longitude}`);
          const payload = await response.json();
          setData(payload);
        } catch {
          setError("Failed to load nearby picks.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location permission denied.");
      },
      { enableHighAccuracy: false, timeout: 7000 }
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-xl font-bold">Nearby Now</h1>
        <p className="text-sm text-muted-foreground">Quick picks within roughly 10-15 minutes.</p>
        <Button onClick={locate} className="mt-3" disabled={loading}>{loading ? "Loading..." : "Use my location"}</Button>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>

      {data ? (
        <div className="space-y-4">
          {(["eat", "coffee", "do"] as const).map((section) => (
            <section key={section} className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide">{section}</h2>
              <div className="grid gap-2 md:grid-cols-2">
                {data[section].map((place) => (
                  <PlaceCard key={place.placeId} place={place} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
