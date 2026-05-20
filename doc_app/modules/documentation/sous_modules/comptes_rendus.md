# 🧩 Sous-module Documentation — Comptes rendus

## 🧠 Objectif

Le sous-module **Comptes rendus** centralise les **procès-verbaux et traces écrites des réunions** (externes ou internes).

Il sert à :

- conserver la mémoire des débats du Conseil Municipal (PV exhaustifs)
- stocker les compte-rendus de réunions de quartier, réunions d'associations ou comités directeurs
- garder une trace des engagements oraux

---

## ❓ Question clé

👉 Qu'a-t-il été dit exactement lors de cette réunion ?

---

## 🧩 Rôle dans le module Documentation

- C'est l'outil de la parole libérée. Là où la délibération donne "l'acte juridique", le compte-rendu donne "le contexte et le débat".

Alimente :

- **Agenda** : S'attache directement aux entités `Réunion` passées.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le maire a-t-il justifié publiquement sa position lors du dernier conseil ?
2. Quelles étaient les doléances remontées lors de l'assemblée générale de l'amicale laïque ?

---

## 🧱 Structure recommandée

### Typologie

- **PV Officiels** : Rédigés par la mairie.
- **CR Internes** : Notes de synthèses rédigées par l'équipe de campagne assistant à un événement public.

---

## 🧠 Données attendues

- `document_type = 'compte_rendu'`
- Lien avec un identifiant de table `meetings` (module Agenda).

---

## 🏁 Conclusion

Le sous-module **Comptes rendus** est :

👉 la mémoire contextuelle des décisions et des polémiques
