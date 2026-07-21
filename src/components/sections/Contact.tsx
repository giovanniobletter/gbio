'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import { luxuryFadeUp, luxurySlideIn, luxurySlideInRight, luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { metaTrack } from '@/lib/metaPixel'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'

export function Contact() {
  const t = useTranslations('contact')

  const contactInfo = [
    {
      icon: MapPin,
      label: t('address'),
      value: t('addressValue'),
    },
    {
      icon: Phone,
      label: t('phone'),
      value: t('phoneValue'),
      href: 'tel:+393926362254',
    },
    {
      icon: Mail,
      label: t('email'),
      value: 'customerservice@gbio.it',
      href: 'mailto:customerservice@gbio.it',
    },
    {
      icon: Clock,
      label: t('hours'),
      value: t('hoursValue'),
    },
  ]

  const subjects = [
    { value: 'info', label: t('form.subjects.info') },
    { value: 'ordini', label: t('form.subjects.orders') },
    { value: 'horeca', label: t('form.subjects.horeca') },
    { value: 'collaborazioni', label: t('form.subjects.collaborations') },
    { value: 'altro', label: t('form.subjects.other') },
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'info',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || t('errorGeneric'))
      }

      setIsSubmitted(true)
      metaTrack('Lead')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'info',
        message: '',
      })

      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'))
    } finally {
      setIsSubmitting(false)
    }
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
    focus:border-gold focus:outline-none focus:glow-gold transition-all duration-500
  `

  return (
    <section id="contatti" className="section-padding bg-nero relative overflow-hidden">
      {/* Subtle texture overlay */}
      <TextureOverlay variant="linen" opacity={0.02} />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-forest-dark/20 to-transparent" />

      <div className="container-custom relative z-10">
        <SectionTitle
          eyebrow={t('sectionEyebrow')}
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
        />

        {/* Ornate divider */}
        <div className="mt-12">
          <OrnateRule variant="fleur" />
        </div>

        <div className="mt-12 grid lg:grid-cols-5 gap-16">
          {/* Contact Info */}
          <motion.div
            variants={luxurySlideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.div
              variants={luxuryStaggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={luxuryStaggerItem}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 border border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 group-hover:glow-gold transition-all duration-700">
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
                variants={luxuryStaggerItem}
                className="pt-8 border-t border-gold/20"
              >
                <h4 className="font-serif text-xl text-bianco mb-3 text-shadow-luxe">
                  {t('experiencesTitle')}
                </h4>
                <p className="font-sans text-sm text-bianco/60 leading-relaxed mb-4">
                  {t('experiencesText')}
                </p>
                <Button variant="ghost" className="text-gold hover:glow-gold transition-all duration-700">
                  {t('experiencesCta')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={luxurySlideInRight}
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
                    {t('form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    {t('form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    {t('form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder={t('form.phonePlaceholder')}
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2"
                  >
                    {t('form.subject')}
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
                  {t('form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={cn(inputStyles, 'resize-none')}
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-bianco/40">
                  * {t('form.required')}
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
                      t('form.sending')
                    ) : (
                      <>
                        {t('form.submit')}
                        <Send size={16} />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-burgundy bg-burgundy/20 text-center"
                >
                  <p className="font-sans text-sm text-bianco">{error}</p>
                </motion.div>
              )}

              {/* Success message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-forest bg-forest/20 text-center"
                >
                  <p className="font-sans text-sm text-bianco">
                    {t('form.success')}
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
