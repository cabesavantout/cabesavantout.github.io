import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("met a jour une fiche citoyen existante", async ({ page }) => {
  const fullName = uniqueLabel("Citoyen update E2E");
  const updatedNeighborhood = "Les Arcades";
  const updatedNotes = "Fiche mise à jour par Playwright.";

  await loginAsE2EUser(page);
  await page.goto("/citizens");

  await page.locator("summary").filter({ hasText: /ajouter une fiche/i }).click();
  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /enregistrer la fiche/i }) })
    .first();
  await createForm.getByLabel("Nom complet").fill(fullName);
  await createForm.getByLabel("Niveau de soutien").selectOption("neutral");
  await createForm.getByRole("button", { name: /enregistrer la fiche/i }).click();

  await expect(page).toHaveURL(/\/citizens\?success=/);

  const card = page.locator("article").filter({ hasText: fullName }).first();
  const updateForm = card.locator("form").last();
  await updateForm.getByLabel("Quartier").fill(updatedNeighborhood);
  await updateForm.getByLabel("Notes").fill(updatedNotes);
  await updateForm.getByLabel("Niveau de soutien").selectOption("supportive");
  await updateForm.getByRole("button", { name: /mettre à jour/i }).click();

  await expect(page).toHaveURL(/\/citizens\?success=/);
  const updatedCard = page.locator("article").filter({ hasText: fullName }).first();
  const refreshedForm = updatedCard.locator("form").last();
  await expect(refreshedForm.getByLabel("Quartier")).toHaveValue(updatedNeighborhood);
  await expect(refreshedForm.getByLabel("Notes")).toHaveValue(updatedNotes);
  await expect(refreshedForm.getByLabel("Niveau de soutien")).toHaveValue("supportive");
});
