# 🧩 Sous-module Agenda — Réunions

## 🧠 Objectif

Le sous-module **Réunions** structure le **travail interne et les prises de décision** de l'équipe.

Il sert à :

- planifier les instances de travail (Comité de pilotage, cellule com', réunion militante)
- centraliser l'Ordre du Jour (ODJ) pour que chacun arrive préparé
- saisir les notes en direct
- transformer instantanément les décisions de la réunion en Tâches assignées

---

## ❓ Question clé

👉 De quoi parlons-nous à la réunion de ce soir, et quelles décisions avons-nous actées lors de la précédente ?

---

## 🧩 Rôle dans le module Agenda

- C'est le gestionnaire de productivité du module. C'est l'événement "actif" par excellence (qui produit du travail).

Alimente :

- **Dashboard (Tâches)** (Les actions décidées en réunion).
- **Documentation (Comptes-rendus)** (L'archive de la réunion clôturée).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Qui anime la réunion de quartier de demain ?
2. Avons-nous traité le sujet de l'école Prévert lors du dernier comité stratégique ?
3. Quelles sont les actions qui m'ont été assignées à l'issue de cette réunion ?

---

## 🧱 Structure recommandée

### 1. Fiche Réunion (Avant l'événement)

- **En-tête** : Titre, Date, Heure, Lieu (ou lien Visio).
- **Participants** : Invités (membres de l'équipe).
- **Ordre du Jour** : Liste à puces des sujets à traiter.

### 2. Mode "En cours" (Saisie)

- Éditeur de texte riche (Markdown) pour la prise de notes.
- Outil rapide de création de "Tâche" (Assigné à X, pour la date Y).

### 3. Fiche Réunion (Après l'événement)

- Les notes deviennent le "Compte-rendu" immuable.
- Liste des actions générées.

---

## 🧠 Données attendues

- Table `meetings` : `id`, `title`, `scheduled_at`, `status` (planned, in_progress, completed), `agenda`, `notes`.
- Table de jointure `meeting_attendees`.

---

## 🧠 UX attendue

### Principes

- Mode Focus : L'interface de prise de notes pendant la réunion doit être épurée et sans distraction.

---

## 🚫 Pièges à éviter

- Faire des réunions sans ordre du jour ni compte-rendu. L'outil doit imposer cette discipline structurelle.

---

## 🏁 Conclusion

C'est le **moteur d'avancement et d'alignement de l'équipe**.
