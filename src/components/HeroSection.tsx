import { motion } from "framer-motion";
import ericPoupet from "@/assets/eric-poupet.png";
import cabestany from "@/assets/cabestany.webp";

const HeroSection = () => {
  return (
    <section className="section-padding bg-card relative overflow-hidden">
      {/* Image de Cabestany en cover de fond */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <img
          src={cabestany}
          alt="Vue de Cabestany"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container-main relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <p className="font-sans text-sm font-semibold tracking-widest uppercase text-primary mb-4">
              Élections Municipales 2026
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
              Agir ensemble pour <span className="text-primary">Cabestany</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Une équipe engagée, un projet réaliste et responsable. Proximité,
              rigueur, dialogue — pour une ville plus vivante, plus sûre et plus
              durable.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#programme"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-sans font-semibold text-sm py-3 px-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                Notre programme
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-sans font-semibold text-sm py-3 px-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                Nous contacter
              </a>
            </div>

            {/* Key figures */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { num: "33", label: "Colistiers engagés" },
                { num: "7", label: "Thèmes du programme" },
                { num: "15 & 22", label: "Mars 2026" },
              ].map((item) => (
                <div key={item.label}>
                  <span className="block text-2xl font-serif font-bold text-primary">
                    {item.num}
                  </span>
                  <span className="text-xs font-sans text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative">
              <img
                src={ericPoupet}
                alt="Éric Poupet, tête de liste Cabestany Avant Tout"
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-2xl outline outline-1 outline-border -outline-offset-1"
              />
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-xl px-4 py-2 shadow-lg">
                <span className="font-serif font-bold text-sm">
                  Éric Poupet
                </span>
                <span className="block font-sans text-xs opacity-90">
                  Tête de liste
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
