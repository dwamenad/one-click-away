import Image from "next/image";
import type { ReactNode } from "react";
import type { PlaceCard as PlaceCardType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Props = {
  place: PlaceCardType;
  focused?: boolean;
  onClick?: () => void;
  footer?: ReactNode;
};

export function PlaceCard({ place, focused, onClick, footer }: Props) {
  return (
    <Card className={focused ? "ring-2 ring-primary/40" : ""} onClick={onClick}>
      <div className="flex gap-3">
        {place.photoUrl ? (
          <Image src={place.photoUrl} alt={place.name} width={88} height={88} className="h-20 w-20 rounded-md object-cover" unoptimized />
        ) : (
          <div className="h-20 w-20 rounded-md bg-muted" />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="truncate text-sm font-semibold">{place.name}</h4>
          <p className="line-clamp-2 text-xs text-muted-foreground">{place.address ?? "Address unavailable"}</p>
          <div className="flex flex-wrap gap-1">
            {place.rating ? <Badge>⭐ {place.rating}</Badge> : null}
            {place.userRatingsTotal ? <Badge>{place.userRatingsTotal} reviews</Badge> : null}
            {typeof place.priceLevel === "number" ? <Badge>Price {place.priceLevel}</Badge> : null}
            {typeof place.openNow === "boolean" ? <Badge>{place.openNow ? "Open" : "Closed"}</Badge> : null}
          </div>
        </div>
      </div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </Card>
  );
}
