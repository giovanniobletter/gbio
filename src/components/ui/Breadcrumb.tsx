'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const locale = useLocale()

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em]', className)}>
      <Link
        href={`/${locale}`}
        className="text-bianco/50 hover:text-gold transition-colors duration-300"
      >
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight size={12} className="text-gold/30" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-bianco/50 hover:text-gold transition-colors duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
