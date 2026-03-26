import { expect, test } from "@playwright/test";
import { loginAsE2EUser } from "./helpers";
import { uniqueLabel } from "./fixtures";

test("cree une reunion puis ajoute une note et une action", async ({ page }) => {
  const title = uniqueLabel("Réunion E2E");
  const note = uniqueLabel("Note E2E");
  const action = uniqueLabel("Action E2E");

  await loginAsE2EUser(page);
  await page.goto("/meetings");

  await page.locator("summary").filter({ hasText: /ajouter une réunion/i }).click();
  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /^enregistrer$/i }) })
    .first();
  await createForm.getByLabel("Titre").fill(title);
  await createForm.getByLabel("Lieu").fill("Cabestany");
  await createForm.getByLabel("Description").fill("Réunion de coordination E2E");
  await createForm.getByLabel("Début").fill("2026-04-01T18:30");
  await createForm.getByRole("button", { name: /^enregistrer$/i }).click();

  await expect(page).toHaveURL(/\/meetings\?success=/);

  const meetingPanel = page.locator("section").filter({ hasText: title }).first();
  await expect(meetingPanel).toContainText(title);

  const noteForm = meetingPanel
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /ajouter la note/i }) })
    .first();
  await noteForm.locator("textarea").fill(note);
  await noteForm.getByRole("button", { name: /ajouter la note/i }).click();

  await expect(page).toHaveURL(/\/meetings\?success=/);
  await expect(meetingPanel).toContainText(note);

  const actionForm = meetingPanel
    .locator("form")
    .filter({ has: page.getByRole("button", { name: /ajouter l'action/i }) })
    .first();
  await actionForm.getByPlaceholder("Action à lancer").fill(action);
  await actionForm.getByRole("button", { name: /ajouter l'action/i }).click();

  await expect(page).toHaveURL(/\/meetings\?success=/);
  await expect(meetingPanel).toContainText(action);
  await expect(meetingPanel).toContainText(/ouverte/i);
});
