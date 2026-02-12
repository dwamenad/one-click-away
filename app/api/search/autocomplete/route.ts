import { NextRequest, NextResponse } from "next/server";
import { placesProvider } from "@/lib/providers";
import { rateLimit } from "@/lib/server/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const query = request.nextUrl.searchParams.get("q") || "";
  const sessionToken = request.nextUrl.searchParams.get("sessionToken") || undefined;

  if (!query.trim()) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = await placesProvider.autocomplete(query, sessionToken);
  return NextResponse.json({ suggestions });
}
