"use client";

import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import type { PlaceCard } from "@/lib/types";

type Props = {
  apiKey: string;
  center: { lat: number; lng: number };
  places: PlaceCard[];
  highlightedPlaceId?: string;
  onPinClick?: (placeId: string) => void;
};

export function MapView({ apiKey, center, places, highlightedPlaceId, onPinClick }: Props) {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "380px", borderRadius: "12px" }} center={center} zoom={13}>
        {places.map((place) => (
          <MarkerF
            key={place.placeId}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => onPinClick?.(place.placeId)}
            icon={
              highlightedPlaceId === place.placeId
                ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : undefined
            }
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
