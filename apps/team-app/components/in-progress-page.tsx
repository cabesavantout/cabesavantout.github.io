import { Badge, EmptyState, PageHeader, Panel } from "@/components/ui";

type InProgressPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  scope: string[];
};

export function InProgressPage({
  eyebrow,
  title,
  description,
  status = "En cours",
  scope,
}: InProgressPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        meta={<Badge tone="warning">{status}</Badge>}
      />

      <Panel
        title="Ce que cette page preparera"
        subtitle="La structure est visible dans la navigation pour figer le perimetre produit, meme si le contenu detaille n'est pas encore branche."
      >
        <div className="space-y-3">
          {scope.map((item) => (
            <div
              key={item}
              className="rounded-[1rem] border border-line bg-elevated px-4 py-3 text-sm text-ink"
            >
              {item}
            </div>
          ))}
        </div>
      </Panel>

      <EmptyState
        title="Contenu en preparation"
        description="La route existe deja pour stabiliser la navigation et preparer l'implementation progressive."
      />
    </div>
  );
}
