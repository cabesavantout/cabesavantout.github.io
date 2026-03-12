import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, ImageIcon } from "lucide-react";
import reunion2 from "@/assets/reunion/2.png";
import reunion3 from "@/assets/reunion/3.png";
import reunion4 from "@/assets/reunion/4.png";
import reunion5 from "@/assets/reunion/5.png";
import reunion6 from "@/assets/reunion/6.png";
import reunion7 from "@/assets/reunion/7.png";
import reunion8 from "@/assets/reunion/8.png";
import reunion9 from "@/assets/reunion/9.png";
import reunion10 from "@/assets/reunion/10.png";
import reunion11 from "@/assets/reunion/11.png";
import reunion12 from "@/assets/reunion/12.png";
import reunion13 from "@/assets/reunion/13.png";

const reunionImages = [
  reunion2,
  reunion3,
  reunion4,
  reunion5,
  reunion6,
  reunion7,
  reunion8,
  reunion9,
  reunion10,
  reunion11,
  reunion12,
  reunion13,
];

const EvenementsSection = () => {
  return (
    <section id="evenements" className="section-padding bg-background">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <p className="font-sans text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Rendez-vous
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Les dates clés
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {[
            {
              date: "12 mars 2026",
              time: "18h30",
              title: "Réunion publique",
              location: "Salle Cerda, Centre Culturel",
              description:
                "Venez à la rencontre d'Éric Poupet et son équipe. Présentation du programme et échanges avec les habitants.",
              highlight: true,
            },
            {
              date: "15 mars 2026",
              time: "8h – 18h",
              title: "1er tour des élections",
              location: "Bureaux de vote de Cabestany",
              description: "Premier tour des élections municipales.",
              highlight: false,
            },
            {
              date: "22 mars 2026",
              time: "8h – 18h",
              title: "2nd tour des élections",
              location: "Bureaux de vote de Cabestany",
              description: "Second tour des élections municipales.",
              highlight: false,
            },
          ].map((event, i) => (
            <motion.div
              key={event.date + event.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`rounded-2xl p-6 ${
                event.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-card shadow-[var(--card-shadow)]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                    event.highlight
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10"
                  }`}
                >
                  <CalendarDays
                    className={`w-6 h-6 ${event.highlight ? "text-primary-foreground" : "text-primary"}`}
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    {event.title}
                  </h3>
                  <div
                    className={`flex flex-wrap gap-4 mt-2 text-sm ${
                      event.highlight
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {event.location}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      event.highlight
                        ? "text-primary-foreground/90"
                        : "text-muted-foreground"
                    }`}
                  >
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {reunionImages.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Quelques images de la réunion publique
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {reunionImages.map((src, idx) => (
                <a
                  key={idx}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-xl border border-border bg-card aspect-square"
                >
                  <img
                    src={src}
                    alt={`Réunion publique – photo ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EvenementsSection;
