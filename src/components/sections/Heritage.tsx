'use client'

import { motion } from 'framer-motion'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'

export function Heritage() {
  const slowReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2
      }
    }
  }

  return (
    <section
      id="heritage"
      className="section-padding bg-nero relative overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <TextureOverlay variant="linen" opacity={0.02} />

      <div className="container-custom relative max-w-4xl mx-auto">

        {/* La Nostra Storia */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="text-center mb-20"
        >
          <motion.p
            variants={slowReveal}
            className="font-sans text-xs uppercase tracking-[0.5em] text-gold/60 mb-6"
          >
            Heritage
          </motion.p>

          <motion.h2
            variants={slowReveal}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-gold mb-12"
          >
            La Nostra Storia
          </motion.h2>

          <motion.p
            variants={slowReveal}
            className="font-serif text-lg md:text-xl text-bianco/80 leading-relaxed mb-8"
          >
            Nel cuore dell&apos;Abruzzo, tra le dolci colline della provincia di Pescara, sorge l&apos;Azienda Agricola G.B. Obletter: un progetto nato dalla visione di un giovane imprenditore che ha scelto di guardare al futuro riscoprendo le radici più autentiche della terra.
          </motion.p>

          <motion.p
            variants={slowReveal}
            className="font-serif text-lg md:text-xl text-bianco/80 leading-relaxed"
          >
            Giovanni Battista Obletter, classe 1996, rappresenta una nuova generazione di agricoltori che coniuga la sapienza contadina tramandata nei secoli con le più avanzate pratiche di coltivazione sostenibile. Cinquanta ettari di terreni distribuiti tra Cepagatti, Moscufo e Pianella — borghi dove il tempo scorre ancora al ritmo delle stagioni — costituiscono il patrimonio verde da cui nascono i nostri prodotti biologici certificati.
          </motion.p>
        </motion.div>

        <OrnateRule variant="fleur" className="my-16" />

        {/* Tradizione e Innovazione */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="text-center"
        >
          <motion.h3
            variants={slowReveal}
            className="font-serif text-3xl md:text-4xl text-gold mb-12"
          >
            Tradizione e Innovazione
          </motion.h3>

          <motion.p
            variants={slowReveal}
            className="font-serif text-lg md:text-xl text-bianco/80 leading-relaxed mb-8"
          >
            La scelta di coltivare il <span className="text-gold">grano duro Senatore Cappelli</span>, antica varietà italiana quasi dimenticata dall&apos;agricoltura intensiva, racconta la nostra filosofia: recuperare il meglio del passato per offrire al presente un&apos;alimentazione genuina e consapevole. Dalla stessa passione nasce il nostro <span className="text-gold">Olio Extravergine DOP Aprutino Pescarese</span>, spremuto a freddo da olive raccolte a mano negli uliveti che da generazioni punteggiano questo paesaggio.
          </motion.p>

          <motion.p
            variants={slowReveal}
            className="font-serif text-lg md:text-xl text-bianco/70 leading-relaxed italic"
          >
            Ogni prodotto che porta il nostro nome è il risultato di un impegno quotidiano verso la qualità, la sostenibilità e il rispetto per un territorio che ci ha insegnato tutto. Perché essere giovani agricoltori oggi significa avere il coraggio di innovare, senza mai dimenticare da dove veniamo.
          </motion.p>
        </motion.div>

        {/* Citazione Virgilio con animazione */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-24 relative py-16"
        >
          {/* Linea animata sinistra */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-gold/40 to-gold/20 origin-left"
          />

          {/* Linea animata destra */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 top-1/2 w-1/4 h-px bg-gradient-to-l from-transparent via-gold/40 to-gold/20 origin-right"
          />

          {/* Decorazione centrale superiore */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-0 left-1/2 -translate-x-1/2"
          >
            <svg width="40" height="20" viewBox="0 0 40 20" className="text-gold/40">
              <path d="M20 20 L0 0 M20 20 L40 0" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Citazione */}
          <div className="text-center px-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="font-serif text-2xl md:text-3xl italic text-bianco/80 leading-relaxed"
            >
              &quot;O fortunatos nimium,
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="font-serif text-2xl md:text-3xl italic text-gold/80 leading-relaxed mt-2"
            >
              sua si bona norint, agricolas.&quot;
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.4 }}
              className="font-sans text-sm text-bianco/40 mt-6 tracking-[0.3em] uppercase"
            >
              Virgilio — Georgiche
            </motion.p>
          </div>

          {/* Decorazione centrale inferiore */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
          >
            <svg width="40" height="20" viewBox="0 0 40 20" className="text-gold/40">
              <path d="M20 0 L0 20 M20 0 L40 20" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="20" cy="0" r="2" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Particelle dorate fluttuanti */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
