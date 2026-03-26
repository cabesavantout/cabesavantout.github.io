import { expect, test } from "@playwright/test";

test("redirige /dashboard vers /login quand la session est absente", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: /connexion equipe/i }),
  ).toBeVisible();
});
