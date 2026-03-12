import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Construction,
  Shield,
  Landmark,
  TreePine,
  Building2,
  Theater,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  ImageIcon,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import securiteImg from "@/assets/securite.png";
import professionPf from "@/assets/docs/profession_1er_tour.pdf";
import reunionPubPf from "@/assets/docs/reunion_pub.pdf";
import reunionDiapoPf from "@/assets/docs/reunion_diapo.pdf";

interface ProgrammeTheme {
  icon: LucideIcon;
  title: string;
  intro: string;
  points: string[];
  images: string[]; // URLs or paths to carousel images
}

const themes: ProgrammeTheme[] = [
  {
    icon: Construction,
    title: "Voirie & Entretien",
    intro: "Entretenir la ville avant de construire davantage.",
    points: [
      "Réfection des voies communales endommagées",
      "Des trottoirs plus sûrs et accessibles",
      "Éclairage public modernisé (LED, solaire, pilotage intelligent)",
      "Meilleure coordination des travaux",
    ],
    images: [],
  },
  {
    icon: Landmark,
    title: "Finances",
    intro: "Maîtriser le budget et préparer l'avenir.",
    points: [
      "Maîtriser et optimiser les dépenses",
      "Renégocier certains contrats",
      "Moderniser l'administration",
      "Diversifier les recettes pour redynamiser l'économie",
    ],
    images: [],
  },
  {
    icon: Shield,
    title: "Sécurité & Tranquillité",
    intro: "Une sécurité de proximité, humaine et visible.",
    points: [
      "Doubler les effectifs de la police municipale",
      "Référents de quartiers",
      "Renforcer la vidéoprotection",
      "Coopération avec les communes voisines",
    ],
    images: [securiteImg],
  },
  {
    icon: TreePine,
    title: "Agriculture & Environnement",
    intro: "Cultiver l'avenir en préservant nos racines.",
    points: [
      "Protéger les terres agricoles restantes",
      "Créer la route des Mas (circuit éco-agronomique)",
      "Étendre les jardins familiaux",
      "Repenser le parc Sainte-Camille",
    ],
    images: [],
  },
  {
    icon: Building2,
    title: "Urbanisme",
    intro: "Maîtriser le développement, revitaliser le centre-ville.",
    points: [
      "Restructuration du cœur de ville (piétonisation, espaces publics)",
      "Projet d'écolodges aux Colomines (60 logements légers)",
      "Déploiement de capteurs solaires",
      "Limiter l'étalement urbain",
    ],
    images: [],
  },
  {
    icon: Theater,
    title: "Culture & Tourisme",
    intro: "Faire de Cabestany un pôle culturel au sud de l'agglomération.",
    points: [
      "Antenne de tourisme nouvelle génération",
      "Marché catalan transfrontalier",
      "Festival international de sculpture",
      "Valoriser la langue et la culture catalane",
    ],
    images: [],
  },
  {
    icon: Users,
    title: "Vie Citoyenne",
    intro: "Une mairie à l'écoute, des services plus accessibles.",
    points: [
      "Soutenir les associations sportives et culturelles",
      "Renforcer l'action du CCAS",
      "Aide numérique et accompagnement santé",
      "Réseau de référents de quartier",
    ],
    images: [],
  },
];

const ImageCarousel = ({
  images,
  title,
  onClose,
}: {
  images: string[];
  title: string;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-serif font-bold text-lg text-foreground">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="relative aspect-[16/10] bg-muted">
          <img
            src={images[current]}
            alt={`${title} - image ${current + 1}`}
            className="w-full h-full object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrent((p) => (p - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-md flex items-center justify-center hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setCurrent((p) => (p + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-md flex items-center justify-center hover:bg-card transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === current ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ProgrammeSection = () => {
  const [openCarousel, setOpenCarousel] = useState<number | null>(null);

  return (
    <section id="programme" className="section-padding bg-background">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-sans text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Nos engagements
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Notre programme
          </h2>
          <p className="mt-4 text-muted-foreground mx-auto">
            Un projet ambitieux, solide et original. Dans un cadre de dépenses
            maîtrisées, des actions concrètes pour Cabestany.
          </p>
        </motion.div>

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="bg-card rounded-2xl p-5 shadow-[var(--card-shadow)] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Profession de foi — 1er tour
                </p>
                <p className="text-xs text-muted-foreground">
                  Le document officiel détaillant notre projet.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={professionPf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Voir le document
              </a>
              <a
                href={professionPf}
                download
                className="inline-flex items-center justify-center rounded-full border border-border text-xs font-semibold px-4 py-2 text-foreground bg-card hover:bg-muted transition-colors"
              >
                Télécharger (PDF)
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="bg-card rounded-2xl p-5 shadow-[var(--card-shadow)] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Invitation réunion publique
                </p>
                <p className="text-xs text-muted-foreground">
                  Les informations pratiques pour la réunion de présentation.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={reunionPubPf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Voir le document
              </a>
              <a
                href={reunionPubPf}
                download
                className="inline-flex items-center justify-center rounded-full border border-border text-xs font-semibold px-4 py-2 text-foreground bg-card hover:bg-muted transition-colors"
              >
                Télécharger (PDF)
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-card rounded-2xl p-5 shadow-[var(--card-shadow)] flex flex-col gap-3 md:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Diaporama présenté en réunion
                </p>
                <p className="text-xs text-muted-foreground">
                  Les principales diapositives de la réunion publique.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={reunionDiapoPf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Voir le document
              </a>
              <a
                href={reunionDiapoPf}
                download
                className="inline-flex items-center justify-center rounded-full border border-border text-xs font-semibold px-4 py-2 text-foreground bg-card hover:bg-muted transition-colors"
              >
                Télécharger (PDF)
              </a>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, i) => {
            const Icon = theme.icon;
            return (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-200 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  {theme.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {theme.intro}
                </p>
                <ul className="space-y-2 mb-4">
                  {theme.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>

                {theme.images.length > 0 ? (
                  <button
                    onClick={() => setOpenCarousel(i)}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Voir les images ({theme.images.length})
                  </button>
                ) : (
                  <span className="mt-auto inline-flex items-center gap-2 text-xs text-muted-foreground/50">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Images à venir
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {openCarousel !== null && themes[openCarousel].images.length > 0 && (
            <ImageCarousel
              images={themes[openCarousel].images}
              title={themes[openCarousel].title}
              onClose={() => setOpenCarousel(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProgrammeSection;
