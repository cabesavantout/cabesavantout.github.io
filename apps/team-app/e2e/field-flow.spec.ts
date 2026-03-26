import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("cree une fiche citoyen puis un retour terrain et une tache liee", async ({ page }) => {
  const citizenName = uniqueLabel("Citoyen E2E");
  const topic = uniqueLabel("Sujet E2E");
  const summary = `Résumé ${topic}`;

  await loginAsE2EUser(page);

  await page.goto("/citizens");
  await page.locator("summary").filter({ hasText: /ajouter une fiche/i }).click();
  const citizenForm = page.locator("form").filter({ has: page.getByRole("button", { name: /enregistrer la fiche/i }) }).first();
  await citizenForm.getByLabel("Nom complet").fill(citizenName);
  await citizenForm.getByLabel("Téléphone").fill("0600000001");
  await citizenForm.getByLabel("Email").fill(`citizen.${Date.now()}@example.com`);
  await citizenForm.getByLabel("Quartier").fill("Centre");
  await citizenForm.getByLabel("Adresse").fill("1 rue de test");
  await citizenForm.getByLabel("Bureau de vote").selectOption({ index: 1 });
  await citizenForm.getByLabel("Niveau de soutien").selectOption("supportive");
  await citizenForm.getByLabel("Tags").fill("e2e, terrain");
  await citizenForm.getByLabel("Notes").fill("Fiche créée par Playwright.");
  await citizenForm.getByRole("button", { name: /enregistrer la fiche/i }).click();

  await expect(page).toHaveURL(/\/citizens(?:\?|$)/);

  await page.goto("/field-reports");
  await page.locator("summary").filter({ hasText: /ajouter un retour/i }).click();
  const reportForm = page.locator("form").filter({ has: page.getByRole("button", { name: /^enregistrer$/i }) }).first();
  await expect(reportForm.getByLabel("Citoyen connu").locator("option").filter({ hasText: citizenName }).first()).toBeAttached({
    timeout: 15000,
  });
  const citizenOptionValue = await reportForm
    .getByLabel("Citoyen connu")
    .locator("option")
    .filter({ hasText: citizenName })
    .first()
    .getAttribute("value");
  await reportForm.getByLabel("Citoyen connu").selectOption(citizenOptionValue ?? "");
  await reportForm.getByLabel("Quartier").fill("Centre");
  await reportForm.getByLabel("Bureau de vote").selectOption({ index: 1 });
  await reportForm.getByLabel("Sujet").fill(topic);
  await reportForm.getByLabel("Source").selectOption("terrain");
  await reportForm.getByLabel("Niveau de soutien").selectOption("supportive");
  await reportForm.getByLabel("Priorité").selectOption("high");
  await reportForm.getByLabel("Tags").fill("e2e, prioritaire");
  await reportForm.getByLabel("Sentiment").selectOption("1");
  await reportForm.getByLabel("Résumé").fill(summary);
  await reportForm.getByRole("button", { name: /^enregistrer$/i }).click();

  await expect(page).toHaveURL(/\/field-reports(?:\?|$)/);
  const reportCard = page.locator("article").filter({ hasText: topic }).first();
  await expect(reportCard).toContainText(topic, { timeout: 15000 });
  await expect(reportCard).toContainText(summary);
  await expect(reportCard).toContainText(`Fiche liée : ${citizenName}`);
  await reportCard.getByRole("button", { name: /créer une tâche depuis ce retour/i }).click();

  await expect(page).toHaveURL(/\/field-reports(?:\?|$)/);
  await expect(reportCard).toContainText(/tâche liée : traiter :/i);

  await page.goto("/tasks");
  await expect(page.getByText(`Traiter : ${topic}`)).toBeVisible();
});
