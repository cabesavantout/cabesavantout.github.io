import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre les bureaux de vote et affiche les blocs clés", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/polling-stations");

  await expect(page).toHaveURL(/\/polling-stations$/);
  await expect(page.getByRole("heading", { name: /bureaux de vote/i })).toBeVisible();
  await expect(page.getByText(/carte des bureaux/i)).toBeVisible();
  await expect(page.getByText(/bureaux validés 2026 t1/i)).toBeVisible();
  await expect(page.locator("article").filter({ hasText: /bureau/i }).first()).toBeVisible();
});
