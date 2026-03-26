import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("cree une tache puis met a jour son statut", async ({ page }) => {
  const title = uniqueLabel("Tâche E2E");

  await loginAsE2EUser(page);
  await page.goto("/tasks");

  await page.locator("summary").filter({ hasText: /ajouter une tâche/i }).click();
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: /^enregistrer$/i }) }).first();
  await form.getByLabel("Titre").fill(title);
  await form.getByLabel("Description").fill("Tâche de test Playwright.");
  await form.getByLabel("Priorité").selectOption("high");
  await form.getByRole("button", { name: /^enregistrer$/i }).click();

  await expect(page).toHaveURL(/\/tasks\?success=/);

  const taskRow = page.locator("tr").filter({ hasText: title }).first();
  await expect(taskRow.getByText(title)).toBeVisible();
  await taskRow.locator("select").nth(1).selectOption("done");
  await taskRow.getByRole("button", { name: /mettre à jour/i }).click();

  await expect(page).toHaveURL(/\/tasks\?success=/);
  await expect(taskRow.getByText(/terminée/i)).toBeVisible();
});
