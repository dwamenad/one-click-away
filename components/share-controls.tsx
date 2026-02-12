"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareControls({ tripId }: { tripId: string }) {
  const [publicUrl, setPublicUrl] = useState("");
  const [groupUrl, setGroupUrl] = useState("");

  async function makePublicLink() {
    const response = await fetch(`/api/trips/${tripId}/share`, { method: "POST" });
    const data = await response.json();
    setPublicUrl(data.url);
  }

  async function makeGroupLink() {
    const response = await fetch(`/api/trips/${tripId}/invite`, { method: "POST" });
    const data = await response.json();
    setGroupUrl(data.url);
  }

  return (
    <div className="space-y-2 rounded-lg border bg-white p-3">
      <p className="text-sm font-semibold">Share</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={makePublicLink}>Generate public link</Button>
        <Button variant="outline" onClick={makeGroupLink}>Generate group voting link</Button>
      </div>
      {publicUrl ? <p className="break-all text-xs">Public: {publicUrl}</p> : null}
      {groupUrl ? <p className="break-all text-xs">Group: {groupUrl}</p> : null}
    </div>
  );
}
