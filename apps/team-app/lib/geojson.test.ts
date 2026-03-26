import { getEnrichedPollingStationsGeoJson } from "@/lib/geojson";

describe("geojson helpers", () => {
  it("charge le geojson enrichi depuis le dossier data", async () => {
    const result = await getEnrichedPollingStationsGeoJson();

    expect(result.type).toBe("FeatureCollection");
    expect(Array.isArray(result.features)).toBe(true);
    expect(result.features.length).toBeGreaterThan(0);
    expect(result.features[0]?.properties.codeCommune).toBe("66028");
    expect(result.features[0]?.properties.codeBureauVote).toMatch(/^66028_\d{4}$/);
  });
});
