import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("met a jour le role d'un utilisateur", async ({ page }) => {
  const fullName = uniqueLabel("Utilisateur access E2E");
  const email = `access.${Date.now()}@cabestany.local`;

  await loginAsE2EUser(page);
  await page.goto("/users");

  await page.locator("summary").filter({ hasText: /ajouter un utilisateur/i }).click();
  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /enregistrer le compte/i }) })
    .first();
  await createForm.getByLabel("Email").fill(email);
  await createForm.getByLabel("Nom complet").fill(fullName);
  await createForm.getByLabel("Rôle global").selectOption("lecture");
  await createForm.getByLabel("Mot de passe initial").fill("cabes_user_access_e2e");
  await createForm.getByRole("button", { name: /enregistrer le compte/i }).click();

  await expect(page).toHaveURL(/\/users\?success=/);

  const userCard = page.locator("article").filter({ hasText: fullName }).first();
  await expect(userCard).toBeVisible();
  const accessForm = userCard.locator("form").first();
  await accessForm.locator('select[name="role"]').selectOption("admin");
  await accessForm.getByRole("button", { name: /mettre à jour/i }).click();

  await expect(page).toHaveURL(/\/users\?success=/);
  const updatedCard = page.locator("article").filter({ hasText: fullName }).first();
  await expect(updatedCard).toContainText(/admin/i);
});
