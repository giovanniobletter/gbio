export interface Product {
  id: string
  name: string
  subtitle: string
  description: string
  price: number
  image: string
  category: 'olio' | 'pasta' | 'farina' | 'conserve'
  details: {
    origin: string
    certification: string[]
    weight: string
    harvest?: string
  }
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface NavItem {
  label: string
  href: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  subject: 'info' | 'ordini' | 'collaborazioni' | 'altro'
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
  notes?: string
}

export interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  addresses: ShippingAddress[]
  defaultAddressIndex?: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
