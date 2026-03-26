import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { E2E_USER } from "./test-credentials";

test("redirige la racine vers la page de connexion", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: /connexion equipe/i }),
  ).toBeVisible();
});

test("affiche le formulaire local sur la page de connexion", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText(/authentification locale active/i)).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /se connecter en local/i }),
  ).toBeVisible();
});

test("refuse un login invalide", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("inconnu@cabestany.local");
  await page.getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
  await page.getByRole("button", { name: /se connecter en local/i }).click();

  await expect(page).toHaveURL(/\/login\?error=/);
  await expect(page.getByText(/identifiants invalides/i)).toBeVisible();
});

test("accepte un login valide et ouvre le dashboard", async ({ page }) => {
  await loginAsE2EUser(page);

  await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
  await expect(page.getByText(E2E_USER.email)).toBeVisible();
  await expect(page.getByText(/retours ouverts/i).first()).toBeVisible();
});
