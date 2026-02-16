'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'leaflet/dist/leaflet.css'

interface Location {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  type: 'comune' | 'field'
}

const locations: Location[] = [
  {
    id: 'moscufo',
    name: 'Moscufo',
    description: "Città dell'Olio. Cuore del Triangolo d&apos;Oro.",
    lat: 42.4219,
    lng: 14.0564,
    type: 'comune',
  },
  {
    id: 'pianella',
    name: 'Pianella',
    description: "Città dell'Olio. Terroir unico per l'extravergine.",
    lat: 42.3997,
    lng: 14.0458,
    type: 'comune',
  },
  {
    id: 'loreto',
    name: 'Loreto Aprutino',
    description: 'DOP dal 1996. Frantoio Valentini.',
    lat: 42.4364,
    lng: 13.9847,
    type: 'comune',
  },
  {
    id: 'cepagatti',
    name: 'Cepagatti',
    description: 'I nostri 50 ettari biologici.',
    lat: 42.3697,
    lng: 14.0761,
    type: 'field',
  },
]

// Simplified Abruzzo region outline (approximate coordinates)
const abruzzoOutline: [number, number][] = [
  [42.92, 13.19], // North-west
  [42.89, 13.92], // North
  [42.47, 14.22], // North-east coast
  [42.08, 14.71], // East coast (Vasto area)
  [41.87, 14.38], // South-east
  [41.72, 14.11], // South
  [41.86, 13.72], // South-west
  [42.09, 13.36], // West
  [42.46, 13.19], // North-west
  [42.92, 13.19], // Close polygon
]

// Italy center for initial view
const ITALY_CENTER: [number, number] = [42.5, 12.5]
const ABRUZZO_CENTER: [number, number] = [42.35, 13.9]
const PESCARA_CENTER: [number, number] = [42.41, 14.03]

