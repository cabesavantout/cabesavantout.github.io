"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeoJsonFeatureCollection } from "@/lib/geojson";
import type { PollingStationMapRecord } from "@/lib/polling-stations-data";

const center: [number, number] = [42.681, 2.941];

function normalizePollingStationCode(code: string | null | undefined) {
  if (!code) return "";
  const value = String(code).trim();
  const parts = value.split("_");
  return parts[parts.length - 1] ?? value;
}

function getColor(riskLevel: "high" | "medium" | "low" | "insufficient") {
  if (riskLevel === "high") return "#b42318";
  if (riskLevel === "medium") return "#f79009";
  if (riskLevel === "low") return "#12715b";
  return "#98a2b3";
}

export function PollingStationsMap({
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
  const stationsByCode = new Map(
    stations.map((station) => [normalizePollingStationCode(station.pollingStationCode), station] as const),
  );
  const filteredData = useMemo(
    () => ({
      ...data,
      features: data.features.filter((feature) =>
        stationsByCode.has(normalizePollingStationCode(feature.properties.codeBureauVote)),
      ),
    }),
    [data, stations],
  );

  if (filteredData.features.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-elevated p-5 text-sm text-muted">
        Aucun bureau cartographié ne correspond aux données disponibles.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-panel-sm sm:rounded-[26px] sm:shadow-panel md:rounded-[28px] lg:rounded-[28px]">
      <MapContainer
        center={center}
        className="h-[min(48dvh,360px)] w-full xs:h-[min(50dvh,380px)] sm:h-[430px] md:h-[500px] lg:h-[560px]"
        scrollWheelZoom={false}
        zoom={14}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={filteredData as unknown as FeatureCollection<Geometry, Record<string, unknown>>}
          style={(feature?: Feature<Geometry, Record<string, unknown>>) => {
            const code = normalizePollingStationCode(String(feature?.properties?.codeBureauVote ?? ""));
            const station = stationsByCode.get(code);
            const color = getColor(station?.riskLevel ?? "insufficient");
            const isSelected = selectedCode === code;

            return {
              color,
              weight: isSelected ? 4 : 2,
              fillColor: color,
              fillOpacity: isSelected ? 0.42 : 0.22,
            };
          }}
          onEachFeature={(feature, layer) => {
            const code = normalizePollingStationCode(String(feature.properties?.codeBureauVote ?? ""));
            const station = stationsByCode.get(code);

            if (!station) {
              return;
            }

            layer.bindPopup(`
              <div style="min-width: 220px">
                <strong>Zone du territoire</strong><br/>
                Utilisez la liste sous la carte pour voir le détail opérationnel.
              </div>
            `);

            if (selectedCode === code) {
              layer.openPopup();
            }
          }}
        />
      </MapContainer>
    </div>
  );
}
