import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { tripId: string } }) {
  const body = await request.json();
  const { itemId, toDayId } = body as { itemId: string; toDayId: string };

  const toDay = await db.tripDay.findFirst({ where: { id: toDayId, tripId: params.tripId }, include: { items: true } });
  if (!toDay) {
    return NextResponse.json({ error: "Destination day not found" }, { status: 404 });
  }

  await db.tripItem.update({
    where: { id: itemId },
    data: {
      tripDayId: toDayId,
      orderIndex: toDay.items.length
    }
  });

  return NextResponse.json({ ok: true });
}
