import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { E2E_USER } from "./test-credentials";

export async function loginAsE2EUser(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(E2E_USER.email);
  await page.getByLabel("Mot de passe").fill(E2E_USER.password);
  await page.getByRole("button", { name: /se connecter en local/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
