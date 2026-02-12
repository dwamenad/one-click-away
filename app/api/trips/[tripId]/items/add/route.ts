import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { tripId: string } }) {
  const body = await request.json();
  const { dayId, place } = body as {
    dayId: string;
    place: {
      placeId: string;
      name: string;
      lat: number;
      lng: number;
      category?: string;
      notes?: string;
    };
  };

  const day = await db.tripDay.findFirst({
    where: { id: dayId, tripId: params.tripId },
    include: { items: true }
  });

  if (!day) {
    return NextResponse.json({ error: "Day not found" }, { status: 404 });
  }

  const item = await db.tripItem.create({
    data: {
      tripDayId: day.id,
      placeId: place.placeId,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      category: place.category || "do",
      orderIndex: day.items.length,
      notes: place.notes
    }
  });

  return NextResponse.json({ item });
}
