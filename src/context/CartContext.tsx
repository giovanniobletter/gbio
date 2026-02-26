'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from 'react'
import { CartItem, Product } from '@/types'
import { ShippingZone, getShippingCost } from '@/lib/shipping'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  shippingZone: ShippingZone
  setShippingZone: (zone: ShippingZone) => void
  freeShippingThreshold: number | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.payload.id
          ),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'LOAD_CART':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })
  const [shippingZone, setShippingZone] = useState<ShippingZone>('italia')

  // Load cart and shipping zone from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedCart = localStorage.getItem('gbio-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch (e) {
        console.error('Failed to load cart from localStorage')
      }
    }
    const savedZone = localStorage.getItem('gbio-shipping-zone')
    if (savedZone === 'italia' || savedZone === 'europa' || savedZone === 'extra_eu') {
      setShippingZone(savedZone)
    }
  }, [])

  // Save cart to localStorage on changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('gbio-cart', JSON.stringify(state.items))
  }, [state.items])

  // Save shipping zone to localStorage on changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('gbio-shipping-zone', shippingZone)
  }, [shippingZone])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [state.isOpen])

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' })
  }, [])

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' })
  }, [])

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' })
  }, [])

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const { cost: shipping, freeThreshold: freeShippingThreshold } = getShippingCost(shippingZone, subtotal)

  const total = subtotal + shipping

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        itemCount,
        subtotal,
        shipping,
        total,
        shippingZone,
        setShippingZone,
        freeShippingThreshold,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
