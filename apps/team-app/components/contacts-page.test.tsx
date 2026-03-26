import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/contacts/actions", () => ({
  createContact: vi.fn(),
  deleteContact: vi.fn(),
  updateContact: vi.fn(),
}));

import { ContactsPage } from "@/components/contacts-page";

describe("ContactsPage", () => {
  it("affiche les filtres et les contacts existants", () => {
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
            updatedAtLabel: "25 mars 2026",
          },
        ]}
        filters={{ q: "Claire", contactKind: "journalist" }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /^Contacts$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/rechercher un nom, organisme/i),
    ).toHaveValue("Claire");
    expect(screen.getByText("Claire Martin")).toBeInTheDocument();
    expect(screen.getAllByText("Journaliste").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/presse/i)).toBeInTheDocument();
    expect(screen.getByText(/l'indépendant/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Ajouter un contact$/i }),
    ).toBeInTheDocument();
  });

  it("masque l'ajout et affiche l'état vide sans droit d'édition", () => {
    render(
      <ContactsPage
        canManageContacts={false}
        contacts={[]}
        filters={{ q: "", contactKind: "" }}
      />,
    );

    expect(screen.queryByText(/ajouter un contact/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/aucun contact ne correspond aux filtres actuels/i),
    ).toBeInTheDocument();
  });
});
