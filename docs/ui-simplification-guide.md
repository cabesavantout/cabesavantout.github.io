# Simplification UI du dashboard municipal

## Objectif produit

Construire une interface lisible en 3 secondes, compréhensible sans formation, orientée décision et utilisable au quotidien sur mobile comme sur desktop.

Principe directeur :

1. Remove
2. Reduce
3. Simplify
4. Optimize

---

## 1. Nouvelle architecture de navigation

### Sidebar cible

Maximum 5 entrées principales :

1. `Dashboard`
2. `Promesses`
3. `Comparer`
4. `Carte`
5. `Paramètres`

### Pourquoi ces 5 items restent

- `Dashboard` : point d’entrée quotidien, indispensable pour savoir quoi regarder maintenant.
- `Promesses` : cœur du suivi politique, utile pour piloter les engagements.
- `Comparer` : aide à arbitrer entre secteurs, listes, bureaux ou périodes.
- `Carte` : lecture spatiale immédiate, utile pour décider une action terrain.
- `Paramètres` : accès secondaire mais nécessaire pour les réglages et droits.

### Ce qui doit disparaître de la navigation principale

- `Recherche` : devient une action dans la navbar, pas une page dédiée.
- `INSEE`, `Budget`, `Mandat`, `Tâches`, `Réunions`, `Terrain`, `Analyse terrain`, `Citoyens`, `Contacts`, `Utilisateurs`, `Team` : trop de modules pour une lecture immédiate. Ils doivent être absorbés dans 4 familles métier visibles, ou accessibles depuis les pages concernées.

### Règle de regroupement

- Tout ce qui sert à suivre une promesse va dans `Promesses`.
- Tout ce qui sert à comparer des données va dans `Comparer`.
- Tout ce qui dépend d’une zone géographique va dans `Carte`.
- Tout ce qui est administration, équipe ou accès va dans `Paramètres`.

### Navbar cible

La navbar ne garde que :

- le titre de la page
- une action principale

Exemples d’action principale :

- `Rechercher`
- `Filtrer`
- `Nouvelle promesse`
- `Exporter`

### Ce qui doit être supprimé de la navbar actuelle

- badges décoratifs
- mentions de mode SaaS
- dark mode auto
- sous-informations de contexte non actionnables
- doublons de déconnexion

### Règle mobile

- Desktop : sidebar fixe + navbar minimale
- Mobile : bottom nav 4 items max
- `Paramètres` passe en accès secondaire via bouton en haut à droite ou feuille modale

Bottom nav mobile recommandée :

1. `Accueil`
2. `Promesses`
3. `Comparer`
4. `Carte`

---

## 2. Structure simplifiée des pages

### Gabarit unique

Chaque écran doit suivre ce format :

1. Titre
2. Résumé en une ligne
3. Bloc principal unique
4. Actions secondaires

### Dashboard

Objectif unique : savoir quoi faire maintenant.

Structure :

1. `Titre` : Dashboard
2. `Résumé` : Les signaux qui demandent une décision aujourd’hui.
3. `Bloc principal` : 3 cartes max
4. `Actions secondaires` : Voir toutes les promesses, ouvrir la carte

Cartes recommandées :

- `Urgences ouvertes`
- `Promesses à risque`
- `Secteur à surveiller`

À supprimer :

- flux longs
- vues multiples en parallèle
- badges de statut superflus
- zones “éditorialisées”
- répétition des mêmes métriques sous plusieurs formes

### Promesses

Objectif unique : suivre l’état réel des engagements.

Structure :

1. Titre
2. Résumé
3. Liste simple des promesses
4. Actions secondaires : filtrer par statut

Colonnes max :

- promesse
- statut
- risque
- prochaine étape

À supprimer :

- métadonnées techniques
- textes longs dans la liste
- filtres avancés visibles par défaut

### Comparer

Objectif unique : comparer rapidement pour arbitrer.

Structure :

1. Titre
2. Résumé
3. Comparaison principale
4. Action secondaire : changer le périmètre

Comparaison recommandée :

- 2 à 3 entités maximum à la fois
- 1 axe de lecture par écran

Exemples :

- bureaux de vote
- promesses
- quartiers
- périodes

À supprimer :

- graphes multiples en concurrence
- tableaux trop larges
- options expertes par défaut

### Carte

Objectif unique : décider où agir.

Structure :

1. Titre
2. Résumé
3. Carte
4. Liste courte des zones prioritaires

À garder :

- une légende minimale
- un filtre principal
- une carte cliquable

À supprimer :

- panneaux latéraux trop denses
- métriques répétées hors contexte
- surcouches multiples ouvertes en même temps

### Paramètres

Objectif unique : gérer l’outil, pas analyser.

Structure :

1. Titre
2. Résumé
3. Groupes simples : compte, équipe, données
4. Actions secondaires : déconnexion

---

## 3. Composants refactorés

### Règle commune

