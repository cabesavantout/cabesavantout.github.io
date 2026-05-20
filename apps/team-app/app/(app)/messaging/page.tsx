import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Messages cles"
      description="Conserver une base partagee d'arguments, de formulations et de points de langage utiles."
      scope={[
        "Messages prioritaires par theme",
        "Arguments de reponse",
        "Formulations a harmoniser",
      ]}
    />
  );
}
