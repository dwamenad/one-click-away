import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateTripPlan } from "@/lib/server/trip-service";

const createTripSchema = z.object({
  title: z.string().min(2),
  placeId: z.string().optional(),
  centerLat: z.number(),
  centerLng: z.number(),
  days: z.number().int().min(1).max(3),
  budget: z.enum(["budget", "mid", "luxury"])
});

export async function POST(request: NextRequest) {
  const payload = createTripSchema.parse(await request.json());
  const trip = await generateTripPlan(payload);
  return NextResponse.json({ trip });
}
