import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Communiques"
      description="Preparer, valider et retrouver les prises de position officielles de l'equipe."
      scope={[
        "Communiques publies",
        "Brouillons a valider",
        "Angles et messages associes",
      ]}
    />
  );
}
