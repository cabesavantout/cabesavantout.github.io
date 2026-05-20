# 📁 Module Documentation

## 🧠 Objectif

Le module Documentation est le **coffre-fort de preuves** de la campagne.

Il permet de :

- centraliser tous les documents utiles (délibérations, presse, budgets, tracts)
- fournir une base irréfutable pour valider ou contredire une Promesse (module Mandat)
- retrouver instantanément une source lors de la rédaction d'un argumentaire
- s'affranchir de la dispersion des fichiers sur Google Drive ou WhatsApp

👉 afin de bâtir une campagne sur des **faits sourcés et vérifiables**.

---

## ❓ Question clé

👉 Quelles preuves et sources avons-nous pour justifier nos positions ?

---

## 🧩 Rôle dans l’application

- C'est la source de vérité juridique, financière et médiatique.
- C'est un service de "stockage" transversal appelé par presque tous les autres modules.

Le module Documentation **n’est pas** :

- un simple disque dur "fourre-tout" sans nommage strict
- un espace de brouillons (ça, c'est l'ordinateur de chaque militant)

👉 Il **transforme un fichier PDF brut en munition politique**.

---

## 🧱 Structure conceptuelle du module

Bien que l'interface se résume souvent à un moteur de recherche global (Bibliothèque), la donnée est typée en plusieurs sous-modules logiques :

### 1. Bibliothèque

- La vue d'ensemble et le moteur de recherche (le "Drive" de l'app).

### 2. Documents municipaux

- Les productions officielles globales (PLU, Budgets, Magazines municipaux).

### 3. Délibérations

- Les actes administratifs votés en Conseil Municipal.

### 4. Comptes rendus

- Les procès-verbaux de réunions (officielles ou internes).

### 5. Presse

- La revue de presse locale (articles, coupures).

### 6. Sources externes

- Ce qui ne vient pas de la mairie (rapports d'audit, tracts de l'opposition, courriers de la Préfecture).

### 7. Archives

- Les documents obsolètes mais conservés pour l'historique (anciens mandats).

### 8. Dossiers thématiques

- Le regroupement "virtuel" de plusieurs documents autour d'un grand projet.

### 9. Pièces liées

- La mécanique permettant d'attacher un PDF à une entité métier (ex: lier un tract à une Fiche Citoyen).

---

## 🔄 Interactions avec les autres modules

| Module            | Interaction                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ |
| Mandat            | Fournit la preuve irréfutable de l'état d'une "Promesse" ou d'une "Décision"         |
| Communication     | Alimente la rédaction avec des citations exactes ou des chiffres sourcés             |
| Agenda            | Héberge les convocations ou comptes-rendus attachés à une Réunion                    |
| Recherche Globale | Les contenus des documents (si océrisés) doivent remonter dans la barre de recherche |

---

## 🧠 UX attendue

### Principes (Référence : `ui-simplification-guide.md`)

- **Unité de lieu** : Une seule page "Bibliothèque" avec des filtres par types de document (Presse, Délibération...), plutôt qu'une navigation éclatée.
- **Aperçu rapide** : Ne pas obliger l'utilisateur à télécharger un PDF pour voir ce qu'il contient (mode "Preview").
- **Contextualisation** : Toujours montrer à quoi ce document est lié (ex: "Ce document est la preuve de la promesse CAB-2026-URB-001").

---

## ⚙️ Contraintes techniques

- **Stockage** : Utilisation d'un bucket de stockage (ex: Supabase Storage ou AWS S3).
- **Indexation** : Pouvoir extraire le texte des PDF (OCR si nécessaire, ou text-extraction) pour permettre la recherche Full-Text dans le contenu des délibérations.
- **Sécurité** : Certains documents stratégiques internes ne doivent pas être lisibles par le rôle `militant`.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- Un module d'upload générique et de typage des documents (titre, date, type de fichier).
- Capacité de lier un document à un ID de `Promesse` (table `promise_updates.evidence_ref`).

### Phase 2 — Structuration experte

- Recherche plein texte et dossiers thématiques virtuels.
