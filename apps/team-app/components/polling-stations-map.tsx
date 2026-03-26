"use client";

import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeoJsonFeatureCollection } from "@/lib/geojson";

const center: [number, number] = [42.681, 2.941];

function getColor(hasResults: boolean) {
  return hasResults ? "#1e6b4c" : "#c84c09";
}

export function PollingStationsMap({
  data,
}: {
  data: GeoJsonFeatureCollection;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-panel">
      <MapContainer
        center={center}
        className="h-[300px] w-full sm:h-[400px] lg:h-[520px]"
        scrollWheelZoom={false}
        zoom={14}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={data as unknown as FeatureCollection<Geometry, Record<string, unknown>>}
          style={(feature?: Feature<Geometry, Record<string, unknown>>) => {
            const hasResults = Boolean(feature?.properties?.has_validated_results_2026_t1);
            return {
              color: getColor(hasResults),
              weight: 2,
              fillColor: getColor(hasResults),
              fillOpacity: hasResults ? 0.28 : 0.14,
            };
          }}
          onEachFeature={(feature, layer) => {
            const properties = feature.properties as {
              numeroBureauVote?: string;
              place_name?: string;
              address?: string;
              has_validated_results_2026_t1?: boolean;
              top_candidate_2026_t1?: string | null;
              top_candidate_votes_2026_t1?: number | null;
            };

            layer.bindPopup(`
              <div style="min-width: 220px">
                <strong>Bureau ${properties.numeroBureauVote ?? "N/A"}</strong><br/>
                ${properties.place_name ?? ""}<br/>
                ${properties.address ?? ""}<br/><br/>
                ${
                  properties.has_validated_results_2026_t1
                    ? `Tête 2026 T1 : ${properties.top_candidate_2026_t1 ?? "N/A"} (${properties.top_candidate_votes_2026_t1 ?? "N/A"} voix)`
                    : "Résultats 2026 T1 non validés"
                }
              </div>
            `);
          }}
        />
      </MapContainer>
    </div>
  );
}
