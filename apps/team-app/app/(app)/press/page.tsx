import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Presse et articles"
      description="Suivre la couverture mediatique utile et garder une trace des articles a relire."
      scope={[
        "Articles a surveiller",
        "Veille presse locale",
        "Points de contexte associes",
      ]}
    />
  );
}
