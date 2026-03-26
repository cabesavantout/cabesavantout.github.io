import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("met a jour un contact existant", async ({ page }) => {
  const fullName = uniqueLabel("Contact update E2E");
  const updatedLocation = "Perpignan";
  const updatedNotes = "Contact mis à jour par Playwright.";

  await loginAsE2EUser(page);
  await page.goto("/contacts");

  await page.locator("summary").filter({ hasText: /ajouter un contact/i }).click();
  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /enregistrer le contact/i }) })
    .first();
  await createForm.getByLabel("Nom complet").fill(fullName);
  await createForm.getByLabel("Type").selectOption("partner");
  await createForm.getByLabel("Organisation").fill("Association E2E");
  await createForm.getByRole("button", { name: /enregistrer le contact/i }).click();

  await expect(page).toHaveURL(/\/contacts\?success=/);

  const card = page.locator("article").filter({ hasText: fullName }).first();
  const details = card.locator("details").first();
  await details.locator("summary").filter({ hasText: /modifier ce contact/i }).click();
  await expect(details).toHaveAttribute("open", "");
  const updateForm = details.locator("form").first();
  await updateForm.getByLabel("Localisation").fill(updatedLocation);
  await updateForm.getByLabel("Notes").fill(updatedNotes);
  await updateForm.getByRole("button", { name: /^enregistrer$/i }).click();

  await expect(page).toHaveURL(/\/contacts\?success=/);
  const updatedCard = page.locator("article").filter({ hasText: fullName }).first();
  const updatedDetails = updatedCard.locator("details").first();
  await updatedDetails.locator("summary").filter({ hasText: /modifier ce contact/i }).click();
  const updatedForm = updatedDetails.locator("form").first();
  await expect(updatedForm.getByLabel("Localisation")).toHaveValue(updatedLocation);
  await expect(updatedForm.getByLabel("Notes")).toHaveValue(updatedNotes);
});
