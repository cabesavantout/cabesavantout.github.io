import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { useRef, type ReactNode } from "react";

import zoneImg from "../assets/colomines/zone.png";
import colomines1Img from "../assets/colomines/colomines1.png";
import colomines2Img from "../assets/colomines/colomines2.jpg";
import budgetImg from "../assets/colomines/budget.png";

/** Met en gras les chiffres (montants, %, nombres) dans le texte */
function boldNumbers(text: string): ReactNode {
  const re = /(\d[\d\s,.]*(?:\s*M?\s*€)?|\d+\s*%|\d+(?=\s*(?:logements|hectares)))/g;
  const parts = text.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

const COLOMINES_CONTENT = {
  title: "Les Colomines : L'alternative durable pour Cabestany",
  subtitle: "Une vision d'avenir, pas de béton",
  intro:
    "Pourquoi transformer nos paysages en zones industrielles bitumées ? Nous proposons un quartier exemplaire qui respire, à l'opposé de l'urbanisme massif.",
  sections: [
    {
      title: "Une vision d'avenir, pas de béton",
      items: [
        "Respect absolu du site : Zéro artificialisation massive. Les écolodges sont installés sur des structures légères (pieux vissés).",
        "Argument de Réversibilité : Contrairement au goudron qui condamne les sols, notre projet est réversible. La terre reste vivante et pourrait retrouver sa vocation naturelle ou agricole sans cicatrice si les besoins changeaient dans le futur.",
        "Gestion des ressources : Récupération des eaux de pluie pour l'entretien des espaces verts et éclairage LED intelligent pour protéger la biodiversité nocturne.",
      ],
    },
    {
      title: "Une mobilité douce et connectée",
      subtitle:
        "Le projet des Colomines n'est pas une \"île\", il est le nouveau maillon de notre ville :",
      items: [
        "Accessibilité : Création d'arrêts de bus au pied du site pour un accès direct aux pôles d'activité.",
        "Réseau cyclable : Liaison sécurisée via de nouvelles pistes cyclables reliant le site au centre-ville.",
        "Dynamisme local : 60 logements, ce sont de nouveaux habitants qui font vivre nos commerces de proximité (boulangeries, presse, services) toute l'année.",
      ],
    },
    {
      title: "Un véritable cœur de vie pour nos jeunes",
      subtitle:
        "Pour retenir nos jeunes à Cabestany, nous créons un écosystème qui favorise la réussite et le lien :",
      items: [
        "Espaces partagés : Salles de coworking connectées pour étudier, buanderie commune et jardins partagés pour la convivialité.",
        "Sérénité et Sécurité : Un cadre de vie calme, paysager et sécurisant, loin de l'image des zones industrielles désertes la nuit.",
        "Double usage : Étudiants de septembre à juin / Éco-tourisme en été (création d'emplois saisonniers pour les jeunes locaux).",
      ],
    },
    {
      title: "Un projet responsable, chiffré et rentable",
      subtitle:
        "L'écologie est ici un levier pour les finances de la commune. Le dossier est prêt :",
      items: [
        "Investissement : 3,2 M€ (50% de subventions déjà identifiées).",
        "Autofinancement : 420 000 € de recettes locatives annuelles.",
        "Un gain pour Cabestany : 260 000 € de résultat net annuel réinjectés dans le budget municipal pour financer vos services publics sans augmenter les impôts.",
      ],
    },
  ],
  conclusion: [
    "Ne sacrifions pas 35 hectares de nature pour du bitume. Choisissons un projet à taille humaine qui connecte les générations, soutient nos commerces et préserve notre héritage.",
    "Choisissons l'avenir, pas le béton !",
  ],
};

interface ColominesFocusModalProps {
  onClose: () => void;
}

const ColominesFocusModal = ({ onClose }: ColominesFocusModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${COLOMINES_CONTENT.title}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.6; }
            h1 { font-size: 1.5rem; color: #8B1538; margin-bottom: 0.5rem; }
            h2 { font-size: 1.15rem; color: #8B1538; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            .subtitle { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
            p { margin: 0.75rem 0; }
            ul { margin: 0.5rem 0; padding-left: 1.5rem; }
            li { margin: 0.35rem 0; }
            .intro { margin-bottom: 1rem; }
            .conclusion { margin-top: 1.5rem; font-weight: 600; }
            img { max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; }
            .images { margin: 1.5rem 0; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="font-serif font-bold text-lg text-foreground pr-4">
            {COLOMINES_CONTENT.title}
          </h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Imprimer / Enregistrer en PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={printRef}
          className="p-6 pb-10 overflow-y-auto max-h-[calc(90vh-80px)] print-content"
        >
          <p className="text-sm font-semibold text-primary mb-2">
            {COLOMINES_CONTENT.subtitle}
          </p>
          <p className="text-muted-foreground mb-6">{COLOMINES_CONTENT.intro}</p>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                Avant
              </p>
              <img
                src={zoneImg}
                alt="Zone des Colomines — avant"
                className="w-full rounded-xl border border-border object-cover max-h-64"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                Après
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <img
                  src={colomines1Img}
                  alt="Projet Colomines — vue 1"
                  className="w-full rounded-xl border border-border object-cover max-h-64"
                />
                <img
                  src={colomines2Img}
                  alt="Projet Colomines — vue 2"
                  className="w-full rounded-xl border border-border object-cover max-h-64"
                />
              </div>
            </div>
          </div>

          {COLOMINES_CONTENT.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-serif font-bold text-primary text-base mt-4 mb-2">
                {section.title}
              </h3>
              {section.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">
                  {section.subtitle}
                </p>
              )}
              {idx === 3 && (
                <img
                  src={budgetImg}
                  alt="Budget du projet Colomines"
                  className="w-full rounded-xl border border-border object-contain max-h-72 my-3"
                />
              )}
              <ul className="space-y-2 text-sm text-foreground list-disc pl-5">
                {section.items.map((item, i) => (
                  <li key={i}>{boldNumbers(item)}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="font-serif font-bold text-primary text-base mb-2">
              Conclusion
            </h3>
            {COLOMINES_CONTENT.conclusion.map((p, i) => (
              <p
                key={i}
                className={
                  i === COLOMINES_CONTENT.conclusion.length - 1
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }
              >
                {boldNumbers(p)}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ColominesFocusModal;
