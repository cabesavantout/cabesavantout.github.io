import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Reglages"
      description="Rassembler les reglages fonctionnels de l'application sans les melanger avec les pages d'analyse."
      scope={[
        "Preferences d'affichage",
        "Reglages d'organisation",
        "Options globales de l'outil",
      ]}
    />
  );
}
