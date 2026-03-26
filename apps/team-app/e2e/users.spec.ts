import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("cree un utilisateur depuis l'administration", async ({ page }) => {
  const fullName = uniqueLabel("Utilisateur E2E");
  const email = `user.${Date.now()}@cabestany.local`;

  await loginAsE2EUser(page);
  await page.goto("/users");

  await page.locator("summary").filter({ hasText: /ajouter un utilisateur/i }).click();
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: /enregistrer le compte/i }) }).first();
  await form.getByLabel("Email").fill(email);
  await form.getByLabel("Nom complet").fill(fullName);
  await form.getByLabel("Rôle global").selectOption("lecture");
  await form.getByLabel("Mot de passe initial").fill("cabes_user_e2e");
  await form.getByRole("button", { name: /enregistrer le compte/i }).click();

  await expect(page).toHaveURL(/\/users\?success=/);
  const userCard = page.locator("article").filter({ hasText: fullName }).first();
  await expect(userCard).toBeVisible();
  await expect(userCard).toContainText(fullName);
  await expect(userCard).toContainText(email);
  await expect(userCard).toContainText(/lecture/i);
});
