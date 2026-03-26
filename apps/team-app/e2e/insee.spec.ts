import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre les repères INSEE et affiche les blocs clés", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/insee");

  await expect(page).toHaveURL(/\/insee$/);
  await expect(page.getByRole("heading", { name: /repères insee/i })).toBeVisible();
  await expect(page.getByText(/structure par âge/i)).toBeVisible();
  await expect(page.getByText(/repères rapides/i)).toBeVisible();
  await expect(page.getByText(/habitat et ménages/i)).toBeVisible();
  await expect(page.locator("section").filter({ hasText: /structure par âge/i }).first()).toBeVisible();
});
