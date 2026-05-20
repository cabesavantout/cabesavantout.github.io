# 📢 Module Communication

## 🧠 Objectif

Le module Communication est **l'usine à contenus** (Content Factory) de la campagne.

Il permet de :

- transformer les données (Budget, Territoire) et la stratégie (Campagne) en productions concrètes
- générer des textes (posts, tracts, argumentaires) avec l'aide de l'Intelligence Artificielle
- planifier les sorties médiatiques pour occuper l'espace
- s'assurer de la cohérence de la prise de parole publique

👉 afin de **gagner la bataille de l'attention et du récit**.

---

## ❓ Question clé

👉 Que dire, à qui, sous quel format, et comment le produire plus vite ?

---

## 🎯 Finalité métier

Ce module doit permettre de prendre une décision éditoriale ou de déclencher une action de diffusion en répondant à :

1. Sur quel sujet faut-il communiquer aujourd'hui pour reprendre l'initiative ?
2. Les éléments de langage sont-ils validés et alignés avec les faits (Mandat / Documents) ?
3. Qui doit relire et valider la publication avant diffusion externe ?

---

### 🥇 Priorité Produit

- **Essentiel** : Débloquer le syndrome de la page blanche grâce à la génération IA basée sur des faits (Promesses / Documents).
- **Secondaire** : Le calendrier éditorial complexe type diagramme de Gantt (privilégier une simple vue chronologique ou liste).

## 🧩 Rôle dans l’application

- C'est le module de "Sortie" (Output). Il ingère les faits (Mandat, Documentation) et recrache du récit.
- C'est le terrain de jeu privilégié de l'IA générative dans cette application.

Le module Communication **n’est pas** :

- le lieu de définition de la stratégie (c'est le rôle de `Campagne > Stratégie`). Ici, on l'exécute.
- un outil de publication directe (comme Buffer ou Hootsuite) dans sa version MVP, mais plutôt un outil de _rédaction_ et de _validation_.

---

## 🧱 Structure conceptuelle du module

### 1. Vue communication

- Le tableau de bord de la production (ce qui est en brouillon, ce qui est validé).

### 2. Messages

- Le copywriting opérationnel (slogans, phrases d'accroche).

### 3. Argumentaires

- Les textes de fond pour préparer un débat ou une réunion publique.

### 4. Publications

- Les formats longs (articles de blog, éditos de newsletters, textes de tracts).

### 5. Réseaux sociaux

- Les posts courts générés (Facebook, X, Instagram) avec variantes de tonalité.

### 6. Communiqués

- Les annonces officielles pour la presse.

### 7. Presse

- Le volet "Relations Publiques" (fichiers journalistes, envois).

### 8. Calendrier éditorial

- Le planning de publication.

### 9. Veille

- La surveillance de l'impact de nos prises de parole.

---

## 🔄 Interactions avec les autres modules

| Module               | Interaction                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| Campagne             | Hérite des "Messages clés" stratégiques pour les décliner en textes concrets |
| Mandat               | Utilise une "Réalisation" ou une "Promesse" comme matière première d'un post |
| Population/Élections | Utilise les données chiffrées pour justifier un argumentaire                 |
| Documentation        | Cite les pièces jointes (ex: "Le document de la CRC prouve que...")          |

---

## 🧠 Données attendues

### Entité principale : Contenu (Content)

- `id`, `type` (post_social, argumentaire, communique, publication_longue)
- `title`, `body_content`
- `status` (brouillon, a_valider, valide, publie)
- `author_id`, `validator_id`
- `scheduled_date` (date prévue de sortie)
- `source_ids` (liens polymorphes vers des ID de Promesses, Décisions ou Documents pour le contexte RAG)

### 🧱 Règles de structuration

- **Agnostique** : Le contenu généré doit rester pur (texte simple ou Markdown) pour être exportable partout.
- **Traçabilité de la preuve** : Une production IA ne doit jamais être validée si elle ne pointe pas vers une entité "Document" ou "Fait" factuelle de l'app.

---

## 🧠 UX attendue

### Principes (Référence : `campaign-webapp-roadmap.md`)

- **IA Assistive** : Un bouton "Générer un brouillon avec l'IA" doit être présent. L'IA n'est jamais opaque, elle propose, l'humain valide.
- **Workflow de validation** : Statuts clairs (`Brouillon` > `À relire` > `Validé` > `Publié`).
- **Adaptation Device** : Desktop-first pour la rédaction experte (Tracts, Argumentaires longs). Mobile-first pour la validation rapide par le candidat et la création de micro-posts sur le terrain.
- **Focus Mode** : La rédaction exige de la concentration. Possibilité de replier la sidebar pour un éditeur plein écran.

### 🎨 Recommandations UI & Interactions

- **Split-Screen Editor** : Écran divisé en deux. À gauche : le document source (ex: Bilan financier), à droite : l'éditeur de texte / prompt IA.
- **Outil de Diff** : Lors de la relecture, afficher visuellement (en rouge/vert) ce qui a été modifié entre le brouillon IA et la version humaine.
- **Code Couleur Strict** : Badges de statuts immuables (Gris = Brouillon, Orange = À Valider, Vert = Prêt/Publié).
- **Éditeur Block-based** : Préférer un éditeur type Notion (TipTap) pour la structuration de la donnée plutôt qu'un WYSIWYG capricieux.

---

## ⚙️ Contraintes techniques

- **Intégration OpenAI** : Gestion sécurisée des prompts côté serveur (Route Handlers Next.js).
- **Historisation** : Sauvegarde des versions (pour retrouver un brouillon avant modification).
- **Garde-fous IA** : Ne jamais envoyer de données citoyennes (RGPD) dans les prompts publics.
- **RAG System** : Construire un contexte injecté dynamiquement dans le prompt ("Agis comme un chargé de communication politique, voici la promesse X, voici l'avancement Y, écris un tweet").
- **Streaming IA (UX de perception)** : Utiliser le Server-Sent Events (SSE) pour afficher les mots générés en temps réel. Ne pas utiliser de loader infini de 30 secondes.
- **Indépendance Social Media** : Pour le MVP, ne pas brancher d'API (Facebook/Twitter) très coûteuses à maintenir. Le workflow s'arrête à un gros bouton "Copier" exploité ensuite par le Community Manager.

---

## 🚀 Roadmap d’implémentation

### Phase 1 — MVP

- Un CRUD générique pour les "Contenus" (Publications, Posts) avec éditeur Markdown.
- Statuts de validation.

### Phase 2 — Génération IA

- Bouton "Générer" basé sur un contexte sélectionné (ex: générer un post à partir de la Fiche Promesse X).

### Phase 3 — Calendrier éditorial

- Vue chronologique des sorties prévues.

---

## 🏁 Conclusion

Le module Communication doit devenir :

👉 le porte-voix de l'équipe
👉 le gain de temps majeur pour l'équipe de rédaction
