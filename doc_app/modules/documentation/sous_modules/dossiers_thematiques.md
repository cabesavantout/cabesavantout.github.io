# 🧩 Sous-module Documentation — Dossiers thématiques

## 🧠 Objectif

Le sous-module **Dossiers thématiques** permet de **regrouper transversalement** des documents de natures différentes (presse, budget, délibération) autour d'un même grand projet.

Il sert à :

- constituer des "dossiers à charge" ou "dossiers projets" (ex: "Le projet de ZAC Nord", "L'insécurité au Centre-Ville")
- centraliser tout ce qui touche à une polémique précise
- faciliter l'accès à l'information pour l'équipe de rédaction

---

## ❓ Question clé

👉 J'écris un tract sur le projet de la nouvelle école, où puis-je trouver tous les documents (presse, budgets, plans) qui s'y rapportent ?

---

## 🧩 Rôle dans le module Documentation

- C'est l'outil de "Curation" et de classement intelligent (similaire aux Tags ou aux Folders).

Alimente :

- **Mandat (Sujets)** : Un dossier thématique est souvent le pendant documentaire d'un "Sujet" politique.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Peux-tu m'extraire tout le dossier sur l'école Prévert (promesse initiale, budget voté, surcoûts actés en délibération, articles de presse sur le retard) ?

---

## 🧱 Structure recommandée

### 1. Le Dossier "Virtuel"

- Un document n'est pas "physiquement" dans un seul dossier.
- Utilisation de Tags (ex: `#EcolePrevert`) pour lier un document à un sujet.

---

## 🧠 Données attendues

- Table de jointure `document_tags` liant l'id du document à un Tag ou à un `Subject` (module Mandat).

---

## 🧠 UX attendue

### Principes

- Éviter l'approche "Dossier Windows" rigide (où un document ne vit que dans un dossier). Privilégier une approche par "Étiquettes".

---

## 🏁 Conclusion

C'est le **classeur intelligent des dossiers de campagne**.
