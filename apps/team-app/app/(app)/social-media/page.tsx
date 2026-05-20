import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Reseaux sociaux"
      description="Centraliser les publications, les canaux et le suivi des prises de parole numeriques."
      scope={[
        "Calendrier de publications",
        "Canaux et formats prioritaires",
        "Suivi des contenus publies",
      ]}
    />
  );
}
