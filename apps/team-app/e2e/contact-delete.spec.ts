import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("supprime un contact existant", async ({ page }) => {
  const fullName = uniqueLabel("Contact delete E2E");

  await loginAsE2EUser(page);
  await page.goto("/contacts");

  await page.locator("summary").filter({ hasText: /ajouter un contact/i }).click();
  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /enregistrer le contact/i }) })
    .first();
  await createForm.getByLabel("Nom complet").fill(fullName);
  await createForm.getByLabel("Type").selectOption("other");
  await createForm.getByRole("button", { name: /enregistrer le contact/i }).click();

  await expect(page).toHaveURL(/\/contacts\?success=/);

  const card = page.locator("article").filter({ hasText: fullName }).first();
  const details = card.locator("details").first();
  await details.locator("summary").filter({ hasText: /modifier ce contact/i }).click();
  await expect(details).toHaveAttribute("open", "");
  const updateForm = details.locator("form").first();
  await updateForm.getByRole("button", { name: /supprimer/i }).click();

  await expect(page).toHaveURL(/\/contacts\?success=/);
  await expect(page.locator("article").filter({ hasText: fullName })).toHaveCount(0);
});
