"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createContact, deleteContact, updateContact } from "@/app/(app)/contacts/actions";
import { Badge, Button, EmptyState, Notice, PageHeader, Panel } from "@/components/ui";
import type { ContactListItem } from "@/lib/postgres";

const contactKindLabels: Record<string, string> = {
  member: "Équipe",
  journalist: "Journaliste",
  partner: "Partenaire",
  institution: "Institution",
  supplier: "Prestataire",
  volunteer: "Bénévole",
  donor: "Donateur",
  other: "Autre",
};

type ContactFilter = "all" | "journalist" | "institution" | "partner" | "volunteer" | "member";

function getKindTone(kind: string) {
  if (kind === "journalist") return "accent" as const;
  if (kind === "institution") return "warning" as const;
  if (kind === "partner" || kind === "volunteer" || kind === "member") return "pine" as const;
  return "neutral" as const;
}

function parseUpdatedAt(value: string) {
  const parsed = Date.parse(value.replace(" ", "T"));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isRecent(contact: ContactListItem) {
  const updatedAt = parseUpdatedAt(contact.updatedAtLabel);
  if (!updatedAt) return false;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - updatedAt <= sevenDays;
}

function isPriorityContact(contact: ContactListItem) {
  if (contact.contactKind === "journalist" || contact.contactKind === "institution") return true;
  return contact.tags.some((tag) =>
    ["prioritaire", "presse", "cle", "clé", "urgent", "actif"].includes(tag.toLowerCase()),
  );
}

function shouldFollowUp(contact: ContactListItem) {
  if (contact.tags.some((tag) => ["relance", "a relancer", "à relancer"].includes(tag.toLowerCase()))) {
    return true;
  }

  if (!contact.phone && !contact.email) return false;
  return !isRecent(contact);
}

function getUtilityLabel(contact: ContactListItem) {
  if (contact.contactKind === "journalist") return "Relais presse";
  if (contact.contactKind === "institution") return "Relation officielle";
  if (contact.contactKind === "partner") return "Partenaire actif";
  if (contact.contactKind === "volunteer" || contact.contactKind === "member") return "Mobilisation";
  return "Relais à qualifier";
}

function getPrimaryChannel(contact: ContactListItem) {
  if (contact.phone) return contact.phone;
  if (contact.email) return contact.email;
  return "Coordonnée manquante";
}

function matchesFilter(contact: ContactListItem, filter: ContactFilter) {
  if (filter === "all") return true;
  return contact.contactKind === filter;
}

function getContactRank(contact: ContactListItem) {
  if (isPriorityContact(contact)) return 1;
  if (isRecent(contact)) return 2;
  if (shouldFollowUp(contact)) return 3;
  return 4;
}

function ContactRow({
  contact,
  canManageContacts,
  onOpen,
}: {
  contact: ContactListItem;
  canManageContacts: boolean;
  onOpen: (contact: ContactListItem) => void;
}) {
  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{contact.fullName}</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            {[contact.roleLabel, contact.organization].filter(Boolean).join(" · ") || "Rôle non renseigné"}
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone={getKindTone(contact.contactKind)}>
              {contactKindLabels[contact.contactKind] ?? contact.contactKind}
            </Badge>
            {isPriorityContact(contact) ? <Badge tone="warning">Contact clé</Badge> : null}
            {shouldFollowUp(contact) ? <Badge tone="accent">À relancer</Badge> : null}
            {isRecent(contact) ? <Badge tone="pine">Récent</Badge> : null}
          </div>
          <p className="mt-2 text-sm text-muted">{getUtilityLabel(contact)}</p>
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-6 text-muted">{getPrimaryChannel(contact)}</p>
          <p className="mt-1 text-sm text-muted">
            {contact.location ?? "Localisation non renseignée"} · Mis à jour {contact.updatedAtLabel}
          </p>
          {contact.tags.length > 0 ? (
            <p className="mt-1 text-sm text-muted">{contact.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
          {contact.phone ? (
            <Link
              href={`tel:${contact.phone}`}
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Appeler
            </Link>
          ) : null}
          {contact.email ? (
            <Link
              href={`mailto:${contact.email}`}
              className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
            >
              Envoyer email
            </Link>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => onOpen(contact)}>
            Ouvrir
          </Button>
          {canManageContacts ? (
            <Button type="button" variant="secondary" onClick={() => onOpen(contact)}>
              Modifier
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ContactDrawer({
  canManageContacts,
  contact,
  onClose,
}: {
  canManageContacts: boolean;
  contact: ContactListItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fermer le détail"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-3xl overflow-y-auto border-l border-line bg-base shadow-panel">
        <div className="sticky top-0 z-10 border-b border-line bg-base/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone={getKindTone(contact.contactKind)}>
                  {contactKindLabels[contact.contactKind] ?? contact.contactKind}
                </Badge>
                {isPriorityContact(contact) ? <Badge tone="warning">Contact clé</Badge> : null}
                {shouldFollowUp(contact) ? <Badge tone="accent">À relancer</Badge> : null}
              </div>
              <h2 className="section-title mt-3 text-[1.35rem] font-semibold text-ink">{contact.fullName}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                {[contact.roleLabel, contact.organization].filter(Boolean).join(" · ") || "Rôle non renseigné"}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">
          <Panel title="Coordonnées" subtitle="Les canaux utiles pour agir immédiatement.">
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>{contact.phone ?? "Téléphone non renseigné"}</p>
              <p>{contact.email ?? "Email non renseigné"}</p>
              <p>{contact.location ?? "Localisation non renseignée"}</p>
              <p>{getUtilityLabel(contact)}</p>
            </div>
          </Panel>

          <Panel title="Contexte" subtitle="Notes et balises réseau.">
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>{contact.notes || "Aucune note de contexte."}</p>
              {contact.tags.length > 0 ? (
                <p>{contact.tags.map((tag) => `#${tag}`).join(" ")}</p>
              ) : (
                <p>Aucun tag.</p>
              )}
            </div>
          </Panel>

          {canManageContacts ? (
            <Panel title="Modifier" subtitle="Édition complète hors de la liste principale.">
              <form action={updateContact} className="grid gap-4">
                <input type="hidden" name="contactId" value={contact.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Nom complet</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="fullName"
                      type="text"
                      defaultValue={contact.fullName}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Type</span>
                    <select
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="contactKind"
                      defaultValue={contact.contactKind}
                    >
                      {Object.entries(contactKindLabels).map(([value, label]) => (
                        <option key={`${contact.id}-${value}`} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Organisation</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="organization"
                      type="text"
                      defaultValue={contact.organization ?? ""}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Rôle</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="roleLabel"
                      type="text"
                      defaultValue={contact.roleLabel ?? ""}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Email</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="email"
                      type="email"
                      defaultValue={contact.email ?? ""}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Téléphone</span>
                    <input
                      className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                      name="phone"
                      type="text"
                      defaultValue={contact.phone ?? ""}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Localisation</span>
                  <input
                    className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="location"
                    type="text"
                    defaultValue={contact.location ?? ""}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Tags</span>
                  <input
                    className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="tags"
                    type="text"
                    defaultValue={contact.tags.join(", ")}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Notes</span>
                  <textarea
                    className="min-h-[7rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
                    name="notes"
                    defaultValue={contact.notes ?? ""}
                  />
                </label>
                <div className="flex flex-wrap justify-between gap-3">
                  <button
                    className="rounded-2xl border border-danger/20 bg-danger/[0.08] px-4 py-2.5 text-sm font-medium text-danger"
                    type="submit"
                    formAction={deleteContact}
                  >
                    Supprimer
                  </button>
                  <Button type="submit">Mettre à jour</Button>
                </div>
              </form>
            </Panel>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export function ContactsPage({
  canManageContacts,
  contacts,
  error,
  filters,
  success,
}: {
  canManageContacts: boolean;
  contacts: ContactListItem[];
  error?: string;
  filters: {
    q: string;
    contactKind: string;
  };
  success?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<ContactFilter>("all");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const sortedContacts = useMemo(
    () =>
      [...contacts].sort((left, right) => {
        const rankDiff = getContactRank(left) - getContactRank(right);
        if (rankDiff !== 0) return rankDiff;
        return left.fullName.localeCompare(right.fullName, "fr");
      }),
    [contacts],
  );

  const visibleContacts = useMemo(
    () => sortedContacts.filter((contact) => matchesFilter(contact, activeFilter)),
    [sortedContacts, activeFilter],
  );

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Relations"
        title="Contacts"
        description="Le carnet des relais utiles à activer rapidement."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Panel
        title="Liste des contacts"
        subtitle="Une vue compacte pour savoir qui activer, relancer ou mobiliser."
        actions={
          canManageContacts ? (
            <details className="group">
              <summary className="inline-flex min-h-[2.5rem] cursor-pointer list-none items-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92">
                Ajouter
              </summary>
              <div className="mt-3 w-[min(92vw,46rem)] rounded-[1.25rem] border border-line bg-panel p-4 shadow-panel">
                <form action={createContact} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Nom complet</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="fullName" type="text" required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Type</span>
                      <select className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="contactKind" defaultValue="other">
                        {Object.entries(contactKindLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Organisation</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="organization" type="text" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Rôle</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="roleLabel" type="text" />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Email</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="email" type="email" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Téléphone</span>
                      <input className="min-h-[2.75rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="phone" type="text" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Notes</span>
                    <textarea className="min-h-[7rem] w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent" name="notes" />
                  </label>
                  <div className="flex justify-end">
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </div>
            </details>
          ) : undefined
        }
      >
        <form className="mb-4 grid gap-3 lg:grid-cols-[1.5fr_minmax(0,1fr)_auto]">
          <input
            className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="q"
            type="search"
            placeholder="Rechercher un nom, un organisme, un mail ou un tag"
            defaultValue={filters.q}
          />
          <select
            className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="contactKind"
            defaultValue={filters.contactKind}
          >
            <option value="">Tous les types</option>
            {Object.entries(contactKindLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <button className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white" type="submit">
              Rechercher
            </button>
            <a className="rounded-2xl border border-line bg-panel px-4 py-3 text-sm font-medium text-ink" href="/contacts">
              Réinitialiser
            </a>
          </div>
        </form>

        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { key: "all" as const, label: "Tous" },
            { key: "journalist" as const, label: "Journalistes" },
            { key: "institution" as const, label: "Institutions" },
            { key: "partner" as const, label: "Partenaires" },
            { key: "volunteer" as const, label: "Bénévoles" },
            { key: "member" as const, label: "Équipe" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveFilter(item.key)}
              className={
                activeFilter === item.key
                  ? "inline-flex min-h-[2.5rem] items-center rounded-full border border-ink bg-ink px-3.5 text-sm font-medium text-white transition"
                  : "inline-flex min-h-[2.5rem] items-center rounded-full border border-line bg-panel px-3.5 text-sm font-medium text-muted transition hover:bg-elevated hover:text-ink"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {visibleContacts.length > 0 ? (
          <div className="space-y-3">
            {visibleContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                canManageContacts={canManageContacts}
                contact={contact}
                onOpen={(item) => setSelectedContactId(item.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun contact"
            description="Aucun relais ne correspond à ce filtre pour le moment."
          />
        )}
      </Panel>

      {selectedContact ? (
        <ContactDrawer
          canManageContacts={canManageContacts}
          contact={selectedContact}
          onClose={() => setSelectedContactId(null)}
        />
      ) : null}
    </div>
  );
}
