// Valori nutrizionali medi per 100 g / 100 ml (Reg. UE 1169/2011, All. XV)
export interface NutritionFacts {
  per: '100g' | '100ml'
  energyKj: number
  energyKcal: number
  fat: number
  saturatedFat: number
  carbohydrates: number
  sugars: number
  protein: number
  salt: number
}

// Informazioni alimentari obbligatorie da mostrare prima dell'acquisto
// nella vendita a distanza (Reg. UE 1169/2011, artt. 9 e 14)
export interface FoodInfo {
  legalName: string // denominazione legale dell'alimento
  ingredients: string // elenco ingredienti, allergeni in MAIUSCOLO
  allergens: string[] // allergeni All. II (es. 'Glutine')
  netQuantity: string // quantità netta formale (es. '500 g', '0,5 L e')
  storage: string // condizioni di conservazione
  operator: string // nome e indirizzo dell'OSA (operatore settore alimentare)
  originLabel: string // indicazione d'origine come da etichetta
  organicCode?: string // codice organismo di controllo bio (es. IT-BIO-006)
  organicOrigin?: string // 'Agricoltura Italia' / 'Agricoltura UE' ...
  nutrition?: NutritionFacts // assente solo se esente ex All. V
  extraLabel?: string[] // diciture aggiuntive obbligatorie (campagna olearia, categoria olio, ...)
}

export interface Product {
  id: string
  name: string
  subtitle: string
  description: string
  price: number
  image: string
  images?: string[] // Array of images for gallery (front, back, etc.)
  imagePosition?: string // CSS object-position value (e.g., 'center top', 'center 30%')
  category: 'olio' | 'pasta' | 'farina' | 'conserve' | 'box'
  details: {
    origin: string
    certification: string[]
    weight: string
    harvest?: string
  }
  foodInfo?: FoodInfo
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface NavItem {
  label: string
  labelKey: string
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

// Dati per l'emissione della fattura (richiesta al momento dell'ordine,
// art. 22 DPR 633/72: nel commercio elettronico indiretto la fattura è
// emessa solo se richiesta dal cliente non oltre l'effettuazione dell'operazione)
export interface BillingInfo {
  requested: boolean
  type: 'privato' | 'azienda'
  codiceFiscale: string
  businessName: string
  partitaIva: string
  sdiCode: string
  pecEmail: string
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
