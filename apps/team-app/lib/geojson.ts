import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type FeatureProperties = {
  codeDepartement: string;
  nomDepartement: string;
  codeCirconscription: string;
  nomCirconscription: string;
  codeCommune: string;
  nomCommune: string;
  numeroBureauVote: string;
  codeBureauVote: string;
  id_bv: string;
  place_name: string;
  address: string;
  is_centralizer: string;
  source_pdf: string;
  has_validated_results_2026_t1: boolean;
  inscrits_2026_t1: number | null;
  votants_2026_t1: number | null;
  blancs_2026_t1: number | null;
  nuls_2026_t1: number | null;
  exprimes_2026_t1: number | null;
  top_candidate_2026_t1: string | null;
  top_candidate_group_2026_t1: string | null;
  top_candidate_votes_2026_t1: number | null;
  candidate_results_2026_t1: Array<{
    candidate_label: string;
    candidate_last_name: string;
    candidate_group: string;
    votes: number;
  }>;
};

export type GeoJsonFeature = {
  type: "Feature";
  properties: FeatureProperties;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

export type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

export async function getEnrichedPollingStationsGeoJson() {
  const path = join(
    process.cwd(),
    "..",
    "..",
    "data",
    "bureaux-vote",
    "cabestany-bureaux-vote-enriched.geojson",
  );

  const content = await readFile(path, "utf-8");
  return JSON.parse(content) as GeoJsonFeatureCollection;
}
