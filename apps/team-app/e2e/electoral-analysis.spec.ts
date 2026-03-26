import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre l'analyse électorale et affiche les synthèses", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/electoral-analysis");

  await expect(page).toHaveURL(/\/electoral-analysis$/);
  await expect(page.getByRole("heading", { name: /analyse électorale/i })).toBeVisible();
  await expect(page.getByText(/score cumulé des candidats/i)).toBeVisible();
  await expect(page.getByText(/lecture bureau par bureau/i)).toBeVisible();
  await expect(page.getByText(/croisement terrain et bureaux/i)).toBeVisible();
  await expect(page.locator("article").filter({ hasText: /bureau/i }).first()).toBeVisible();
});
