import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("affiche les blocs utiles du dashboard", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /tableau de bord général/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /actions du jour/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /priorités immédiates/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /secteurs à surveiller/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /réunions à venir/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /activité récente/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^équipe$/i })).toBeVisible();
});
