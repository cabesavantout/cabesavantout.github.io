import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/contacts/actions", () => ({
  createContact: vi.fn(),
  deleteContact: vi.fn(),
  updateContact: vi.fn(),
}));

import { ContactsPage } from "@/components/contacts-page";

describe("ContactsPage", () => {
  it("affiche une liste compacte orientée activation et ouvre le détail", () => {
    render(
      <ContactsPage
        canManageContacts
        contacts={[
          {
            id: "c1",
            fullName: "Claire Martin",
            contactKind: "journalist",
            organization: "L'Indépendant",
            roleLabel: "Journaliste",
            email: "claire@example.com",
            phone: "06 00 00 00 00",
            location: "Perpignan",
            tags: ["presse", "locale"],
            notes: "Suit les municipales.",
            createdByName: "Superadmin",
            updatedAtLabel: "2026-03-25 10:00",
          },
        ]}
        filters={{ q: "Claire", contactKind: "journalist" }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
    expect(screen.getByText("Liste des contacts")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/rechercher un nom, un organisme/i)).toHaveValue("Claire");
    expect(screen.getByText("Claire Martin")).toBeInTheDocument();
    expect(screen.getByText(/journaliste .* l'indépendant/i)).toBeInTheDocument();
    expect(screen.getByText("Contact clé")).toBeInTheDocument();
    expect(screen.getByText("Relais presse")).toBeInTheDocument();
    expect(screen.getByText(/#presse #locale/i)).toBeInTheDocument();
    expect(screen.getByText("Ajouter")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Appeler" })).toHaveAttribute("href", "tel:06 00 00 00 00");
    expect(screen.getByRole("link", { name: "Envoyer email" })).toHaveAttribute("href", "mailto:claire@example.com");

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));

    expect(screen.getByRole("heading", { name: "Claire Martin" })).toBeInTheDocument();
    expect(screen.getAllByText("Suit les municipales.").length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue("Claire Martin")).toBeInTheDocument();
  });

  it("masque l'ajout et affiche l'état vide sans droit d'édition", () => {
    render(
      <ContactsPage
        canManageContacts={false}
        contacts={[]}
        filters={{ q: "", contactKind: "" }}
      />,
    );

    expect(screen.queryByText("Ajouter")).not.toBeInTheDocument();
    expect(screen.getByText(/aucun relais ne correspond à ce filtre/i)).toBeInTheDocument();
  });
});
