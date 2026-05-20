# 🧩 Sous-module Agenda — Échéances (Deadlines)

## 🧠 Objectif

Le sous-module **Échéances** gère le **calendrier administratif, légal et financier inflexible**.

Il sert à :

- s'assurer qu'aucun délai légal n'est manqué (ce qui peut entraîner l'invalidation de la candidature)
- déclencher des alertes préalables (ex: J-15 avant clôture des listes électorales)
- marquer les limites de la communication (date de début de la période de réserve, date de figeage des comptes de campagne)

---

## ❓ Question clé

👉 Quelles sont les dates butoirs que nous ne pouvons absolument pas rater sous peine de disqualification ?

---

## 🧩 Rôle dans le module Agenda

- Ce sont les "lignes rouges" du calendrier global. Elles n'impliquent pas forcément une réunion, mais dictent le rythme global.

Alimente :

- **Dashboard (Alertes / Urgences)** (Une échéance qui s'approche passe automatiquement en rouge).
- **Campagne (Plan d'actions)** (Les échéances balisent les phases).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quelle est la date limite pour déposer notre liste complète en Préfecture ?
2. À partir de quand les dépenses de communication ne sont-elles plus intégrables aux comptes de campagne remboursés ?

---

## 🧱 Structure recommandée

### Échéance (Deadline)

- Titre (ex: Dépôt des candidatures).
- Date exacte et Heure limite (très important en préfecture).
- Type légal (Électoral, Financier).
- Notification d'alerte (J-30, J-7, J-1).

---

## 🧠 Données attendues

- Table `events` avec `event_type = 'deadline'` et `is_blocking = true`.

---

## 🚫 Pièges à éviter

- Noyer ces dates cruciales au milieu des dizaines de rendez-vous de marché. Elles doivent ressortir visuellement (icône d'alerte, barre de couleur vive).

---

## 🏁 Conclusion

C'est le **garde-fou juridique et administratif** de l'équipe.
