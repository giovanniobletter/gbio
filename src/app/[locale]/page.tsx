'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Hero } from '@/components/sections/Hero'
import { Heritage } from '@/components/sections/Heritage'
import { Products } from '@/components/sections/Products'
import { Territory } from '@/components/sections/Territory'
import { Certifications } from '@/components/sections/Certifications'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <ScrollProgress />
      <Header />
      <CartDrawer />

      <main>
        <Hero />
        <Heritage />
        <Products />
        <Territory />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
