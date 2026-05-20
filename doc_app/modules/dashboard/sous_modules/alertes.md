# 🧩 Sous-module Dashboard — Alertes (Signaux faibles)

## 🧠 Objectif

Le sous-module **Alertes** permet au système d'**avertir proactivement l'utilisateur** d'un glissement ou d'une anomalie détectée dans les données.

Il sert à :

- repérer ce qu'un humain n'aurait pas vu en lisant une table de données classique
- notifier de dérives silencieuses (budget, calendrier)

---

## ❓ Question clé

👉 Est-ce qu'une donnée a franchi un seuil de risque sans qu'on s'en aperçoive ?

---

## 🧩 Rôle dans le module Dashboard

- C'est l'intelligence de l'application. Contrairement aux "Urgences" (qui sont statuées par un humain), les "Alertes" sont générées par la base de données.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le rythme de nos dépenses budgétaires de campagne s'accélère-t-il dangereusement ?
2. Le quartier Sud a-t-il été ignoré pendant plus de 2 mois (Historique terrain) ?
3. Y a-t-il une explosion anormale des plaintes sur le thème "Sécurité" depuis 3 jours ?

---

## 🧱 Structure recommandée

### 1. Notifications système

- Bandes d'alerte (Banners) ou petites pastilles.
- Message expliquant la détection : "⚠️ Alerte : La couverture du secteur Centre-Ville a baissé de 40% cette semaine."
- Un bouton d'action contextuelle ou "Ignorer".

---

## 🧠 Données attendues

- Table `system_alerts` alimentée par une logique métier (tâches cron ou triggers) qui compare une valeur actuelle à un seuil prédéfini.

---

## ⚙️ Contraintes techniques

- **Calcul Asynchrone** : La détection des anomalies ne doit pas se faire au chargement du Dashboard. Des _Background Jobs_ nocturnes vérifient les seuils et créent l'alerte en base pour un affichage instantané.
- **Auto-nettoyage** : Si le seuil redescend à la normale le lendemain, l'alerte doit s'auto-clôturer sans intervention humaine.

---

## 🧠 UX attendue

### Principes

- **Dismissible** : Pouvoir cliquer sur "J'ai compris" ou "Masquer" pour faire disparaître l'alerte de l'écran (Soft Delete).
- N'apparaît que si l'alerte existe (ne pas laisser une boîte vide "Pas d'alertes").

---

## 🚫 Pièges à éviter

- Créer trop d'alertes génère de la "fatigue d'alerte" : l'utilisateur finira par tout ignorer. Ne conserver que les franchissements de seuils majeurs.

---

## 🏁 Conclusion

C'est le **radar de bord proactif**.
