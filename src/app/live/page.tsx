import type { Metadata } from 'next'
import { LiveDashboard } from './LiveDashboard'

export const metadata: Metadata = {
  title: 'GBiO — Live',
  robots: { index: false, follow: false },
}

export default function LivePage() {
  return <LiveDashboard />
}
