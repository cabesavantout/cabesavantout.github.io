# 🧩 Sous-module Agenda — Conseils municipaux

## 🧠 Objectif

Le sous-module **Conseils municipaux** isole les séances de l'instance démocratique majeure de la ville.

Il sert à :

- anticiper les dates des prochains conseils (obligation de parution de l'ordre du jour 5 jours francs avant)
- structurer la préparation des débats (si l'équipe a des élus d'opposition)
- organiser la présence dans le public ou le suivi du live vidéo (pour l'équipe de campagne)

---

## ❓ Question clé

👉 Quand est le prochain conseil, et sommes-nous prêts à décortiquer les dossiers qui y seront votés ?

---

## 🧩 Rôle dans le module Agenda

- Événement "Lourd" qui génère de la donnée politique de référence.

Alimente :

- **Documentation (Délibérations)** (Une fois le conseil passé, les délibérations votées rejoignent la doc).
- **Mandat (Décisions)** (Les votes du conseil deviennent des décisions effectives).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Sur quoi le maire va-t-il faire voter la ville jeudi prochain ?
2. Quelle question piquante pouvons-nous préparer (ou diffuser à la presse) sur le dossier N°4 de l'ordre du jour ?

---

## 🧱 Structure recommandée

### Fiche Conseil Municipal

- Date de la séance.
- **Documents préparatoires** : Upload des "Notes de synthèse" reçues par les élus.
- **Ordre du jour annoté** : Chaque point de l'ordre du jour peut être discuté en interne en amont (ex: Point 1: Vote du Budget -> Position de l'équipe : Contre + Argumentaire).
- **Post-Conseil** : Lien vers la vidéo de la séance (YouTube) ou le Procès Verbal.

---

## 🧠 Données attendues

- Table `events` typée `council_meeting`.
- Relations lourdes vers le module `Documentation` (pièces jointes).

---

## 🧠 UX attendue

- Outil de travail collaboratif : les membres de la direction de campagne doivent pouvoir annoter ensemble l'ordre du jour avant la séance.

---

## 🏁 Conclusion

C'est le **centre névralgique du rapport de force institutionnel**.
