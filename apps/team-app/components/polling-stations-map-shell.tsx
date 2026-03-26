"use client";

import dynamic from "next/dynamic";
import type { GeoJsonFeatureCollection } from "@/lib/geojson";

const PollingStationsMap = dynamic(
  () => import("@/components/polling-stations-map").then((module) => module.PollingStationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-line/70 bg-sand/70 p-5 text-sm text-ink/65">
        Chargement de la carte…
      </div>
    ),
  },
);

export function PollingStationsMapShell({
  data,
}: {
  data: GeoJsonFeatureCollection;
}) {
  return <PollingStationsMap data={data} />;
}
