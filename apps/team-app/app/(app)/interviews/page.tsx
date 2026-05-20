import { InProgressPage } from "@/components/in-progress-page";

export default function Page() {
  return (
    <InProgressPage
      eyebrow="Administration"
      title="Interviews"
      description="Preparer les interviews, les points a porter et les suites a donner apres diffusion."
      scope={[
        "Interviews prevues",
        "Questions et angles probables",
        "Elements de preparation",
      ]}
    />
  );
}
