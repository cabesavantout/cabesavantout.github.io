import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre le budget et affiche les blocs principaux", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/budget");

  await expect(page).toHaveURL(/\/budget$/);
  await expect(page.getByRole("heading", { name: /^budget$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /documents suivis/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /plus grosses lignes/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /sections repérées/i })).toBeVisible();
  await expect(page.getByText(/rob-2026/i).first()).toBeVisible();
});
