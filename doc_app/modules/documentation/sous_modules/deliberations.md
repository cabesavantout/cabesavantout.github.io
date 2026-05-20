# 🧩 Sous-module Documentation — Délibérations

## 🧠 Objectif

Le sous-module **Délibérations** est l'archive des **actes juridiques et votes officiels** du Conseil Municipal.

Il sert à :

- retrouver le texte exact d'une décision votée (ex: octroi d'une subvention, vente d'un terrain)
- vérifier qui a voté "Pour" ou "Contre" (si le document le mentionne)
- lier une preuve juridique incontestable à une action de la majorité

---

## ❓ Question clé

👉 Quelle est la trace juridique de cette décision, et quand a-t-elle été votée ?

---

## 🧩 Rôle dans le module Documentation

- C'est le niveau le plus granulaire, factuel et opposable de la preuve.

Alimente :

- **Mandat (Décisions)** : Une entité `Décision` dans l'application doit toujours être sourcée par un fichier PDF `Délibération`.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quel était le montant exact de la subvention votée pour cette association l'année dernière ?
2. Quelle est la date de l'arrêté ou de la délibération autorisant les travaux de la voirie ?

---

## 🧱 Structure recommandée

### 1. Nommage strict

- Pour être utile, une délibération doit avoir une métadonnée normalisée : `Date du Conseil` + `Numéro d'affaire`. (Ex: "2025-12-08_Affaire-04").

---

## 🧠 Données attendues

- `document_type = 'deliberation'`
- `official_date` (Date du vote)
- `reference_number` (Numéro de la délibération)

---

## 🧠 UX attendue

### Principes

- C'est souvent de la donnée massive (il peut y avoir des dizaines de délibérations par conseil).
- L'outil doit idéalement permettre l'extraction automatique des titres des délibérations à partir du Sommaire du Conseil Municipal.

---

## 🚫 Pièges à éviter

- Créer une fiche manuelle par délibération sans en avoir besoin. Il vaut mieux uploader le PDF du Conseil complet et le rendre cherchable par mots-clés.

---

## 🏁 Conclusion

C'est le **juge de paix factuel** de l'action municipale.
