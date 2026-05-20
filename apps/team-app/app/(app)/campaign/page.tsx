import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Campagne"
      description="Piloter la strategie, les temps forts et les priorites de campagne sans disperser l'equipe."
      scope={[
        "Feuille de route de campagne",
        "Moments politiques a preparer",
        "Priorites par periode",
      ]}
    />
  );
}
