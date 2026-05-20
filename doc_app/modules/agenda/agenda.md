# 📅 Module Agenda

## 🧠 Objectif

Le module Agenda est le **maître du temps** de la campagne.

Il permet de :

- centraliser toutes les échéances (réunions internes, événements publics, dates légales)
- coordonner la présence de l'équipe sur le terrain
- s'assurer que les préparatifs d'un événement (ex: Conseil Municipal) sont faits à temps
- tracer l'historique des rencontres pour le module Réseau

👉 afin de passer d'une campagne réactive à une **campagne d'anticipation**.

---

## ❓ Question clé

👉 Qu’est-ce qui se passe, quand, où, et qui doit y être ?

---

## 🧩 Rôle dans l’application

- C'est l'ordonnanceur temporel de l'OS de campagne.
- Il connecte le "Quoi" (la Stratégie) au "Quand" (l'Exécution).

Le module Agenda **n’est pas** :

- un simple clone de Google Calendar déconnecté du reste
- un gestionnaire de tâches (les Tâches ont des échéances, mais ne sont pas des événements d'Agenda)

👉 Il **contextualise les événements avec les données politiques de la base**.

---

## 🧱 Structure conceptuelle du module

L'UI se matérialisera par un calendrier unifié, mais la base de données distingue plusieurs concepts :

### 1. Calendrier global

- La vue consolidée (mois / semaine / jour) avec filtres de couleurs.

### 2. Réunions

- Le travail interne (comités de pilotage, réunions de quartier). Intègre l'ordre du jour et la saisie de notes.

### 3. Événements

- La présence publique (fêtes d'associations, marchés, inaugurations).

### 4. Conseils municipaux

- Le rythme institutionnel (nécessite une phase de préparation des dossiers et engendre des délibérations).

### 5. Échéances

- Les dates butoirs (dépôt de liste en préfecture, clôture des comptes de campagne, fin des inscriptions sur listes électorales).

### 6. Actions planifiées

- Les tournées terrain (ex: "Tractage au marché samedi 10h"). Connecté au module Terrain.

### 7. Temps forts

- Les jalons macroscopiques (ex: "Lancement officiel de la campagne"). Connecté au module Campagne (Plan d'actions).

### 8. Historique

- L'audit de ce qui s'est passé (qui était présent, quel compte-rendu a été fait).

---

## 🔄 Interactions avec les autres modules

| Module        | Interaction                                                        |
| ------------- | ------------------------------------------------------------------ |
| Dashboard     | Affiche les événements de la journée en cours                      |
| Réseau        | Permet d'inviter des contacts ciblés à une réunion ou un événement |
| Terrain       | Héberge temporellement les "Actions planifiées" (Tractage, PàP)    |
| Documentation | Stocke les "Comptes-rendus" liés aux réunions passées              |

---

## 🧠 UX attendue

### Principes (Référence : `ui-simplification-guide.md`)

- **Unification** : Une seule vue principale (Calendrier) où chaque type d'événement a une couleur distincte et un filtre (pills).
- **Orienté préparation** : Cliquer sur un événement futur ne montre pas juste l'heure, mais les actions à préparer et les documents liés.
- **Orienté clôture** : Cliquer sur un événement passé demande le compte-rendu ou les notes.

---

## ⚙️ Contraintes techniques

- **Synchronisation (Optionnelle mais attendue à terme)** : Export iCal / ICS pour que les militants puissent voir les événements sur l'agenda de leur smartphone personnel (Apple Calendar / Google Calendar).
- **Moteur de Notifications (Push / Email)** : Envoi d'alertes internes ("X vous a assigné une tâche") et de récapitulatifs par e-mail (CR de réunions, objectifs de la semaine) pour engager l'équipe.
- **Gestion des fuseaux horaires** : Toujours stocker en UTC en base, afficher en locale.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- Un CRUD générique d'événements typés (Réunions, Événements publics).
- Affichage sous forme de liste chronologique et widget Dashboard.

### Phase 2 — Connexion métier

- Prise de notes intégrée (Réunions) générant des Tâches automatiquement.

---

## 🏁 Conclusion

C'est le **métronome logistique de la campagne**.
