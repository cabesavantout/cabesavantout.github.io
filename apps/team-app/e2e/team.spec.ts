import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre la couverture terrain et affiche les priorités", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/team");

  await expect(page).toHaveURL(/\/team$/);
  await expect(page.getByRole("heading", { name: /couverture terrain/i })).toBeVisible();
  await expect(page.getByText(/priorités de couverture/i)).toBeVisible();
  await expect(page.getByText(/à affecter cette semaine/i)).toBeVisible();
  await expect(page.getByText(/secteurs/i).first()).toBeVisible();
  await expect(page.locator("article").filter({ hasText: /score/i }).first()).toBeVisible();
});
