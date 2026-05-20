"use client";

import dynamic from "next/dynamic";
import type { GeoJsonFeatureCollection } from "@/lib/geojson";
import type { PollingStationMapRecord } from "@/lib/polling-stations-data";

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
  selectedCode,
  stations,
}: {
  data: GeoJsonFeatureCollection;
  selectedCode: string | null;
  stations: Array<{
    pollingStationCode: PollingStationMapRecord["pollingStationCode"];
    placeName: PollingStationMapRecord["placeName"];
    turnoutPct: number | null;
    reportCount: PollingStationMapRecord["reportCount"];
    urgentCount: PollingStationMapRecord["urgentCount"];
    riskLevel: "high" | "medium" | "low" | "insufficient";
    riskLabel: string;
    latestElectionLabel?: PollingStationMapRecord["latestElectionLabel"];
    turnoutTrendPct?: PollingStationMapRecord["turnoutTrendPct"];
  }>;
}) {
  if (stations.length === 0 || data.features.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-elevated p-5 text-sm text-muted">
        Aucun contour exploitable pour ce filtre. Essayez un autre filtre ou élargissez la sélection.
      </div>
    );
  }

  return <PollingStationsMap data={data} selectedCode={selectedCode} stations={stations} />;
}
