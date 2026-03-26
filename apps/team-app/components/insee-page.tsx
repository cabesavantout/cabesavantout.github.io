import { PageHeader, Panel, StatCard } from "@/components/ui";
import type { InseePageData } from "@/lib/postgres";

export function InseePage({
  data,
}: {
  data: InseePageData;
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Données"
        title="Repères INSEE"
        description="Synthèse socio-démographique utile au cadrage politique de Cabestany."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {data.headline.map((item, index) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            tone={index === 1 ? "accent" : index === 2 ? "pine" : "default"}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel
          title="Structure par âge"
          subtitle="Répartition 2022."
        >
          <div className="space-y-3">
            {data.ageBreakdown.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-line/70 bg-sand/70 px-4 py-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-ink/65">
                    {item.count} habitants · {item.share}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Repères rapides"
          subtitle="Lecture politique et ciblage."
        >
          <div className="space-y-4">
            {data.headline.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-line/70 bg-white/70 p-4"
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm text-ink/65">{item.summary}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Habitat et ménages"
          subtitle="Premiers repères pour relier sociologie locale, terrain et quartiers."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.housingHighlights.map((item) => (
              <article
                key={item.label}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <p className="text-sm font-medium text-ink/70">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold">{item.value}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
