// Meta Pixel — caricato SOLO dopo il consenso cookie (vedi CookieBanner).
// Senza NEXT_PUBLIC_META_PIXEL_ID tutte le funzioni sono no-op.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function loadMetaPixel() {
  if (!PIXEL_ID || typeof window === 'undefined' || window.fbq) return

  // Base code ufficiale Meta: crea lo stub fbq (accoda le chiamate finché
  // fbevents.js non è caricato), poi init + PageView iniziale
  const script = document.createElement('script')
  script.innerHTML =
    `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
    `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
    `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
    `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,` +
    `document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
    `fbq('init','${PIXEL_ID}');fbq('track','PageView');`
  document.head.appendChild(script)
}

/** Eventi standard Meta (AddToCart, Purchase, ...). No-op senza consenso. */
export function metaTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return
  if (params) {
    window.fbq('track', event, params)
  } else {
    window.fbq('track', event)
  }
}

/** PageView per le navigazioni client-side (il primo lo fa loadMetaPixel). */
export function metaPageView() {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'PageView')
}

// Revoca del consenso: rimuove i cookie del Pixel (stesso criterio di clearGACookies)
export function clearMetaCookies() {
  const domain = window.location.hostname.replace(/^www\./, '')
  ;['_fbp', '_fbc'].forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })
}
