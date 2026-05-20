# 🧩 Sous-module Documentation — Bibliothèque

## 🧠 Objectif

Le sous-module **Bibliothèque** est la **porte d'entrée unifiée** vers tous les documents de la campagne.

Il sert à :

- rechercher un fichier à travers tout le coffre-fort
- filtrer par type (délibération, presse, budget) ou par thématique
- offrir une vue "explorateur de fichiers" rassurante pour l'équipe

---

## ❓ Question clé

👉 Où est ce PDF dont on a parlé hier sur la rénovation de l'école ?

---

## 🧩 Rôle dans le module Documentation

- C'est l'interface utilisateur (UI) principale du module.
- Tous les autres sous-modules (Presse, Délibérations, etc.) ne sont que des **métadonnées de filtrage** exposées dans cette Bibliothèque.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quels sont les 5 derniers documents ajoutés à la plateforme ?
2. Comment retrouver toutes les coupures de presse datant de 2024 ?

---

## 🧱 Structure recommandée

### 1. Moteur de recherche et Filtres

- Barre de recherche plein texte.
- Filtres rapides (Pills) : "Délibérations", "Presse", "Sources externes".

### 2. Liste des documents (Tableau)

- Colonnes : Nom du document, Type, Date du document (pas d'upload), Thème, Actions (Aperçu, Télécharger).

---

## 🧠 Données attendues

- Table `documents` : `id`, `file_name`, `storage_path`, `document_type`, `document_date`, `extracted_text` (pour la recherche).

---

## 🧠 UX attendue

### Principes

- Copier les standards de l'industrie (Google Drive, Notion).
- Mettre en évidence la date politique du document (ex: "Conseil municipal du 12 juin") plutôt que la date technique d'upload ("Uploadé aujourd'hui à 14h").

---

## 🏁 Conclusion

C'est le **moteur de recherche documentaire** de l'équipe.
