import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products, getProductById, getProductsByCategory } from '@/data/products'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const product = getProductById(id)

  if (!product) {
    return { title: locale === 'en' ? 'Product not found' : 'Prodotto non trovato' }
  }

  const title = `${product.name} ${product.subtitle} — GBiO`
  const description = product.description
  const url = `https://gbio.it/${locale}/prodotti/${product.id}`
  const image = `https://gbio.it${product.image}`

  return {
    title: `${product.name} ${product.subtitle}`,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: locale === 'en' ? 'en_GB' : 'it_IT',
      siteName: 'GBiO',
      images: [{ url: image, alt: `${product.name} — GBiO` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  // Related products: same category, excluding current, max 4
  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const productsLabel = locale === 'en' ? 'Products' : 'Prodotti'

  // JSON-LD for this product
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${product.name} — ${product.subtitle}`,
        description: product.description,
        image: `https://gbio.it${product.image}`,
        brand: { '@type': 'Brand', name: 'GBiO' },
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `https://gbio.it/${locale}/prodotti/${product.id}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://gbio.it/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: productsLabel,
            item: `https://gbio.it/${locale}/#prodotti`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${product.name} ${product.subtitle}`,
            item: `https://gbio.it/${locale}/prodotti/${product.id}`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={related} />
    </>
  )
}
