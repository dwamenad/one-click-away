import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareControls } from "@/components/share-controls";
import { TripBuilder } from "@/components/trip-builder";
import type { TripData } from "@/components/trip-builder";
import { getTripBySlug, getVoteTotals } from "@/lib/server/trip-service";

export default async function TripPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { group?: string };
}) {
  const trip = await getTripBySlug(params.slug);
  if (!trip) {
    notFound();
  }

  const votes = await getVoteTotals(trip.id);
  const apiKey = process.env.GOOGLE_MAPS_API_KEY_PUBLIC || "";
  const serializedTrip = JSON.parse(JSON.stringify(trip)) as TripData;

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-primary underline">Back</Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <p className="text-sm text-muted-foreground">Shareable itinerary</p>
        </div>
        <ShareControls tripId={trip.id} />
      </div>
      <TripBuilder apiKey={apiKey} initialTrip={serializedTrip} groupToken={searchParams.group} initialVotes={votes} />
    </div>
  );
}
