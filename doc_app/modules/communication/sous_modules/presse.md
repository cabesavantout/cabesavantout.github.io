# 🧩 Sous-module Communication — Presse (Relations publiques)

## 🧠 Objectif

Le sous-module **Presse** gère les **Relations Publiques (RP)** proactives de l'équipe (Media CRM).

_(Note : À ne pas confondre avec `Documentation > Presse` qui stocke les articles déjà parus)._

Il sert à :

- qualifier les journalistes locaux (PQR), correspondants, blogueurs influents
- suivre à qui les communiqués ont été envoyés
- tracer les relances téléphoniques pour obtenir une interview ou une couverture d'un événement

---

## ❓ Question clé

👉 Quel journaliste de L'Indépendant couvre notre secteur, et qui l'a relancé pour notre conférence de presse de demain ?

---

## 🧩 Rôle dans le module Communication

- C'est le CRM appliqué exclusivement à la sphère médiatique.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Avons-nous bien invité tous les correspondants de presse locale pour l'inauguration de la permanence ?

---

## 🧱 Structure recommandée

### 1. Fichier Presse (Listes de diffusion)

- Création de segments (ex: "Presse Écrite Locale", "Radio/TV régionale", "Influenceurs Web").

### 2. Suivi des Envois / Relances

- Historique d'interactions rattaché à une fiche "Contact Presse" (qui vit dans la table globale du module `Réseau`).

---

## 🔄 Interactions avec les autres modules

| Module        | Interaction                                                              |
| ------------- | ------------------------------------------------------------------------ |
| Réseau        | Utilise la table des `contacts` en la filtrant par `category = 'Presse'` |
| Communication | S'articule avec les `Communiqués` (historique de qui a reçu quoi).       |

---

## 🧠 UX attendue

### Principes

- Ce module peut être très léger s'il s'appuie sur le moteur du module `Réseau`. C'est avant tout une vue filtrée et adaptée au métier de l'Attaché de presse.
- **Orienté "Dernier contact"** : L'attaché de presse doit savoir instantanément qui n'a pas été relancé.

### 🎨 Recommandations UI & Interactions

- **Tableau CRM classique** : Vue en grille avec tri par défaut sur "Date de dernière interaction".
- **Action rapide "Loguer un appel"** : Bouton direct sur la ligne du journaliste pour consigner un échange vocal ("N'est pas intéressé", "Publie demain").

---

## ⚙️ Contraintes techniques

- **Anti-Duplication (DRY)** : Ne surtout pas recréer une table `journalists` autonome. Utiliser les vues SQL ou filtres sur la table centrale des contacts pour garantir que la mise à jour d'un numéro de téléphone par un autre membre de l'équipe se répercute bien ici.

---

## 🏁 Conclusion

C'est l'**outil d'amplification médiatique**.
