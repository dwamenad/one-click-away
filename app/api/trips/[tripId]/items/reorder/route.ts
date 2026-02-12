import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { tripId: string } }) {
  const body = await request.json();
  const dayId: string = body.dayId;
  const orderedItemIds: string[] = body.orderedItemIds || [];

  const day = await db.tripDay.findFirst({ where: { id: dayId, tripId: params.tripId } });
  if (!day) {
    return NextResponse.json({ error: "Day not found" }, { status: 404 });
  }

  await Promise.all(
    orderedItemIds.map((id, index) =>
      db.tripItem.update({
        where: { id },
        data: { orderIndex: index }
      })
    )
  );

  return NextResponse.json({ ok: true });
}
