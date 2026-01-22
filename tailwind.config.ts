import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a961',
          light: '#d4b872',
          dark: '#b89a52',
          champagne: '#f7e7ce',
        },
        burgundy: {
          DEFAULT: '#7D0E09',
          light: '#9a1510',
          dark: '#5c0a07',
        },
        forest: {
          DEFAULT: '#2c3e2f',
          light: '#3d5240',
          dark: '#1e2a20',
        },
        nero: '#0a0a0a',
        bianco: '#ffffff',
        ivory: '#fffff0',
        cream: '#fdfbf7',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        chinese: ['var(--font-noto-sc)', 'Noto Sans SC', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'hero': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'title': ['clamp(2rem, 4vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'subtitle': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      letterSpacing: {
        'luxe': '0.35em',
        'wide-luxe': '0.5em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'slide-in': 'slideIn 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'grain': 'grain 8s steps(10) infinite',
        // Luxury animations (slower)
        'luxury-fade': 'fadeIn 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'luxury-fade-up': 'luxuryFadeUp 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'luxury-reveal': 'luxuryReveal 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'line-draw': 'lineDraw 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        // Luxury keyframes
        luxuryFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        luxuryReveal: {
          '0%': { opacity: '0', transform: 'translateY(60px) scale(0.98)' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        lineDraw: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(201, 169, 97, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(201, 169, 97, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #c9a961 0%, #d4b872 50%, #b89a52 100%)',
        'gradient-gold-shimmer': 'linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.4), transparent)',
        'gradient-luxury': 'linear-gradient(135deg, #b89a52 0%, #c9a961 25%, #f7e7ce 50%, #c9a961 75%, #b89a52 100%)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '1200': '1200ms',
        '1400': '1400ms',
        '1600': '1600ms',
        '1800': '1800ms',
        '2000': '2000ms',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 169, 97, 0.3)',
        'gold-lg': '0 0 40px rgba(201, 169, 97, 0.4)',
        'inner-gold': 'inset 0 0 30px rgba(201, 169, 97, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
