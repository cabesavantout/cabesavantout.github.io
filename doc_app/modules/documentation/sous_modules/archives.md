# 🧩 Sous-module Documentation — Archives

## 🧠 Objectif

Le sous-module **Archives** permet de **sortir de l'affichage principal les documents obsolètes** sans les perdre.

Il sert à :

- stocker les programmes électoraux des anciens mandats (ex: tract de 2014, programme de 2020)
- désencombrer le moteur de recherche courant pour que les résultats restent pertinents pour la campagne en cours
- garder la mémoire de la vie politique locale sur le très long terme

---

## ❓ Question clé

👉 Que promettait le maire il y a 10 ans, et qu'est-ce qui n'est toujours pas fait ?

---

## 🧩 Rôle dans le module Documentation

- C'est la "chambre froide" de la donnée.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Comment était formulée cette promesse lors de la campagne précédente ?
2. Le maire avait-il déjà utilisé cet argument il y a 6 ans ?

---

## 🧱 Structure recommandée

- Les documents n'ont pas besoin de changer de type. Ils prennent simplement un flag `is_archived = true`.
- Un filtre global dans la Bibliothèque : "Inclure les archives". (Désactivé par défaut).

---

## 🧠 UX attendue

### Principes

- Transparence. L'archive ne doit pas polluer la recherche rapide quotidienne d'un militant.

---

## 🏁 Conclusion

Le sous-module **Archives** est :

👉 la machine à remonter le temps politique de la commune
