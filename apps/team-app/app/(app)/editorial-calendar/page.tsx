import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Calendrier editorial"
      description="Organiser les prises de parole pour garder un rythme coherent entre terrain, presse et reseaux."
      scope={[
        "Vue par semaine ou par mois",
        "Temps forts a preparer",
        "Responsables et echeances",
      ]}
    />
  );
}
