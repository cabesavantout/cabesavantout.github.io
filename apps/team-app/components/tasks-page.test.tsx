import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/tasks/actions", () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
}));

import { TasksPage } from "@/components/tasks-page";

describe("TasksPage", () => {
  it("affiche les tâches, leurs statuts et leur lien terrain", () => {
    render(
      <TasksPage
        canManageTasks
        activeUsers={[
          { id: "u1", fullName: "Claire Martin", email: "claire@example.com" },
        ]}
        tasks={[
          {
            id: "task-1",
            title: "Préparer la réunion de quartier",
            description: "Réserver la salle et confirmer l'ordre du jour.",
            status: "in_progress",
            priority: "critical",
            dueAtLabel: "26 mars 2026",
            ownerName: "Claire Martin",
            assignedTo: "u1",
            sourceFieldReportId: "fr-1",
            sourceFieldReportTopic: "Stationnement",
          },
        ]}
      />,
    );

    expect(screen.getByText("Préparer la réunion de quartier")).toBeInTheDocument();
    expect(screen.getAllByText("Critique").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("En cours").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/issu d'un retour terrain/i)).toBeInTheDocument();
    expect(screen.getByText(/stationnement/i)).toBeInTheDocument();
    expect(screen.getByText(/ajouter une tâche/i)).toBeInTheDocument();
  });

  it("affiche l'état vide quand aucune tâche n'existe", () => {
    render(<TasksPage canManageTasks={false} activeUsers={[]} tasks={[]} />);

    expect(screen.queryByText(/ajouter une tâche/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/aucune tâche enregistrée pour le moment/i),
    ).toBeInTheDocument();
  });
});
