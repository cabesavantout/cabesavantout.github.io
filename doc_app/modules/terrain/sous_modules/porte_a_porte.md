# 🧩 Sous-module Terrain — Porte-à-porte

## 🧠 Objectif

Le sous-module **Porte-à-porte** permet de structurer, suivre et analyser les actions de terrain les plus directes.

Il sert à :

- organiser les tournées
- suivre la couverture du territoire
- mesurer l’activité
- relier les actions aux retours terrain

👉 afin de piloter efficacement le **contact direct avec les habitants**.

---

## ❓ Question clé

👉 Où est-on allé, combien de personnes ont été rencontrées, et quels résultats ?

---

## 🧩 Rôle dans le module Terrain

- Structuration des actions terrain
- Complément opérationnel des retours terrain
- Base de mesure d’activité

Alimente :

- **Dashboard** (activité)
- **Campagne** (zones couvertes / non couvertes)
- **Territoire** (cartographie des actions)

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quelles zones ont été couvertes ?
2. Combien de contacts ont été réalisés ?
3. Quels sujets sont remontés ?
4. Où faut-il retourner ?

---

### 🥇 Priorité Produit

- **Essentiel** : Saisir le statut d'une porte (Ouvert/Absent/Refus) en 1 seconde pour mesurer le taux de pénétration.
- **Secondaire** : La prise de notes détaillée. Le militant marche, il n'a pas le temps de taper un roman.

## 🧱 Structure recommandée

### 1. Vue liste

#### Objectif

Lister les actions de porte-à-porte.

#### Contenu

- date
- zone
- nombre de contacts
- durée
- résumé

---

### 2. Vue fiche tournée

#### Objectif

Détailler une action.

#### Blocs

##### A. En-tête

- date
- zone
- participants

##### B. Résultats

- nombre de portes
- nombre de contacts
- nombre d'absents (suivi de passage : "Absent / À repasser")
- taux de réponse

##### C. Retours

- synthèse
- liens vers retours terrain

##### D. Analyse

- qualité des échanges
- points clés

##### E. Suivi

- actions à faire
- zones à revoir (focus sur les "À repasser")

---

## 🧠 Données attendues

- date
- statut de passage par adresse/porte (ouvert, absent, refus)
- zone
- participants
- nombre de contacts
- retours associés

### 🧱 Règles de structuration

- **Statuts stricts (ENUM)** : `door_status` doit être limité à `absent`, `refused`, `contacted` pour garantir des agrégations propres.
- **Horodatage fin** : Un `timestamp` exact par porte frappée pour permettre de calculer la métrique "Portes / Heure" et identifier les meilleurs rythmes.

---

## 🔄 Interactions

| Module          | Interaction          |
| --------------- | -------------------- |
| Retours terrain | données qualitatives |
| Territoire      | zones                |
| Campagne        | priorités            |
| Dashboard       | activité             |

---

## 🧠 UX attendue

- simple
- rapide
- orientée saisie terrain

### 🎨 Recommandations UI & Interactions

- **Mobile-first extrême** : Interface conçue pour être utilisée à une main (zones de clic en bas de l'écran), en extérieur (contraste très élevé pour le soleil).
- **Grosses Hitboxes** : 3 gros boutons centraux pour les statuts (🟢 Ouvert / ⚪ Absent / 🔴 Refus).
- **Feedback haptique & visuel** : Une petite vibration du téléphone et une animation rapide au clic pour rassurer le bénévole (il n'a pas besoin de vérifier que le clic est passé).
- **Swipe actions** : Permettre de swiper pour passer au numéro de rue suivant.
- **Optimistic UI** : L'interface doit passer instantanément à la porte suivante au clic, même si la requête réseau est lente ou en attente. La mise à jour se fait en arrière-plan.

---

## ⚙️ Contraintes techniques

- mobile-first
- **Approche "Offline-First" (Service Workers / IndexedDB)** : Téléchargement de la feuille de route avant de partir pour permettre la saisie dans les halls d'immeubles sans réseau, avec synchronisation automatique au retour de la connexion.
- lien avec retours
- **Fallback GPS** : Ne pas bloquer la saisie si le GPS du mobile met du temps à fixer la position.

---

## 🚫 Pièges à éviter

- complexifier la saisie
- surcharger les données

---

## 📏 Critères de réussite

- saisir une tournée rapidement
- mesurer l’activité

---

## 🚀 Roadmap

### Phase 1

- saisie simple

### Phase 2

- analyse

---

## 🏁 Conclusion

Le sous-module Porte-à-porte doit devenir :

👉 le pilotage des actions terrain
👉 le lien entre stratégie et contact réel

C’est un **outil opérationnel clé**.