Chaque composant doit répondre à une seule question utilisateur.

Si le composant répond à plusieurs questions, il faut le couper.

### Card simplifiée

Format :

- un titre court
- une valeur principale
- une micro-copy d’aide optionnelle

À garder :

- une seule métrique

À supprimer :

- badges multiples
- textes de contexte longs
- CTA secondaires dans la carte

### Table simplifiée

Format :

- 4 colonnes maximum sur desktop
- 2 colonnes visibles sur mobile
- scroll horizontal autorisé si strictement nécessaire

À garder :

- colonne principale
- statut
- prochaine action
- date utile si indispensable

À supprimer :

- colonnes secondaires “au cas où”
- descriptions longues
- actions en ligne multiples

### Filtres simplifiés

Format :

- 1 filtre principal visible
- `Plus de filtres` replié si nécessaire

À garder :

- filtre par statut
- filtre par zone
- recherche texte

À supprimer :

- filtres experts au premier niveau
- combinaisons complexes visibles par défaut

### Empty state utile

Doit toujours contenir :

- ce qui manque
- pourquoi c’est vide
- quoi faire ensuite

Exemple :

`Aucune promesse en retard. Le suivi est à jour. Vous pouvez vérifier les promesses à risque.`

### Loading state

Doit être simple :

- 3 skeleton cards max
- 4 lignes de skeleton pour une table

À supprimer :

- loaders animés décoratifs
- faux contenus trop détaillés

### Feedback utilisateur

Toujours explicite :

- `Promesse enregistrée`
- `Filtre appliqué`
- `Aucune zone ne correspond à ce filtre`

À éviter :

- `Succès`
- `Erreur inconnue`

---

## 4. Audit garde / supprime sur l’interface actuelle

### À garder

- structure en cartes
- responsive déjà présent
- présence d’un shell applicatif
- logique de composants réutilisables

### À simplifier fortement

- header global trop bavard
- sidebar trop longue
- accumulation de badges
- panneaux avec plusieurs objectifs
- dashboards à forte densité

### À supprimer

- éléments décoratifs non informatifs
- redondances entre cartes, listes et badges
- labels internes type “Control Center”
- messages qui décrivent l’interface au lieu d’aider à agir
- doubles actions de session et badges de mode

---

## 5. Système de décision : justification de présence

Avant de garder un élément UI, vérifier :

1. Sert-il à prendre une décision ?
2. Sert-il à exécuter une action ?
3. Sert-il à comprendre un statut important ?

Si la réponse est `non` aux 3 questions, l’élément doit être supprimé.

Exemples :

- `Badge "Mode SaaS"` : inutile, supprimer.
- `Texte "responsive md / lg"` : inutile pour l’utilisateur final, supprimer.
- `Dark mode auto` : inutile dans la navbar, supprimer.
- `3 filtres de période en header` : à garder seulement si cela change réellement la décision principale.
- `Action Export rapide` : à garder uniquement si elle est utilisée souvent. Sinon la descendre en secondaire.

---

## 6. Exemple concret de page simplifiée

Contrainte respectée :

- Vue 3
- Tailwind CSS
- composants réutilisables
- mobile d’abord

Exemple : page `Promesses` simplifiée.

