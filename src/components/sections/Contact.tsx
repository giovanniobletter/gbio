'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import { fadeUp, slideInLeft, slideInRight } from '@/lib/animations'
import { cn } from '@/lib/utils'

const contactInfo = [
  {
    icon: MapPin,
    label: 'Indirizzo',
    value: 'Via Sicilia, Fraz. Villanova 2/a\n65012 Cepagatti (PE)',
  },
  {
    icon: Phone,
    label: 'Telefono',
    value: '+39 392 636 2254',
    href: 'tel:+393926362254',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'gb.obletter@gmail.com',
    href: 'mailto:gb.obletter@gmail.com',
  },
  {
    icon: Clock,
    label: 'Orari',
    value: 'Lun - Ven: 9:00 - 18:00\nSab: 9:00 - 13:00',
  },
]

const subjects = [
  { value: 'info', label: 'Informazioni generali' },
  { value: 'ordini', label: 'Ordini e spedizioni' },
  { value: 'collaborazioni', label: 'Collaborazioni' },
  { value: 'altro', label: 'Altro' },
]

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'info',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'info',
      message: '',
    })

    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const inputStyles = `
    w-full bg-transparent border border-gold/30 px-4 py-3
    font-sans text-bianco placeholder:text-bianco/30
    focus:border-gold focus:outline-none transition-colors duration-300
  `

  return (
    <section id="contatti" className="section-padding bg-nero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-forest-dark/20 to-transparent" />

      <div className="container-custom relative z-10">
        <SectionTitle
          eyebrow="Contattaci"
          title="Parliamo dei Tuoi Progetti"
          subtitle="Che si tratti di un ordine, una collaborazione o semplicemente una domanda, siamo qui per te."
        />

        <div className="mt-20 grid lg:grid-cols-5 gap-16">
          {/* Contact Info */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                custom={index}
                className="flex gap-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 border border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <item.icon size={20} className="text-gold" />
                </div>
                <div>
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold/60">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block font-sans text-bianco hover:text-gold transition-colors whitespace-pre-line mt-1"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-sans text-bianco whitespace-pre-line mt-1">
                      {item.value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Visit CTA */}
            <motion.div
              variants={fadeUp}
              className="pt-8 border-t border-gold/20"
            >
              <h4 className="font-serif text-xl text-bianco mb-3">
                Vieni a trovarci
              </h4>
              <p className="font-sans text-sm text-bianco/60 leading-relaxed mb-4">
                Organizziamo visite guidate dell&apos;azienda e degustazioni
                su prenotazione.
              </p>
              <Button variant="ghost" className="text-gold">
                Prenota una visita
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder="La tua email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="Il tuo numero"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    Oggetto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={cn(inputStyles, 'appearance-none cursor-pointer')}
                  >
                    {subjects.map((subject) => (
                      <option
                        key={subject.value}
                        value={subject.value}
                        className="bg-nero"
                      >
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                >
                  Messaggio *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={cn(inputStyles, 'resize-none')}
                  placeholder="Come possiamo aiutarti?"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-bianco/40">
                  * Campi obbligatori
                </p>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'btn-primary',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      'Invio in corso...'
                    ) : (
                      <>
                        Invia messaggio
                        <Send size={16} />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              {/* Success message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-forest bg-forest/20 text-center"
                >
                  <p className="font-sans text-sm text-bianco">
                    Grazie per il tuo messaggio! Ti risponderemo al più presto.
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
