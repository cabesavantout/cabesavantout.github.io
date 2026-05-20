import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Sources de donnees"
      description="Suivre les sources externes, leur fiabilite et leur frequence de mise a jour."
      scope={[
        "Sources connectees",
        "Dernieres synchronisations",
        "Qualite et couverture des donnees",
      ]}
    />
  );
}
