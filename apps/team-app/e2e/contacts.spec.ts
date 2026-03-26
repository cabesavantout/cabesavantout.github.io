import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";

test("ouvre la page contacts en session connectée", async ({ page }) => {
  await loginAsE2EUser(page);
  await page.goto("/contacts");

  await expect(page).toHaveURL(/\/contacts$/);
  await expect(
    page.getByRole("heading", { name: /^Contacts$/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /ajouter un contact/i }),
  ).toBeVisible();
});
