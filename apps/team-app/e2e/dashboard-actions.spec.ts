import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre les actions du jour depuis le dashboard", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/dashboard");

  await page.getByRole("link", { name: /traiter les retours urgents/i }).click();
  await expect(page).toHaveURL(/\/field-reports$/);

  await page.goto("/dashboard");
  await page.getByRole("link", { name: /relancer les tâches ouvertes/i }).click();
  await expect(page).toHaveURL(/\/tasks$/);

  await page.goto("/dashboard");
  await page.getByRole("link", { name: /couvrir les secteurs vides/i }).click();
  await expect(page).toHaveURL(/\/team$/);

  await page.goto("/dashboard");
  await page.getByRole("link", { name: /préparer les prochaines réunions/i }).click();
  await expect(page).toHaveURL(/\/meetings$/);
});
