import { NextRequest, NextResponse } from "next/server";
import { placesProvider } from "@/lib/providers";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId");
  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  const place = await placesProvider.placeDetails(placeId);
  return NextResponse.json({ place });
}
