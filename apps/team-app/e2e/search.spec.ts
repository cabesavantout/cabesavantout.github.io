import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("retrouve un citoyen, un retour terrain et une tache dans la recherche", async ({ page }) => {
  const base = uniqueLabel("Recherche E2E");
  const citizenName = `${base} Citoyen`;
  const topic = `${base} Sujet`;
  const taskTitle = `${base} Tâche`;

  await loginAsE2EUser(page);

  await page.goto("/citizens");
  await page.locator("summary").filter({ hasText: /ajouter une fiche/i }).click();
  const citizenForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /enregistrer la fiche/i }) })
    .first();
  await citizenForm.getByLabel("Nom complet").fill(citizenName);
  await citizenForm.getByLabel("Quartier").fill("Centre");
  await citizenForm.getByRole("button", { name: /enregistrer la fiche/i }).click();
  await expect(page).toHaveURL(/\/citizens(?:\?|$)/);

  await page.goto("/field-reports");
  await page.locator("summary").filter({ hasText: /ajouter un retour/i }).click();
  const reportForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /^enregistrer$/i }) })
    .first();
  await reportForm.getByLabel("Sujet").fill(topic);
  await reportForm.getByLabel("Source").selectOption("terrain");
  await reportForm.getByLabel("Résumé").fill(`Résumé ${base}`);
  await reportForm.getByRole("button", { name: /^enregistrer$/i }).click();
  await expect(page).toHaveURL(/\/field-reports(?:\?|$)/);

  await page.goto("/tasks");
  await page.locator("summary").filter({ hasText: /ajouter une tâche/i }).click();
  const taskForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /^enregistrer$/i }) })
    .first();
  await taskForm.getByLabel("Titre").fill(taskTitle);
  await taskForm.getByLabel("Description").fill(`Suivi ${base}`);
  await taskForm.getByRole("button", { name: /^enregistrer$/i }).click();
  await expect(page).toHaveURL(/\/tasks\?success=/);

  await page.goto(`/search?q=${encodeURIComponent(base)}`);
  const panels = page.locator("section");
  await expect(panels.filter({ hasText: "Citoyens" }).first()).toContainText(citizenName);
  await expect(panels.filter({ hasText: "Retours terrain" }).first()).toContainText(topic);
  await expect(panels.filter({ hasText: "Tâches" }).first()).toContainText(taskTitle);
});
