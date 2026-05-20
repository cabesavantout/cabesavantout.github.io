"use client";

import Link from "next/link";
import { EmptyState, PageHeader, Panel } from "@/components/ui";
import { getExternalSource } from "@/lib/external-sources";
import type { InseePageData } from "@/lib/postgres";

function parseCount(value: string) {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseShare(value: string) {
  return parseCount(value.replace("%", ""));
}

function hasValue(value?: string) {
  return Boolean(value && value !== "N/A");
}

function getHeadlineValue(data: InseePageData, label: string) {
  return data.headline.find((item) => item.label === label)?.value ?? "N/A";
}

function getHousingValue(data: InseePageData, label: string) {
  return data.housingHighlights.find((item) => item.label === label)?.value ?? "N/A";
}

function getAgeInterpretation(data: InseePageData) {
  const ordered = data.ageBreakdown
    .filter((item) => hasValue(item.share))
    .map((item) => ({ ...item, shareValue: parseShare(item.share) }))
    .sort((left, right) => right.shareValue - left.shareValue);

  const top = ordered[0];
  if (!top) return "Structure d'âge indisponible.";

  if (top.label === "60 à 74 ans" || top.label === "75 ans ou plus") {
    return "Le poids des seniors est fort: proximité, santé, cadre de vie et services doivent rester très lisibles.";
  }

  if (top.label === "30 à 44 ans" || top.label === "45 à 59 ans") {
    return "Le cœur de commune est actif: école, déplacements, services et quotidien doivent structurer le discours.";
  }

  return "Structure d'âge mixte: il faut équilibrer proximité, famille, renouvellement et présence locale.";
}

function getSocioProfessionalInterpretation(data: InseePageData) {
  const ordered = data.socioProfessionalBreakdown
    .filter((item) => hasValue(item.share))
    .map((item) => ({ ...item, shareValue: parseShare(item.share) }))
    .sort((left, right) => right.shareValue - left.shareValue);

  const top = ordered[0];
  if (!top) return "Répartition socio-professionnelle indisponible.";

  if (top.label === "employés" || top.label === "professions intermédiaires") {
    return "La commune repose surtout sur des actifs de service et de classe moyenne: parler pouvoir d'achat, services publics et mobilité.";
  }

  if (top.label === "cadres et professions intellectuelles supérieures") {
    return "Poids cadre significatif: qualité de vie, école, déplacements et sérieux de gestion doivent être crédibles.";
  }

  if (top.label === "ouvriers") {
    return "Présence ouvrière marquée: emploi, coût de la vie et proximité concrète doivent être plus visibles.";
  }

  return "La structure socio-professionnelle est utile pour ajuster le discours local par quartier et par réseau.";
}

function getHousingInterpretation(label: string) {
  if (label === "Résidences principales") {
    return "Un parc surtout occupé à l'année renforce l'importance d'une présence locale régulière.";
  }

  if (label === "Logements vacants") {
    return "Repère utile pour repérer les secteurs moins occupés ou en attente de redynamisation.";
  }

  if (label === "Maisons dans le parc") {
    return "Une forte part de maisons favorise le travail de voisinage, le terrain et les réseaux de proximité.";
  }

  return "Repère utile pour la lecture locale.";
}

export function InseePage({ data }: { data: InseePageData }) {
  const inseeSource = getExternalSource("insee-cabestany");
  const banaticSource = getExternalSource("banatic-cabestany");
  const keyFigures = [
    { label: "Habitants", value: getHeadlineValue(data, "Population 2022") },
    { label: "Logements", value: getHeadlineValue(data, "Logements") },
    { label: "Ménages", value: getHousingValue(data, "Ménages") },
    { label: "Inscrits 2026", value: getHeadlineValue(data, "Inscrits municipales 2026") },
  ].filter((item) => hasValue(item.value));

  const ageRows = data.ageBreakdown.filter((item) => hasValue(item.count) || hasValue(item.share));
  const socioRows = data.socioProfessionalBreakdown.filter((item) => hasValue(item.count) || hasValue(item.share));
  const housingRows = data.housingHighlights.filter((item) =>
    ["Résidences principales", "Logements vacants", "Maisons dans le parc"].includes(item.label) && hasValue(item.value),
  );
  const complementaryRows = [
    { label: "65 ans ou plus", value: getHeadlineValue(data, "65 ans ou plus") },
    { label: "Résidences principales", value: getHousingValue(data, "Résidences principales") },
    { label: "Maisons dans le parc", value: getHousingValue(data, "Maisons dans le parc") },
  ].filter((item) => hasValue(item.value));

  return (
    <div>
      <PageHeader
        eyebrow="INSEE"
        title="INSEE"
        description="Les repères démographiques et sociaux utiles pour comprendre la commune rapidement."
      />

      <Panel
        title="Repères clés"
        subtitle="Les chiffres à connaître d'abord avant d'entrer dans le détail."
      >
        {keyFigures.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {keyFigures.map((item) => (
              <article key={item.label} className="rounded-[1.25rem] border border-line bg-elevated p-5">
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Repères indisponibles"
            description="Les chiffres clés INSEE ne sont pas encore disponibles pour la commune."
          />
        )}
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Répartition par âge"
          subtitle="Lecture directe des générations qui structurent la commune."
        >
          {ageRows.length > 0 ? (
            <div className="space-y-4">
              {ageRows.map((item) => {
                const width = hasValue(item.share) ? Math.max(6, Math.min(100, parseShare(item.share))) : 0;

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="font-medium text-ink">{item.label}</p>
                      <p className="text-muted">
                        {[hasValue(item.count) ? item.count : null, hasValue(item.share) ? item.share : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {width > 0 ? (
                      <div className="h-3 rounded-full bg-panel">
                        <div className="h-3 rounded-full bg-ink" style={{ width: `${width}%` }} />
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="text-sm font-medium text-muted">Lecture utile</p>
                <p className="mt-2 text-sm leading-6 text-ink">{getAgeInterpretation(data)}</p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Âges indisponibles"
              description="La répartition par âge n'est pas encore remontée pour cette commune."
            />
          )}
        </Panel>

        <Panel
          title="Répartition socio-professionnelle"
          subtitle="Les catégories d'actifs qui dominent localement."
        >
          {socioRows.length > 0 ? (
            <div className="space-y-4">
              {socioRows.map((item) => {
                const width = hasValue(item.share) ? Math.max(6, Math.min(100, parseShare(item.share))) : 0;

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="font-medium text-ink">{item.label}</p>
                      <p className="text-muted">
                        {[hasValue(item.count) ? item.count : null, hasValue(item.share) ? item.share : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {width > 0 ? (
                      <div className="h-3 rounded-full bg-panel">
                        <div className="h-3 rounded-full bg-ink" style={{ width: `${width}%` }} />
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="text-sm font-medium text-muted">Lecture utile</p>
                <p className="mt-2 text-sm leading-6 text-ink">{getSocioProfessionalInterpretation(data)}</p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Répartition indisponible"
              description="Les catégories socio-professionnelles ne sont pas encore remontées."
            />
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Habitat"
          subtitle="Quelques repères utiles pour lire l'ancrage résidentiel."
        >
          {housingRows.length > 0 ? (
            <div className="space-y-4">
              {housingRows.map((item) => (
                <article key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
                  <p className="text-sm font-medium text-muted">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{getHousingInterpretation(item.label)}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Habitat indisponible"
              description="Les indicateurs de logement ne sont pas encore remontés."
            />
          )}
        </Panel>

        <Panel
          title="Compléments utiles"
          subtitle="Quelques repères supplémentaires et liens directs."
        >
          <div className="space-y-4">
            {complementaryRows.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {complementaryRows.map((item) => (
                  <article key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
                    <p className="text-sm font-medium text-muted">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Compléments indisponibles"
                description="Aucun repère complémentaire n'est encore disponible."
              />
            )}

            <div className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm font-medium text-muted">Connexions utiles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/polling-stations"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir la carte
                </Link>
                <Link
                  href="/field-reports"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir les retours terrain
                </Link>
                <Link
                  href="/elections"
                  className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                >
                  Voir les élections
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm font-medium text-muted">Sources officielles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {inseeSource ? (
                  <a
                    href={inseeSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                  >
                    Ouvrir INSEE
                  </a>
                ) : null}
                {banaticSource ? (
                  <a
                    href={banaticSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                  >
                    Ouvrir BANATIC
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
