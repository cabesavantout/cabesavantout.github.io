# 🧩 Sous-module Dashboard — À faire aujourd'hui

## 🧠 Objectif

Le sous-module **À faire aujourd'hui** transforme le dashboard en un **véritable outil de productivité quotidienne** pour l'utilisateur connecté.

Il sert à :

- organiser la journée de travail (militant, coordinateur ou direction)
- s'assurer que les réunions et tâches ne sont pas oubliées

---

## ❓ Question clé

👉 Que dois-je faire, moi, aujourd'hui ?

---

## 🧩 Rôle dans le module Dashboard

- C'est la vue personnalisée issue du module **Agenda** et du sous-module **Actions (Terrain)**.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Ai-je des tâches personnelles dont l'échéance est aujourd'hui (ou dépassée) ?
2. À quelles réunions suis-je attendu dans les prochaines heures ?

---

## 🧱 Structure recommandée

### 1. Ma journée

- **Événements / Réunions** : Ce qui est à l'agenda pour la date du jour.
- **Mes tâches** : Liste à cocher (Checklist) des tâches assignées à l'utilisateur connecté avec un statut non terminé.
  - Indicateur "En retard" si l'échéance était hier.

---

## 🧠 Données attendues

- Tâches filtrées par `assignee_id = current_user_id` et `status != 'done'`.
- Événements filtrés sur `date = today`.

---

## 🧠 UX attendue

### Principes

- Fortement interactif : l'utilisateur doit pouvoir cocher/terminer une tâche directement depuis le dashboard sans avoir à changer d'écran.
- Doit avoir un **Empty State motivant** (ex: "Vous n'avez rien de prévu aujourd'hui. Explorez le terrain !").

### 🎨 Recommandations UI & Interactions

- **Feedback visuel (Dopamine)** : Lorsqu'on coche une tâche, jouer une petite animation fluide (barrement du texte + disparition en fondu) pour valoriser l'action.
- **Action "Reporter à demain"** : Permettre d'un clic (ou via un swipe sur mobile) de décaler une tâche à faire au lendemain sans avoir à l'éditer manuellement.
- **Chronologie visuelle** : Les événements du jour s'affichent sous forme de timeline verticale simple (ex: 10h - Marché, 14h - Réunion).

---

## 🏁 Conclusion

C'est la **feuille de route personnelle**.