```vue
<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <div class="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside class="hidden rounded-2xl border border-slate-200 bg-white p-3 lg:block">
          <nav class="space-y-1">
            <a
              v-for="item in navigation"
              :key="item.label"
              :href="item.href"
              :class="[
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium',
                item.active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ]"
            >
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-current/10">
                {{ item.icon }}
              </span>
              <span>{{ item.label }}</span>
            </a>
          </nav>
        </aside>

        <main class="space-y-6">
          <header class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <div>
              <h1 class="text-xl font-semibold tracking-tight sm:text-2xl">Promesses</h1>
              <p class="mt-1 text-sm text-slate-600">
                Les engagements à surveiller en priorité.
              </p>
            </div>

            <button
              type="button"
              class="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white"
            >
              Filtrer
            </button>
          </header>

          <section class="grid gap-3 sm:grid-cols-3">
            <SimpleMetricCard
              label="À risque"
              :value="String(summary.atRisk)"
              hint="À traiter cette semaine"
            />
            <SimpleMetricCard
              label="En retard"
              :value="String(summary.late)"
              hint="Demandent une décision"
            />
            <SimpleMetricCard
              label="Dans les temps"
              :value="String(summary.onTrack)"
              hint="Suivi normal"
            />
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white">
            <div class="border-b border-slate-200 px-4 py-4">
              <h2 class="text-base font-semibold">Suivi des promesses</h2>
              <p class="mt-1 text-sm text-slate-600">
                Une ligne = une décision possible.
              </p>
            </div>

            <div v-if="promises.length === 0" class="px-4 py-10 text-center">
              <p class="text-sm font-medium text-slate-900">Aucune promesse à afficher</p>
              <p class="mt-1 text-sm text-slate-600">
                Essayez un autre filtre ou ajoutez une promesse à suivre.
              </p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th class="px-4 py-3 font-medium">Promesse</th>
                    <th class="px-4 py-3 font-medium">Statut</th>
                    <th class="px-4 py-3 font-medium">Risque</th>
                    <th class="px-4 py-3 font-medium">Prochaine étape</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in promises"
                    :key="item.id"
                    class="border-b border-slate-100 last:border-b-0"
                  >
                    <td class="px-4 py-4">
                      <p class="font-medium text-slate-900">{{ item.title }}</p>
                      <p class="mt-1 text-xs text-slate-500">{{ item.theme }}</p>
                    </td>
                    <td class="px-4 py-4">
                      <StatusPill :tone="item.statusTone">
                        {{ item.statusLabel }}
                      </StatusPill>
                    </td>
                    <td class="px-4 py-4 text-slate-700">{{ item.riskLabel }}</td>
                    <td class="px-4 py-4 text-slate-700">{{ item.nextStep }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>

    <nav class="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
      <div class="grid grid-cols-4 gap-2">
        <a
          v-for="item in mobileNavigation"
          :key="item.label"
          :href="item.href"
          :class="[
            'rounded-xl px-2 py-2 text-center text-xs font-medium',
            item.active ? 'bg-slate-900 text-white' : 'text-slate-600',
          ]"
        >
          {{ item.label }}
        </a>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SimpleMetricCard from "@/components/SimpleMetricCard.vue";
import StatusPill from "@/components/StatusPill.vue";

type PromiseItem = {
  id: string;
  title: string;
  theme: string;
  statusLabel: string;
  statusTone: "neutral" | "warning" | "success";
  riskLabel: string;
  nextStep: string;
};

const promises: PromiseItem[] = [
  {
    id: "CAB-2026-URB-001",
    title: "Rénovation de l'école Prévert",
    theme: "Urbanisme",
    statusLabel: "À surveiller",
    statusTone: "warning",
    riskLabel: "Financement fragile",
    nextStep: "Vérifier subventions et emprunts",
  },
  {
    id: "CAB-2026-FIN-001",
    title: "Maîtrise des dépenses",
    theme: "Finances",
    statusLabel: "En cours",
    statusTone: "neutral",
    riskLabel: "Modéré",
    nextStep: "Comparer ROB et budget voté",
  },
];

const navigation = [
  { label: "Dashboard", href: "#", icon: "D", active: false },
  { label: "Promesses", href: "#", icon: "P", active: true },
  { label: "Comparer", href: "#", icon: "C", active: false },
  { label: "Carte", href: "#", icon: "M", active: false },
  { label: "Paramètres", href: "#", icon: "S", active: false },
];

const mobileNavigation = computed(() => navigation.slice(0, 4));

const summary = computed(() => ({
  atRisk: promises.filter((item) => item.riskLabel !== "Modéré").length,
  late: 1,
  onTrack: promises.filter((item) => item.statusLabel === "En cours").length,
}));
</script>
```

### Pourquoi cette page fonctionne mieux

- un seul objectif : suivre les promesses
- une seule action primaire : filtrer
- 3 métriques maximum
- une table courte et lisible
- aucune information décorative
- navigation courte, mémorisable, mobile-compatible

---

## 7. Direction d’implémentation recommandée

### Étape 1

Simplifier le shell global :

- réduire la sidebar à 5 items
- réduire la navbar à titre + action
- retirer les badges décoratifs

### Étape 2

Refondre les primitives :

- `PageHeader`
- `StatCard`
- `Panel`
- `Table`
- `EmptyState`

### Étape 3

Refaire les pages par priorité :

1. `Dashboard`
2. `Promesses`
3. `Carte`
4. `Comparer`
5. `Paramètres`

### Étape 4

Masquer tout ce qui est expert derrière :

- filtres avancés
- options d’admin
- vues secondaires

---

## 8. Critère final de validation

L’interface est suffisamment simple si un utilisateur peut :

1. comprendre où cliquer en moins de 3 secondes
2. décrire l’objectif de la page en une phrase
3. identifier l’action principale sans aide
4. utiliser l’écran sur mobile à une main

---

## 9. Sources de référence externes

Certaines pages devront être maintenues à partir de sources externes stables et vérifiées régulièrement.

### Sources à surveiller

- `INSEE`
  - `https://www.insee.fr/fr/statistiques/2011101?geo=COM-66028`
  - usage : population, logement, âges, catégories socio-professionnelles

- `BANATIC`
  - `https://www.banatic.interieur.gouv.fr/commune/66028-cabestany`
  - usage : intercommunalité, rattachements, contexte institutionnel

### Règle produit

- une donnée affichée doit pouvoir être reliée à une source de référence
- une donnée peu lisible ou mal formatée ne doit pas être affichée
- les pages `INSEE` et futures pages de contexte doivent être revues quand ces sources évoluent
