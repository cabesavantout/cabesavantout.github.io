import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("cree un contact depuis l'interface", async ({ page }) => {
  const fullName = uniqueLabel("Contact E2E");

  await loginAsE2EUser(page);
  await page.goto("/contacts");

  await page.locator("summary").filter({ hasText: /ajouter un contact/i }).click();
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: /enregistrer le contact/i }) }).first();
  await form.getByLabel("Nom complet").fill(fullName);
  await form.getByLabel("Type").selectOption("journalist");
  await form.getByLabel("Organisation").fill("Rédaction E2E");
  await form.getByLabel("Fonction").fill("Journaliste");
  await form.getByLabel("Email").fill(`contact.${Date.now()}@example.com`);
  await form.getByLabel("Téléphone").fill("0600000002");
  await form.getByLabel("Localisation").fill("Cabestany");
  await form.getByLabel("Tags").fill("e2e, presse");
  await form.getByLabel("Notes").fill("Contact créé par Playwright.");
  await form.getByRole("button", { name: /enregistrer le contact/i }).click();

  await expect(page).toHaveURL(/\/contacts\?success=/);
  const contactCard = page.locator("article").filter({ hasText: fullName }).first();
  await expect(contactCard.getByText(fullName)).toBeVisible();
  await expect(contactCard.getByText(/rédaction e2e/i).first()).toBeVisible();
});
