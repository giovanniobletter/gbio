'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Location {
  id: string
  name: string
  description: string
  x: number
  y: number
  type: 'comune' | 'field'
}

const locations: Location[] = [
  {
    id: 'loreto',
    name: 'Loreto Aprutino',
    description: 'DOP dal 1996. Frantoio storico.',
    x: 38,
    y: 35,
    type: 'comune',
  },
  {
    id: 'moscufo',
    name: 'Moscufo',
    description: "Città dell'Olio. Cuore del Triangolo d'Oro.",
    x: 55,
    y: 45,
    type: 'comune',
  },
  {
    id: 'pianella',
    name: 'Pianella',
    description: "Città dell'Olio. Terroir unico.",
    x: 45,
    y: 58,
    type: 'comune',
  },
  {
    id: 'cepagatti',
    name: 'Cepagatti',
    description: 'I nostri 50 ettari biologici.',
    x: 62,
    y: 68,
    type: 'field',
  },
]

export function IllustratedMap() {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null)

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* SVG Map Container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative aspect-[4/5] w-full"
      >
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(201, 169, 97, 0.1))' }}
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c9a961" />
              <stop offset="100%" stopColor="#a08540" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Stylized Abruzzo region outline */}
          <motion.path
            d="M 20 15
               Q 35 10, 50 12
               Q 65 14, 75 25
               Q 82 35, 85 50
               Q 87 65, 80 80
               Q 70 95, 55 100
               Q 40 105, 25 95
               Q 15 85, 12 70
               Q 10 55, 15 40
               Q 18 25, 20 15 Z"
            fill="rgba(201, 169, 97, 0.05)"
            stroke="#c9a961"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Mountain range - Gran Sasso stylized */}
          <motion.path
            d="M 15 35 L 25 20 L 32 28 L 40 15 L 48 25 L 55 18 L 60 30 L 65 25"
            fill="none"
            stroke="#c9a961"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Adriatic coast line - waves */}
          <motion.path
            d="M 78 30 Q 82 35, 80 40 Q 78 45, 82 50 Q 86 55, 83 60 Q 80 65, 84 70 Q 88 75, 82 80"
            fill="none"
            stroke="#c9a961"
            strokeWidth="1"
            strokeOpacity="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />

          {/* Triangle connecting the comuni - Triangolo d'Oro */}
          <motion.path
            d={`M ${locations[0].x} ${locations[0].y}
                L ${locations[1].x} ${locations[1].y}
                L ${locations[2].x} ${locations[2].y} Z`}
            fill="rgba(201, 169, 97, 0.15)"
            stroke="#c9a961"
            strokeWidth="1"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            whileInView={{ pathLength: 1, fillOpacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1 }}
          />

          {/* Line to Cepagatti (fields) */}
          <motion.line
            x1={(locations[0].x + locations[1].x + locations[2].x) / 3}
            y1={(locations[0].y + locations[1].y + locations[2].y) / 3}
            x2={locations[3].x}
            y2={locations[3].y}
            stroke="#c9a961"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            strokeDasharray="3 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.5 }}
          />

          {/* Olive tree decorative elements */}
          {[
            { x: 28, y: 48 },
            { x: 48, y: 38 },
            { x: 68, y: 52 },
            { x: 32, y: 70 },
            { x: 72, y: 42 },
          ].map((tree, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.5, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.8 + i * 0.1 }}
            >
              <ellipse cx={tree.x} cy={tree.y - 1} rx="2" ry="1.5" fill="#c9a961" opacity="0.4" />
              <line
                x1={tree.x}
                y1={tree.y}
                x2={tree.x}
                y2={tree.y + 2.5}
                stroke="#c9a961"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </motion.g>
          ))}

          {/* Location markers */}
          {locations.map((location, index) => (
            <motion.g
              key={location.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 2 + index * 0.2 }}
              onMouseEnter={() => setActiveLocation(location)}
              onMouseLeave={() => setActiveLocation(null)}
              style={{ cursor: 'pointer' }}
              filter="url(#glow)"
            >
              {/* Pulse animation for markers */}
              <motion.circle
                cx={location.x}
                cy={location.y}
                r={location.type === 'field' ? 5 : 4}
                fill="transparent"
                stroke="#c9a961"
                strokeWidth="1"
                animate={{
                  r: location.type === 'field' ? [5, 8, 5] : [4, 7, 4],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />

              {/* Main marker */}
              <circle
                cx={location.x}
                cy={location.y}
                r={location.type === 'field' ? 3.5 : 2.5}
                fill={location.type === 'field' ? '#c9a961' : 'rgba(255,255,255,0.95)'}
                stroke="#c9a961"
                strokeWidth="1"
              />

              {/* Inner dot for field marker */}
              {location.type === 'field' && (
                <circle
                  cx={location.x}
                  cy={location.y}
                  r="1.2"
                  fill="#1a1a1a"
                />
              )}
            </motion.g>
          ))}

          {/* Labels */}
          {locations.map((location, index) => (
            <motion.text
              key={`label-${location.id}`}
              x={location.x + (location.x > 50 ? -5 : 6)}
              y={location.y + (location.y > 50 ? -5 : 2)}
              textAnchor={location.x > 50 ? 'end' : 'start'}
              className="font-sans"
              fill="#c9a961"
              fontSize="3.5"
              fontWeight="500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 2.5 + index * 0.15 }}
            >
              {location.name}
            </motion.text>
          ))}

          {/* Compass */}
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 3 }}
          >
            <circle cx="90" cy="108" r="6" fill="none" stroke="#c9a961" strokeWidth="0.5" opacity="0.5" />
            <text x="90" y="105" textAnchor="middle" fill="#c9a961" fontSize="3" opacity="0.8">N</text>
            <line x1="90" y1="106" x2="90" y2="113" stroke="#c9a961" strokeWidth="0.8" opacity="0.6" />
            <path d="M 88.5 106.5 L 90 103 L 91.5 106.5 Z" fill="#c9a961" opacity="0.7" />
          </motion.g>

          {/* Title */}
          <motion.text
            x="50"
            y="8"
            textAnchor="middle"
            className="font-serif"
            fill="#c9a961"
            fontSize="5"
            fontWeight="400"
            initial={{ opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Triangolo d&apos;Oro
          </motion.text>

          <motion.text
            x="50"
            y="13"
            textAnchor="middle"
            className="font-sans"
            fill="#ffffff"
            fontSize="3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Provincia di Pescara
          </motion.text>
        </svg>

        {/* Tooltip */}
        {activeLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-nero/95 border border-gold/50 px-6 py-4 min-w-[220px] backdrop-blur-sm z-10"
          >
            <p className="font-serif text-lg text-gold">{activeLocation.name}</p>
            <p className="font-sans text-sm text-bianco/70 mt-1">{activeLocation.description}</p>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 3 }}
          className="absolute bottom-4 right-4 space-y-2 bg-nero/60 backdrop-blur-sm p-3 border border-gold/20"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/90 border border-gold/50" />
            <span className="font-sans text-[10px] text-bianco/50 uppercase tracking-wider">Comuni DOP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gold border border-gold" />
            <span className="font-sans text-[10px] text-bianco/50 uppercase tracking-wider">I nostri campi</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
