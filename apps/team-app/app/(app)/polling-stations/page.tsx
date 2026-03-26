import { PollingStationsPage } from "@/components/polling-stations-page";
import { getEnrichedPollingStationsGeoJson } from "@/lib/geojson";
import { getPollingStations, hasDatabaseUrl } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const geoJson = await getEnrichedPollingStationsGeoJson();

  if (!hasDatabaseUrl()) {
    return (
      <PollingStationsPage
        geoJson={geoJson}
        stations={[]}
      />
    );
  }

  const stations = await getPollingStations();
  return <PollingStationsPage geoJson={geoJson} stations={stations} />;
}
