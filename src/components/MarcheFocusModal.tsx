import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { useRef } from "react";

import marcheImg from "../assets/marche/marche.png";
import drapeauFrancaisImg from "../assets/marche/francais.png";
import drapeauCatalanImg from "../assets/marche/catalan.png";

const drapeauxImages = [
  { src: drapeauFrancaisImg, alt: "Drapeau français" },
  { src: drapeauCatalanImg, alt: "Drapeau catalan" },
];

const MARCHE_CONTENT = {
  title: "Marché Catalan Transfrontalier : Un événement phare pour Cabestany",
  subtitle: "La Gastronomie Catalane à l'honneur",
  intro:
    "Faisons de Cabestany le point de rencontre incontournable des saveurs de notre terroir. Ce marché sera une vitrine exceptionnelle pour :",
  sections: [
    {
      title: "La Gastronomie Catalane à l'honneur",
      items: [
        "Les producteurs locaux : Valoriser le circuit court et offrir des produits frais, de saison et de qualité.",
        "La richesse culinaire : Dégustations de spécialités, vins du Roussillon et produits de la Catalogne Sud.",
      ],
    },
    {
      title: "L'Artisanat et le Savoir-faire",
      subtitle:
        "Plus qu'un simple marché, un lieu de découverte et de transmission des traditions :",
      items: [
        "Démonstrations en direct : Des artisans d'art partageront leur passion et leur technique (poterie, tissage, travail du bois, etc.).",
        "Vente directe : Soutenir l'économie locale et repartir avec des créations uniques et authentiques.",
      ],
    },
    {
      title: "Culture, Animations et jumelage",
      subtitle:
        "Un événement festif et convivial pour toute la famille, créateur de lien social :",
      items: [
        "Animations culturelles : Musique traditionnelle (cobla), danses catalanes, ateliers pour enfants.",
        "Jumelage transfrontalier : L'occasion idéale de sceller un partenariat durable avec une ville de Catalogne Sud, pour des échanges culturels et économiques riches.",
      ],
    },
    {
      title: "Conclusion : Un atout pour l'attractivité",
      subtitle:
        "Ce marché transfrontalier n'est pas seulement un événement, c'est une stratégie globale pour :",
      items: [
        "Booster l'économie locale : Attirer les touristes et les habitants des communes voisines.",
        "Renforcer l'identité : Affirmer la fierté de nos racines catalanes.",
        "Faire rayonner Cabestany : Positionner notre ville comme un acteur culturel majeur du territoire.",
      ],
    },
  ],
  conclusion:
    "Cabestany Avant Tout : Faisons battre le cœur de notre culture !",
};

interface MarcheFocusModalProps {
  onClose: () => void;
}

const MarcheFocusModal = ({ onClose }: MarcheFocusModalProps) => {
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
          <title>${MARCHE_CONTENT.title}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.6; }
            h2 { font-size: 1.15rem; color: #8B1538; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            p { margin: 0.75rem 0; }
            ul { margin: 0.5rem 0; padding-left: 1.5rem; }
            li { margin: 0.35rem 0; }
            img { max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; }
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
            {MARCHE_CONTENT.title}
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
          <p className="text-sm font-semibold text-primary mb-4">
            {MARCHE_CONTENT.subtitle}
          </p>
          <p className="text-muted-foreground mb-6">{MARCHE_CONTENT.intro}</p>

          <div className="space-y-4 mb-6">
            <img
              src={marcheImg}
              alt="Marché Catalan Transfrontalier"
              className="w-full rounded-xl border border-border object-cover max-h-64"
            />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide sm:mr-2">
                Transfrontalier
              </p>
              <div className="flex items-center gap-6">
                {drapeauxImages.map(({ src, alt }, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={alt}
                    className="h-20 w-auto object-contain rounded border border-border shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {MARCHE_CONTENT.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-serif font-bold text-primary text-base mt-4 mb-2">
                {section.title}
              </h3>
              {section.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">
                  {section.subtitle}
                </p>
              )}
              <ul className="space-y-2 text-sm text-foreground list-disc pl-5">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-foreground font-semibold">
              {MARCHE_CONTENT.conclusion}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarcheFocusModal;
