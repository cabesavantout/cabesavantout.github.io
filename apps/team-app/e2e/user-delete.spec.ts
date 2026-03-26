import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("supprime un utilisateur cree depuis l'administration", async ({ page }) => {
  const fullName = uniqueLabel("Utilisateur delete E2E");
  const email = `delete.${Date.now()}@cabestany.local`;

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
  await createForm.getByLabel("Mot de passe initial").fill("cabes_user_delete_e2e");
  await createForm.getByRole("button", { name: /enregistrer le compte/i }).click();

  await expect(page).toHaveURL(/\/users\?success=/);

  const userCard = page.locator("article").filter({ hasText: fullName }).first();
  await expect(userCard).toBeVisible();
  await userCard.getByRole("button", { name: /supprimer le compte/i }).click();

  await expect(page).toHaveURL(/\/users\?success=/);
  await expect(page.locator("article").filter({ hasText: fullName })).toHaveCount(0);
});
