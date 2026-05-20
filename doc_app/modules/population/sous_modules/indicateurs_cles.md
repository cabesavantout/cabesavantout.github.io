# 🧩 Sous-module Population — Indicateurs clés

## 🧠 Objectif

Le sous-module **Indicateurs clés** sert de **dictionnaire technique et politique** des métriques INSEE disponibles.

Il sert à :

- exposer la liste exhaustive des variables normalisées présentes en base de données
- fiabiliser la donnée en expliquant son origine et son mode de calcul
- permettre à des utilisateurs "Data" d'aller chercher un indicateur très spécifique non exposé dans la Vue d'ensemble

---

## ❓ Question clé

👉 Quelle est la définition exacte de cet indicateur, d'où vient-il, et de quand date-t-il ?

---

## 🧩 Rôle dans le module Population

- C'est la salle des machines, l'annexe technique pour la transparence des données.

Alimente :

- **Administration** (audit de la qualité de la donnée).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. De quelle année date précisément ce chiffre sur la pauvreté ?
2. Quelle est la définition INSEE exacte d'une "famille monoparentale" ?

---

## 🧱 Structure recommandée

### 1. Bibliothèque d'Indicateurs

- Tableau avec recherche textuelle.
- Colonnes : Nom de l'indicateur, Thème, Valeur, Année source, Explication.

---

## 🧠 Données attendues

- Métadonnées du fichier d'import `cabestany-normalized.csv`.

---

## 🧠 UX attendue

### Principes

- Mode "Data Explorer". Une table de données simple, filtrable et exportable.

---

## 🏁 Conclusion

Le sous-module **Indicateurs clés** garantit la **rigueur scientifique et la traçabilité** des arguments politiques.
