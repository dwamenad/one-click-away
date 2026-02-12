import { NextRequest } from "next/server";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");
  const maxHeightPx = request.nextUrl.searchParams.get("maxHeightPx") || "240";
  const maxWidthPx = request.nextUrl.searchParams.get("maxWidthPx") || "240";

  if (!name) {
    return new Response("Missing photo name", { status: 400 });
  }

  const upstream = await fetch(
    `https://places.googleapis.com/v1/${name}/media?maxHeightPx=${encodeURIComponent(maxHeightPx)}&maxWidthPx=${encodeURIComponent(maxWidthPx)}`,
    {
      headers: {
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY_SERVER
      },
      cache: "no-store"
    }
  );

  if (!upstream.ok) {
    return new Response("Photo unavailable", { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
