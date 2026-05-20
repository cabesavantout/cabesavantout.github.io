# 🧩 Sous-module Terrain — Tractage & Boîtage

## 🧠 Objectif

Le sous-module **Tractage & Boîtage** gère les actions de diffusion de masse (documents imprimés).

Il sert à :

- comptabiliser le nombre de tracts distribués de la main à la main (marchés, gares)
- tracer l'avancement de la distribution dans les boîtes aux lettres (boîtage)
- ajuster les volumes d'impression nécessaires

---

## ❓ Question clé

👉 Combien de tracts avons-nous écoulé ce week-end, et a-t-on boîté tout le secteur Nord ?

---

## 🧩 Rôle dans le module Terrain

- C'est la métrique de couverture "matérielle" (contrairement au porte-à-porte qui est relationnel).

Alimente :

- **Dashboard** (Jauges de distribution).
- **Territoire** (Coloration des rues "Boîtées").

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Faut-il recommander 5000 tracts pour le week-end prochain ?
2. Quelle rue a déjà reçu le document "Spécial Bilan" ?

---

## 🧱 Structure recommandée

### 1. Fiche Action (Tractage / Boîtage)

- Type d'action (Tractage main à main vs Boîtage).
- Document distribué (Lien vers `Communication > Publications`).
- Volume écoulé (ex: "800 exemplaires distribués").
- Zone ou Lieu concerné.
- Responsable de l'action.

---

## 🧠 UX attendue

### Principes

- Saisie "Post-action" très rapide. Le militant rentre chez lui et indique juste "J'ai boîté la rue X, 150 tracts".

---

## 🚫 Pièges à éviter

- Demander trop de détails sur le boîtage. C'est une action de volume, on ne qualifie pas l'opinion des boîtes aux lettres.

---

## 🏁 Conclusion

C'est le **suivi logistique de l'imprimé**.
