import { NextRequest, NextResponse } from "next/server";
import { parseSocialIntent } from "@/lib/social-parse";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const input = String(body.input || "").slice(0, 3000);
  const parsed = await parseSocialIntent(input);
  return NextResponse.json(parsed);
}
