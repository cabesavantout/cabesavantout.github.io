# 🧩 Sous-module Documentation — Documents municipaux

## 🧠 Objectif

Le sous-module **Documents municipaux** catégorise les **productions macroscopiques officielles** de la mairie.

Il sert à :

- stocker les documents de référence lourds (Budgets primitifs, Comptes Administratifs, Plan Local d'Urbanisme - PLU)
- archiver la communication sortante du maire (Magazines municipaux, bilans de mandat)
- disposer du matériel de base pour opposer au maire ses propres déclarations

---

## ❓ Question clé

👉 Que dit officiellement la mairie sur ce sujet dans son magazine ou son budget ?

---

## 🧩 Rôle dans le module Documentation

- Il isole les documents "Institutionnels" des documents purement administratifs (comme les délibérations unitaires).

Alimente :

- **Population** (sources démographiques ou urbanistiques).
- **Campagne** (analyse des mots-clés utilisés par la majorité dans le magazine local).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Où est le PDF complet du Budget Primitif 2025 pour vérifier un chiffre ?
2. Dans quel numéro du magazine "Cabes'Info" le maire a-t-il promis de ne pas augmenter les impôts ?

---

## 🧱 Structure recommandée

### 1. Typologie des Documents municipaux

- Finances (ROB, BP, CA, CFU).
- Urbanisme (PLU, PADD, ZAC).
- Communication (Magazines, Newsletters).

---

## 🧠 Données attendues

- Un simple `document_type = 'municipal'` dans la table `documents`, enrichi d'un champ `category` (Finances, Urbanisme, Info).

---

## 🏁 Conclusion

Le sous-module **Documents municipaux** est :

👉 l'outil d'audit de la "voix officielle" de la mairie
