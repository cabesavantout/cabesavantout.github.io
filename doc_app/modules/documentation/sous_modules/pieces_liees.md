# 🧩 Sous-module Documentation — Pièces liées

## 🧠 Objectif

Le sous-module **Pièces liées** est la **mécanique technique centrale** de l'application qui connecte la preuve documentaire à l'objet métier.

Il sert à :

- attacher un PDF justifiant qu'une Promesse est "En retard" ou "Réalisée"
- joindre un document de travail à une Fiche Réunion (ordre du jour)
- lier une image/photo d'un problème sur la voirie à un Signalement Terrain

---

## ❓ Question clé

👉 Sur quoi se base cette affirmation politique dans l'application ? Sur cette pièce liée.

---

## 🧩 Rôle dans le module Documentation

- C'est le point de connexion de la Documentation avec tous les autres modules de l'OS de campagne.
- Sans ce sous-module, la Documentation est un silo mort.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Je lis que la promesse "Baisse des impôts" est classée comme "Contredite", quelle est la preuve ? (Le document de la délibération fiscale qui y est attaché).
2. Quelles sont les notes manuscrites scannées de la dernière réunion avec le collectif des commerçants ?

---

## 🧱 Structure recommandée

### 1. Composant "Fichiers joints"

- Présent dans l'interface de toutes les entités majeures (Promesses, Tâches, Citoyens, Réunions).
- Permet "d'Uploader un nouveau fichier" ou de "Sélectionner depuis la Bibliothèque".

---

## 🧠 Données attendues

- Une table relationnelle polymorphique `entity_documents` :
  - `document_id`
  - `entity_type` (ex: 'promise', 'meeting', 'citizen', 'field_report')
  - `entity_id`

---

## 🧠 UX attendue

### Principes

- Fluide. Le drag & drop d'un document directement dans la vue d'une promesse doit automatiquement uploader le fichier dans la Bibliothèque et créer la liaison.

---

## 🏁 Conclusion

Le sous-module **Pièces liées** est **le tissu conjonctif qui rend la donnée politique opposable**.
