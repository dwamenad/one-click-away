import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(_: NextRequest, { params }: { params: { tripId: string } }) {
  const trip = await db.trip.findUnique({ where: { id: params.tripId } });
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({
    url: `${env.NEXT_PUBLIC_APP_URL}/trip/${trip.slug}`
  });
}
