import { PollingStationsPage } from "@/components/polling-stations-page";
import { getEnrichedPollingStationsGeoJson } from "@/lib/geojson";
import { getPollingStationsMapData } from "@/lib/polling-stations-data";
import { getPollingSectorMapData } from "@/lib/polling-sectors-data";

export const revalidate = 300;

export default async function Page() {
  const [geoJsonResult, stationsResult, sectorsResult] = await Promise.allSettled([
    getEnrichedPollingStationsGeoJson(),
    getPollingStationsMapData(),
    getPollingSectorMapData(),
  ]);

  const geoJson = geoJsonResult.status === "fulfilled" ? geoJsonResult.value : null;
  const stations = stationsResult.status === "fulfilled" ? stationsResult.value : [];
  const sectors = sectorsResult.status === "fulfilled" ? sectorsResult.value : [];
  const mapError =
    geoJsonResult.status === "rejected"
      ? "La carte n'a pas pu être chargée. Les contours GeoJSON sont indisponibles."
      : null;

  return <PollingStationsPage geoJson={geoJson} mapError={mapError} stations={stations} sectors={sectors} />;
}
