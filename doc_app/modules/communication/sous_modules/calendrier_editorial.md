# 🧩 Sous-module Communication — Calendrier éditorial

## 🧠 Objectif

Le sous-module **Calendrier éditorial** orchestre le **timing des prises de parole**.

Il sert à :

- s'assurer qu'on ne publie pas 3 posts le même jour puis rien pendant une semaine
- aligner la communication sur l'Agenda (ex: publier un post 2 jours avant un événement pour teaser)
- donner une vue claire du plan de charge au community manager

---

## ❓ Question clé

👉 Quel est notre plan de publication pour les 7 prochains jours ?

---

## 🧩 Rôle dans le module Communication

- C'est une **vue** qui ordonnance temporellement les contenus. Il ne possède pas de données en propre, il les affiche.

Alimente :

- **Dashboard** (rappel des posts prévus aujourd'hui).

---

## 🎯 Finalité métier

Permettre de répondre à :

1. Y a-t-il un "trou" dans notre communication la semaine prochaine ?
2. Le post sur la sécurité est-il bien prévu pour sortir en même temps que notre tractage sur le marché ?

---

## 🧱 Structure recommandée

### 1. Vue Planning (Calendrier)

- Affichage des "Publications" et "Réseaux sociaux" selon leur `scheduled_date`.
- Code couleur selon la plateforme (Bleu=Facebook, Noir=X, Rose=Insta, Vert=Blog).
- Code couleur selon le statut (`Gris`=Brouillon, `Orange`=À valider, `Vert`=Validé).

---

## 🔄 Interactions avec les autres modules

| Module | Interaction                                                                                                      |
| :----- | :--------------------------------------------------------------------------------------------------------------- |
| Agenda | Se superpose à l'Agenda général pour aligner "Ce qu'on fait" (Agenda) avec "Ce qu'on dit" (Calendrier éditorial) |

---

## 🧠 UX attendue

### Principes

- Mode "Glisser-déposer" (Drag & drop). Pouvoir décaler la date prévue d'un post en le tirant d'une case à l'autre.
- **Lecture rapide des goulots d'étranglement** : L'utilisateur doit voir en 1 seconde s'il y a trop de contenus "À valider" (Orange).

### 🎨 Recommandations UI & Interactions

- **Carte Contenu** : Chaque élément dans le calendrier est une petite carte affichant : le type (icône), le titre, et le badge de statut.
- **Filtres rapides** : Boutons pour masquer/afficher les contenus par statut ou par plateforme.
- **Création rapide** : Un clic sur une case vide du calendrier doit proposer de créer un nouveau contenu pour cette date.

---

## ⚙️ Contraintes techniques

- **Performance** : La requête pour peupler le calendrier doit être optimisée, en ne chargeant que les contenus du mois visible.
- **Coût du Drag & Drop** : Cette fonctionnalité a un coût de développement. Pour un MVP, une simple vue liste chronologique ou un calendrier en lecture seule est suffisant. La modification de la date se fait dans la fiche du contenu.

---

## 🏁 Conclusion

C'est le **métronome de la visibilité numérique**.