// Minimal type definitions for Leaflet to avoid SSR issues
interface LeafletMap {
  remove: () => void
  flyTo: (center: [number, number], zoom: number, options?: { duration: number }) => void
}

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const [activeLocation, setActiveLocation] = useState<Location | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<'italy' | 'abruzzo' | 'pescara'>('italy')

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamic import for Leaflet (avoid SSR issues)
    const initMap = async () => {
      const L = (await import('leaflet')).default

      if (!mapRef.current) return

      // Initialize map with Italy view
      const map = L.map(mapRef.current, {
        center: ITALY_CENTER,
        zoom: 5.5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      })

      // Dark style tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Abruzzo region polygon (highlighted)
      const abruzzoPolygon = L.polygon(abruzzoOutline, {
        color: '#c9a961',
        weight: 2,
        fillColor: '#c9a961',
        fillOpacity: 0.2,
        className: 'abruzzo-region',
      }).addTo(map)

      // Add click handler to Abruzzo polygon
      abruzzoPolygon.on('click', () => {
        map.flyTo(PESCARA_CENTER, 11, { duration: 1.5 })
        setZoomLevel('pescara')
      })

      // Hover effects for Abruzzo
      abruzzoPolygon.on('mouseover', () => {
        abruzzoPolygon.setStyle({ fillOpacity: 0.4 })
      })
      abruzzoPolygon.on('mouseout', () => {
        abruzzoPolygon.setStyle({ fillOpacity: 0.2 })
      })

      // Custom marker icons
      const comuneIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #c9a961;
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(201, 169, 97, 0.5);
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const fieldIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #c9a961;
            border: 3px solid #c9a961;
            border-radius: 50%;
            box-shadow: 0 0 30px rgba(201, 169, 97, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 8px; height: 8px; background: #0a0a0a; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      // Add markers (hidden initially)
      const markers: { setOpacity: (opacity: number) => void }[] = []
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: location.type === 'field' ? fieldIcon : comuneIcon,
          opacity: 0,
        }).addTo(map)

        marker.on('mouseover', () => setActiveLocation(location))
        marker.on('mouseout', () => setActiveLocation(null))
        marker.on('click', () => {
          map.flyTo([location.lat, location.lng], 13, { duration: 1.5 })
        })

        markers.push(marker)
      })

      // Draw triangle connecting the comuni (hidden initially)
      const triangleCoords: [number, number][] = [
        [locations[0].lat, locations[0].lng],
        [locations[1].lat, locations[1].lng],
        [locations[2].lat, locations[2].lng],
        [locations[0].lat, locations[0].lng],
      ]

      const triangle = L.polyline(triangleCoords, {
        color: '#c9a961',
        weight: 2,
        opacity: 0,
        dashArray: '10, 10',
      }).addTo(map)

      // Line from triangle to Cepagatti
      const fieldLine = L.polyline([
        [42.41, 14.03],
        [locations[3].lat, locations[3].lng],
      ], {
        color: '#c9a961',
        weight: 1,
        opacity: 0,
        dashArray: '5, 10',
      }).addTo(map)

      // Add zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Listen to zoom changes
      map.on('zoomend', () => {
        const currentZoom = map.getZoom()
        if (currentZoom >= 10) {
          // Show markers and lines when zoomed in
          markers.forEach(m => m.setOpacity(1))
          triangle.setStyle({ opacity: 0.6 })
          fieldLine.setStyle({ opacity: 0.4 })
          setZoomLevel('pescara')
        } else if (currentZoom >= 7) {
          // Partially visible
          markers.forEach(m => m.setOpacity(0.5))
          triangle.setStyle({ opacity: 0.3 })
          fieldLine.setStyle({ opacity: 0.2 })
          setZoomLevel('abruzzo')
        } else {
          // Hide markers when zoomed out
          markers.forEach(m => m.setOpacity(0))
          triangle.setStyle({ opacity: 0 })
          fieldLine.setStyle({ opacity: 0 })
          setZoomLevel('italy')
        }
      })

      mapInstanceRef.current = map
      setIsLoaded(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const handleZoomToItaly = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ITALY_CENTER, 5.5, { duration: 1.5 })
      setZoomLevel('italy')
    }
  }

  const handleZoomToAbruzzo = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(PESCARA_CENTER, 11, { duration: 1.5 })
      setZoomLevel('pescara')
    }
  }

  return (
    <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full overflow-hidden border border-gold/30"
      >
        <div ref={mapRef} className="w-full h-full" />

        {/* Gold overlay gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-nero/50 via-transparent to-nero/30" />
      </motion.div>

      {/* Call to action overlay - shown when at Italy level */}
      <AnimatePresence>
        {zoomLevel === 'italy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[999]"
          >
            <div className="text-center">
              <p className="font-sans text-xs text-gold/80 uppercase tracking-[0.3em] mb-2">
                Clicca sull&apos;Abruzzo
              </p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 mx-auto rounded-full bg-gold/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {activeLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-nero/95 border border-gold/50 px-6 py-4 min-w-[250px] backdrop-blur-sm z-[1000]"
          >
            <p className="font-serif text-lg text-gold">{activeLocation.name}</p>
            <p className="font-sans text-sm text-bianco/70 mt-1">{activeLocation.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]"
      >
        <button
          onClick={handleZoomToItaly}
          className={`font-sans text-xs border px-3 py-1 backdrop-blur-sm transition-colors ${
            zoomLevel === 'italy'
              ? 'text-gold border-gold bg-gold/20'
              : 'text-gold/70 border-gold/30 bg-nero/80 hover:text-gold'
          }`}
        >
          Italia
        </button>
        <button
          onClick={handleZoomToAbruzzo}
          className={`font-sans text-xs border px-3 py-1 backdrop-blur-sm transition-colors ${
            zoomLevel === 'pescara'
              ? 'text-gold border-gold bg-gold/20'
              : 'text-gold/70 border-gold/30 bg-nero/80 hover:text-gold'
          }`}
        >
          I Nostri Campi
        </button>
      </motion.div>

      {/* Legend - only show when zoomed in */}
      <AnimatePresence>
        {zoomLevel === 'pescara' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 right-4 space-y-2 bg-nero/80 backdrop-blur-sm p-3 border border-gold/20 z-[1000]"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/90 border border-gold/50" />
              <span className="font-sans text-xs text-bianco/50">Comuni DOP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gold border border-gold" />
              <span className="font-sans text-xs text-bianco/50">I nostri campi</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title overlay - changes based on zoom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 z-[1000]"
      >
        <AnimatePresence mode="wait">
          {zoomLevel === 'italy' ? (
            <motion.div
              key="italy"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="font-sans text-xs text-gold/70 uppercase tracking-wider">La Nostra Terra</p>
              <p className="font-serif text-lg text-bianco">Italia</p>
            </motion.div>
          ) : (
            <motion.div
              key="abruzzo"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="font-sans text-xs text-gold/70 uppercase tracking-wider">Triangolo d&apos;Oro</p>
              <p className="font-serif text-lg text-bianco">Provincia di Pescara</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
