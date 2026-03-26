import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { useRef } from "react";

import pepiniereImg from "../assets/pepiniere/pepiniere.png";

const PEPINIERE_CONTENT = {
  title: "La Pépinière Pédagogique : Faire grandir demain",
  subtitle: "Terres Vivantes : Redonner vie à nos friches",
  intro:
    "Plutôt que de laisser nos terrains à l'abandon ou de les livrer à l'urbanisation, nous choisissons de les transformer en un poumon vert productif :",
  sections: [
    {
      title: "Redonner vie à nos friches",
      items: [
        "Réhabiliter : Transformer les friches délaissées en un jardin de production dynamique.",
        "Cultiver local : Créer un conservatoire de plants méditerranéens, adaptés à notre climat et économes en eau.",
        "Protéger : Garantir que ces terres resteront dédiées à la nature et à la transmission, loin du béton.",
      ],
    },
    {
      title: "Ville Durable : Le laboratoire des jeunes Cabestanyencs",
      subtitle:
        "La pépinière sera le premier outil d'éducation à l'environnement de la commune :",
      items: [
        "Apprendre par l'action : Un espace conçu pour accueillir les classes de nos écoles. Ici, les enfants sèment, plantent et voient grandir le fruit de leur travail.",
        "Ateliers découverte : Comprendre le cycle de l'eau, le rôle des insectes pollinisateurs et la richesse de notre biodiversité catalane.",
        "Fierté locale : Les fleurs et arbustes qui embelliront les cours d'écoles et les parcs de la ville seront cultivés ici, par et pour les habitants.",
      ],
    },
    {
      title: "Un lieu de partage entre générations",
      subtitle:
        "La pépinière est un pont entre le savoir-faire de nos aînés et l'énergie de notre jeunesse :",
      items: [
        "Transmission : Des moments de rencontre entre agriculteurs, jardiniers passionnés et écoliers.",
        "Saine gestion : En produisant nos propres plants, nous agissons de manière responsable pour les finances de la ville tout en garantissant une qualité exemplaire.",
      ],
    },
  ],
  conclusion:
    "La pépinière pédagogique n'est pas qu'un jardin, c'est une promesse faite aux générations futures. C'est l'incarnation concrète de notre engagement pour un Cabestany vert, vivant et fier de ses racines.",
  citation: "Cultivons ensemble le Cabestany de demain.",
};

interface TerresVivantesFocusModalProps {
  onClose: () => void;
}

const TerresVivantesFocusModal = ({
  onClose,
}: TerresVivantesFocusModalProps) => {
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
          <title>${PEPINIERE_CONTENT.title}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.6; }
            h2 { font-size: 1.15rem; color: #8B1538; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            p { margin: 0.75rem 0; }
            ul { margin: 0.5rem 0; padding-left: 1.5rem; }
            li { margin: 0.35rem 0; }
            img { max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px; }
            .citation { font-style: italic; margin-top: 1rem; }
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
            {PEPINIERE_CONTENT.title}
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
            {PEPINIERE_CONTENT.subtitle}
          </p>
          <p className="text-muted-foreground mb-6">
            {PEPINIERE_CONTENT.intro}
          </p>

          <div className="mb-6">
            <img
              src={pepiniereImg}
              alt="Pépinière pédagogique - Faire grandir demain"
              className="w-full rounded-xl border border-border object-cover max-h-72"
            />
          </div>

          {PEPINIERE_CONTENT.sections.map((section, idx) => (
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
              {PEPINIERE_CONTENT.conclusion}
            </p>
            <p className="text-primary font-serif italic mt-2">
              {PEPINIERE_CONTENT.citation}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TerresVivantesFocusModal;
