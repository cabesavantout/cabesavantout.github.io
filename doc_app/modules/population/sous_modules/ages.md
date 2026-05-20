# 🧩 Sous-module Population — Âges

## 🧠 Objectif

Le sous-module **Âges** analyse la répartition intergénérationnelle de la ville.

Il sert à :

- visualiser la pyramide des âges
- mesurer l'indice de vieillissement
- anticiper les besoins en services publics (crèches, écoles vs CCAS, maintien à domicile)

---

## ❓ Question clé

👉 La ville vieillit-elle trop vite, et quelle génération dicte les priorités de l'action municipale ?

---

## 🧩 Rôle dans le module Population

- Analyse du cycle de vie des habitants.

Alimente :

- **Campagne** (calibrage des propositions : un programme focalisé sur la jeunesse dans une ville à 45% de retraités est un suicide électoral).
- **Réseau** (identification des publics cibles pour les réunions).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Faut-il investir dans un EHPAD ou dans un Skate-Park ?
2. Quelle est la proportion d'électeurs potentiellement inactifs ?
3. Y a-t-il un "trou" générationnel (fuite des 20-30 ans) ?

---

## 🧱 Structure recommandée

### 1. La Pyramide des Âges

- Graphique classique (Hommes / Femmes par tranche de 5 ans).
- Superposition en transparence de la pyramide d'il y a 10 ans pour voir le glissement.

### 2. Les Grands Blocs

- % des moins de 25 ans
- % des 25 - 64 ans (actifs)
- % des plus de 65 ans

### 3. Indice de Vieillissement

- Ratio (Personnes de +65 ans / Jeunes de -20 ans).

---

## 🧠 Données attendues

- Population par tranches d'âge quinquennales.
- `indice_vieillissement`

---

## 🧠 UX attendue

### Règles

- Regrouper les tranches fines en 3 ou 4 macro-catégories politiques (Jeunes, Actifs sans enfants, Actifs avec famille, Seniors).

---

## ⚙️ Contraintes techniques

- Les tableaux INSEE des âges sont souvent très découpés. L'application doit faire les additions (GROUP BY) proprement.

---

## 🏁 Conclusion

C'est le module de la **répartition de l'effort public entre les générations**.
