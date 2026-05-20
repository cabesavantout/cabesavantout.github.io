# 🧩 Sous-module Documentation — Presse

## 🧠 Objectif

Le sous-module **Presse** est la **revue de presse numérisée** de la campagne.

Il sert à :

- stocker les articles de la presse locale (ex: _L'Indépendant_) concernant la ville, la majorité ou l'équipe de campagne
- tracer l'évolution du récit médiatique
- conserver une preuve des annonces du maire faites dans les médias

---

## ❓ Question clé

👉 Qu'a dit la presse sur ce sujet, et quelles déclarations le maire a-t-il faites aux journalistes ?

---

## 🧩 Rôle dans le module Documentation

- C'est l'œil médiatique. Les promesses électorales sont souvent formulées dans la presse avant d'arriver au conseil municipal.

Alimente :

- **Mandat (Promesses)** : Un article de presse est souvent la source originelle d'une nouvelle promesse à suivre.
- **Communication** : Réutiliser une citation presse pour un post sur les réseaux.

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Le journal local a-t-il couvert notre dernière action de terrain ?
2. Quelle citation exacte l'adjoint a-t-il donné à la presse sur la hausse des impôts l'an dernier ?

---

## 🧱 Structure recommandée

### Métadonnées Presse

- Titre de l'article.
- Journal / Média (Source).
- Date de parution.
- Tonalité (Positive pour nous / Négative / Neutre).

---

## 🧠 Données attendues

- `document_type = 'presse'`
- Un champ `source_name` (ex: "L'Indépendant").

---

## 🚫 Pièges à éviter

- Ajouter juste un lien URL. Les articles de PQR (Presse Quotidienne Régionale) passent souvent en archive payante. Il faut stocker une capture d'écran, un PDF ou le texte intégral.

---

## 🏁 Conclusion

C'est le **baromètre de l'opinion médiatique**.
