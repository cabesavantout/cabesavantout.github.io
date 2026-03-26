import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("qualifie un retour terrain existant", async ({ page }) => {
  const topic = uniqueLabel("Qualification E2E");
  const summary = `Résumé ${topic}`;

  await loginAsE2EUser(page);
  await page.goto("/field-reports");

  await page.locator("summary").filter({ hasText: /ajouter un retour/i }).click();
  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /^enregistrer$/i }) })
    .first();
  await createForm.getByLabel("Sujet").fill(topic);
  await createForm.getByLabel("Résumé").fill(summary);
  await createForm.getByRole("button", { name: /^enregistrer$/i }).click();

  await expect(page).toHaveURL(/\/field-reports\?success=/);

  const card = page.locator("article").filter({ hasText: topic }).first();
  const updateForm = card.locator("form").last();
  await updateForm.getByLabel("Soutien").selectOption("skeptical");
  await updateForm.getByLabel("Priorité").selectOption("critical");
  await updateForm.getByLabel("Statut").selectOption("qualified");
  await updateForm.getByLabel("Sentiment").selectOption("-1");
  await updateForm.getByLabel("Tags").fill("e2e, qualifie");
  await updateForm.getByRole("button", { name: /mettre à jour/i }).click();

  await expect(page).toHaveURL(/\/field-reports\?success=/);
  const updatedCard = page.locator("article").filter({ hasText: topic }).first();
  const updatedForm = updatedCard.locator("form").last();
  await expect(updatedForm.getByLabel("Soutien")).toHaveValue("skeptical");
  await expect(updatedForm.getByLabel("Priorité")).toHaveValue("critical");
  await expect(updatedForm.getByLabel("Statut")).toHaveValue("qualified");
  await expect(updatedForm.getByLabel("Sentiment")).toHaveValue("-1");
  await expect(updatedCard.getByText(/#e2e/i).first()).toBeVisible();
});
