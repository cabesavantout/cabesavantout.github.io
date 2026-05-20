# 🧩 Sous-module Administration — Qualité des données

## 🧠 Objectif

Le sous-module **Qualité des données** est un scanner automatique qui traque **l'usure et la corruption de l'information**.

Il sert à :

- identifier les doublons (ex: deux fiches créées pour le même citoyen)
- repérer les données orphelines (ex: un signalement rattaché à une rue qui a été supprimée)
- alerter sur les champs obligatoires manquants

---

## ❓ Question clé

👉 Notre base de données est-elle propre, exploitable, et sans doublons ?

---

## 🧩 Rôle dans le module Administration

- C'est l'outil de maintenance préventive (Data Cleansing).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il des contacts en double dans le CRM qui risquent de recevoir le même e-mail deux fois ?
2. Combien de "Retours terrain" ne sont classés dans aucun "Sujet" politique ?

---

## 🧱 Structure recommandée

### 1. Détection de doublons (Merge Tool)

- L'outil propose des fiches avec des noms ou téléphones très similaires.
- Action : "Fusionner ces deux contacts" (merge) en gardant l'historique des deux.

### 2. Rapports d'anomalies

- Indicateur de remplissage (ex: "25% des Citoyens Suivis n'ont aucun niveau de soutien renseigné").
- Liste des données orphelines.

---

## 🧠 UX attendue

### Principes

- Gamification : Il faut que nettoyer la base soit satisfaisant. (ex: Un grand compteur "Santé de la donnée : 95%").

### 🎨 Recommandations UI & Interactions

- **Split-Screen de Fusion (Merge Tool)** : Afficher les deux fiches en double côte à côte. Proposer des boutons radios pour choisir quelle donnée conserver ligne par ligne (ex: Garder le téléphone de la fiche A, mais l'adresse de la fiche B).
- **Résolution en 1 clic** : Pour les anomalies simples (ex: tags non utilisés), proposer un bouton "Nettoyer automatiquement".

---

## ⚙️ Contraintes techniques

- Les algorithmes de détection de doublons basés sur la distance de Levenshtein ou le Fuzzy Matching peuvent être lourds à exécuter en base. Ils doivent tourner en tâches de fond la nuit.
- **Fusion en cascade** : Lorsqu'on fusionne le Citoyen A vers le Citoyen B, il faut s'assurer que toutes les clés étrangères (retours terrain de A, tâches de A) soient bien réaffectées à B avant de supprimer A.

---

## 🏁 Conclusion

C'est le **nettoyeur quotidien** pour éviter que le CRM ne devienne une décharge.
