'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Hero } from '@/components/sections/Hero'
import { BoxedSets } from '@/components/sections/BoxedSets'
import { Heritage } from '@/components/sections/Heritage'
import { Products } from '@/components/sections/Products'
import { Territory } from '@/components/sections/Territory'
import { Certifications } from '@/components/sections/Certifications'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <CartDrawer />

      <main>
        <Hero />
        <BoxedSets />
        <Products />
        <Certifications />
        <Territory />
        <Heritage />
        <ProductShowcase />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
