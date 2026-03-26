import {
  createContact,
  deleteContact,
  updateContact,
} from "@/app/(app)/contacts/actions";
import { Badge, PageHeader, Panel } from "@/components/ui";
import type { ContactListItem } from "@/lib/postgres";

const contactKindLabels: Record<string, string> = {
  member: "Adhérent",
  journalist: "Journaliste",
  partner: "Partenaire",
  institution: "Institution",
  supplier: "Prestataire",
  volunteer: "Bénévole",
  donor: "Donateur",
  other: "Autre",
};

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
  return (
    <div>
      <PageHeader
        eyebrow="Réseau"
        title="Contacts"
        description="Carnet de contacts transverse pour les adhérents, journalistes, partenaires, institutions et autres relais utiles à la campagne."
      />

      <Panel
        title="Recherche et filtres"
        subtitle="Filtrer rapidement le carnet par nom ou type de contact."
      >
        <form className="grid gap-3 lg:grid-cols-[1.9fr_minmax(0,1fr)_auto]">
          <input
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            name="q"
            type="search"
            placeholder="Rechercher un nom, organisme, mail, téléphone, tag..."
            defaultValue={filters.q}
          />
          <select
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
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
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
              type="submit"
            >
              Filtrer
            </button>
            <a
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand"
              href="/contacts"
            >
              Réinitialiser
            </a>
          </div>
        </form>
      </Panel>

      {success ? (
        <div className="mb-6 mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {canManageContacts ? (
        <details className="mb-6 mt-8 group sm:mt-10">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[30px] border border-accent/20 bg-[linear-gradient(135deg,rgba(168,57,39,0.1),rgba(255,255,255,0.86))] px-5 py-5 shadow-panel transition hover:border-accent/35 sm:px-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
                Action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                Ajouter un contact
              </h3>
              <p className="mt-2 text-sm text-ink/68">
                Ouvrir le formulaire pour enregistrer un adhérent, un journaliste, un partenaire ou un relais.
              </p>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-3xl leading-none text-white shadow-sm transition group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="mt-4">
            <Panel
              title="Nouveau contact"
              subtitle="Ajouter un contact à suivre, sans le mélanger avec le CRM citoyens."
            >
              <form action={createContact} className="space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Nom complet</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="fullName"
                      type="text"
                      placeholder="Ex. Claire Martin"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Type</span>
                    <select
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="contactKind"
                      defaultValue="other"
                    >
                      {Object.entries(contactKindLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Organisation</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="organization"
                      type="text"
                      placeholder="Média, association, entreprise, parti..."
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Fonction</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="roleLabel"
                      type="text"
                      placeholder="Journaliste, trésorier, responsable local..."
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Email</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="email"
                      type="email"
                      placeholder="contact@example.com"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Téléphone</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="phone"
                      type="text"
                      placeholder="06 00 00 00 00"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Localisation</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                      name="location"
                      type="text"
                      placeholder="Cabestany, Perpignan, rédaction locale..."
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Tags</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="tags"
                    type="text"
                    placeholder="presse locale, culture, commerces"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Notes</span>
                  <textarea
                    className="min-h-[120px] w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                    name="notes"
                    placeholder="Contexte de relation, attente, niveau de confiance, historique utile"
                  />
                </label>

                <div className="flex justify-end">
                  <button
                    className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                    type="submit"
                  >
                    Enregistrer le contact
                  </button>
                </div>
              </form>
            </Panel>
          </div>
        </details>
      ) : null}

      <div className="space-y-6">
        <Panel
          title="Carnet de contacts"
          subtitle="Répertoire transversal pour suivre les relations utiles à la campagne."
        >
          <div className="space-y-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <article
                  key={contact.id}
                  className="rounded-3xl border border-line/80 bg-white/70 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="neutral">
                          {contactKindLabels[contact.contactKind] ?? contact.contactKind}
                        </Badge>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-ink">
                        {contact.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-ink/68">
                        {[contact.roleLabel, contact.organization].filter(Boolean).join(" · ") || "Sans précision"}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-ink/45">
                      Mis à jour {contact.updatedAtLabel}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-ink/72 sm:grid-cols-2">
                    <p><span className="font-medium text-ink">Email :</span> {contact.email ?? "Non renseigné"}</p>
                    <p><span className="font-medium text-ink">Téléphone :</span> {contact.phone ?? "Non renseigné"}</p>
                    <p><span className="font-medium text-ink">Localisation :</span> {contact.location ?? "Non renseignée"}</p>
                    <p><span className="font-medium text-ink">Créé par :</span> {contact.createdByName ?? "Non renseigné"}</p>
                  </div>

                  {contact.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {contact.tags.map((tag) => (
                        <Badge key={`${contact.id}-${tag}`} tone="neutral">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  {contact.notes ? (
                    <p className="mt-4 text-sm leading-6 text-ink/72">{contact.notes}</p>
                  ) : null}

                  {canManageContacts ? (
                    <details className="mt-5 rounded-2xl border border-line/70 bg-sand/70 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-ink">
                        Modifier ce contact
                      </summary>
                      <form action={updateContact} className="mt-4 space-y-4 text-sm">
                        <input name="contactId" type="hidden" value={contact.id} />

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block font-medium">Nom complet</span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="fullName"
                              type="text"
                              defaultValue={contact.fullName}
                              required
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block font-medium">Type</span>
                            <select
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
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
                          <label className="block">
                            <span className="mb-2 block font-medium">Organisation</span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="organization"
                              type="text"
                              defaultValue={contact.organization ?? ""}
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block font-medium">Fonction</span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="roleLabel"
                              type="text"
                              defaultValue={contact.roleLabel ?? ""}
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block font-medium">Email</span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="email"
                              type="email"
                              defaultValue={contact.email ?? ""}
                            />
                          </label>
                          <label className="block">
                            <span className="mb-2 block font-medium">Téléphone</span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="phone"
                              type="text"
                              defaultValue={contact.phone ?? ""}
                            />
                          </label>
                        </div>

                        <div className="grid gap-4">
                          <label className="block">
                            <span className="mb-2 block font-medium">Localisation</span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="location"
                              type="text"
                              defaultValue={contact.location ?? ""}
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-2 block font-medium">Tags</span>
                          <input
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                            name="tags"
                            type="text"
                            defaultValue={contact.tags.join(", ")}
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block font-medium">Notes</span>
                          <textarea
                            className="min-h-[100px] w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                            name="notes"
                            defaultValue={contact.notes ?? ""}
                          />
                        </label>

                        <div className="flex flex-wrap justify-end gap-3">
                          <button
                            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                            type="submit"
                            formAction={deleteContact}
                          >
                            Supprimer
                          </button>
                          <button
                            className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                            type="submit"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </form>
                    </details>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-line/70 bg-sand/70 p-6 text-sm text-ink/65">
                Aucun contact ne correspond aux filtres actuels.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
