# 🧩 Sous-module Agenda — Temps forts

## 🧠 Objectif

Le sous-module **Temps forts** isole les **grands jalons politiques** qui structurent la narration de la campagne.

Il sert à :

- baliser l'année avec les 4 ou 5 moments charnières (ex: Dévoilement de la tête de liste, Présentation du programme, Grand meeting de fin de campagne)
- subordonner le calendrier opérationnel à ces grandes dates

---

## ❓ Question clé

👉 Quel est le prochain grand rendez-vous qui va marquer un tournant dans notre campagne ?

---

## 🧩 Rôle dans le module Agenda

- C'est la déclinaison temporelle du module **Campagne (Plan d'actions / Phasage)**.

Alimente :

- **Communication** (Le rétro-planning de la communication s'aligne sur les Temps Forts : teasing à J-15, révélation à J0, compte-rendu à J+1).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Combien de semaines nous reste-t-il avant le dévoilement officiel du programme ?

---

## 🧱 Structure recommandée

### Représentation macroscopique

- Les temps forts s'affichent souvent sous la forme d'une **bannière** en haut des vues de calendrier (un jalon, pas un créneau horaire d'une heure).

---

## 🧠 Données attendues

- Table `events` avec `event_type = 'milestone'`.

---

## 🧠 UX attendue

### Principes

- Fort impact visuel. Un temps fort n'est pas "la réunion du mercredi", c'est le phare de la campagne.

---

## 🏁 Conclusion

C'est le **métronome narratif de la stratégie**.
