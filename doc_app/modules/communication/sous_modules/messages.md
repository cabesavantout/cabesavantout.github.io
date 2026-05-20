# 🧩 Sous-module Communication — Messages (Copywriting)

## 🧠 Objectif

Le sous-module **Messages** gère la couche **rédactionnelle et créative** de la campagne.

Il sert à :

- décliner les grands axes de `Campagne > Messages clés` en textes directement utilisables (slogans, punchlines, titres de tracts)
- tester différentes formulations (A/B testing textuel)
- fournir une bibliothèque de "briques de texte" pour l'équipe

---

## ❓ Question clé

👉 Comment formule-t-on cette idée de manière percutante pour qu'elle marque les esprits ?

---

## 🧩 Rôle dans le module Communication

- C'est le laboratoire de la formule choc.

Alimente :

- **Publications / Réseaux sociaux** : On pioche un message ici pour le coller dans un post.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Quel est notre slogan officiel pour la thématique de la sécurité ?
2. Quelles sont les 3 phrases d'accroche validées pour la page d'accueil du site web ?

---

## 🧱 Structure recommandée

### 1. Bibliothèque de Formules

- Variante Courte (Slogan, < 5 mots).
- Variante Moyenne (Accroche, < 15 mots).
- Call-to-action associé (ex: "Rejoignez-nous pour protéger notre cadre de vie").

---

## 🧠 Données attendues

- Entité `Content` avec `type = 'message_court'`.
- Champs additionnels : `length_category` (slogan, accroche), `call_to_action`, `theme_id`.

---

## 🧠 UX attendue

### Principes

- Copier-coller facile : Chaque message doit avoir un bouton "Copier" évident.
- **Recherche fulgurante** : Trouver une formule choc en 2 secondes.

### 🎨 Recommandations UI & Interactions

- **Affichage en Tuiles / Cartes** : Mettre en valeur la typographie du message.
- **Bouton "Copy to clipboard"** : Action primaire sur chaque carte avec feedback visuel (Copié ! ✅).
- **Tags visuels** : Badges pour repérer la thématique (ex: 🔴 Sécurité, 🟢 Écologie).

---

## ⚙️ Contraintes techniques

- **Performance** : Intégrer une recherche "Full-text" réactive côté client si la liste reste courte (moins de 500 messages) pour éviter les allers-retours serveur.

---

## 🚫 Pièges à éviter

- Confondre avec la stratégie. Ici, on ne débat pas du _fond_ (doit-on parler de la dette ?), on débat de la _forme_ (comment en parler ?).

---

## 🏁 Conclusion

C'est le **catalogue de formules prêtes à l'emploi**.
