import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { tripId: string } }) {
  const body = await request.json();
  const itemId: string = body.itemId;

  const item = await db.tripItem.findFirst({
    where: {
      id: itemId,
      tripDay: {
        tripId: params.tripId
      }
    }
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await db.tripItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
