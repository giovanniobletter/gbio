'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { User, ShippingAddress } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_ADDRESS'; payload: ShippingAddress }
  | { type: 'UPDATE_ADDRESS'; payload: { index: number; address: ShippingAddress } }
  | { type: 'DELETE_ADDRESS'; payload: number }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: number }

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  addAddress: (address: ShippingAddress) => void
  updateAddress: (index: number, address: ShippingAddress) => void
  deleteAddress: (index: number) => void
  setDefaultAddress: (index: number) => void
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'gbio-auth'
const USERS_STORAGE_KEY = 'gbio-users'

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case 'UPDATE_USER':
      if (!state.user) return state
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case 'ADD_ADDRESS':
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.payload],
        },
      }

    case 'UPDATE_ADDRESS':
      if (!state.user) return state
      const updatedAddresses = [...state.user.addresses]
      updatedAddresses[action.payload.index] = action.payload.address
      return {
        ...state,
        user: { ...state.user, addresses: updatedAddresses },
      }

    case 'DELETE_ADDRESS':
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter((_, i) => i !== action.payload),
          defaultAddressIndex:
            state.user.defaultAddressIndex === action.payload
              ? undefined
              : state.user.defaultAddressIndex,
        },
      }

    case 'SET_DEFAULT_ADDRESS':
      if (!state.user) return state
      return {
        ...state,
        user: { ...state.user, defaultAddressIndex: action.payload },
      }

    default:
      return state
  }
}

// Simulated user database (in production, this would be an API)
function getStoredUsers(): Record<string, { user: User; passwordHash: string }> {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

function saveStoredUsers(users: Record<string, { user: User; passwordHash: string }>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

// Simple hash function for demo (in production, use proper hashing on server)
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Load user session on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const { userId } = JSON.parse(stored)
          const users = getStoredUsers()
          if (users[userId]) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: users[userId].user })
            return
          }
        }
      } catch (e) {
        console.error('Failed to load auth session')
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    loadSession()
  }, [])

  // Save user data when it changes
  useEffect(() => {
    if (state.user) {
      const users = getStoredUsers()
      if (users[state.user.id]) {
        users[state.user.id].user = state.user
        saveStoredUsers(users)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: state.user.id }))
    }
  }, [state.user])

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const users = getStoredUsers()
    const userEntry = Object.values(users).find(
      (entry) => entry.user.email.toLowerCase() === email.toLowerCase()
    )

    if (!userEntry) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: 'Email non registrata' }
    }

    if (userEntry.passwordHash !== simpleHash(password)) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: 'Password non corretta' }
    }

    dispatch({ type: 'LOGIN_SUCCESS', payload: userEntry.user })
    return { success: true }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const users = getStoredUsers()
    const existingUser = Object.values(users).find(
      (entry) => entry.user.email.toLowerCase() === data.email.toLowerCase()
    )

    if (existingUser) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: 'Email già registrata' }
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      addresses: [],
    }

    users[newUser.id] = {
      user: newUser,
      passwordHash: simpleHash(data.password),
    }
    saveStoredUsers(users)

    dispatch({ type: 'LOGIN_SUCCESS', payload: newUser })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'LOGOUT' })
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    dispatch({ type: 'UPDATE_USER', payload: data })
    return { success: true }
  }, [])

  const addAddress = useCallback((address: ShippingAddress) => {
    dispatch({ type: 'ADD_ADDRESS', payload: address })
  }, [])

  const updateAddress = useCallback((index: number, address: ShippingAddress) => {
    dispatch({ type: 'UPDATE_ADDRESS', payload: { index, address } })
  }, [])

  const deleteAddress = useCallback((index: number) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: index })
  }, [])

  const setDefaultAddress = useCallback((index: number) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: index })
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getStoredUsers()
    const userEntry = Object.values(users).find(
      (entry) => entry.user.email.toLowerCase() === email.toLowerCase()
    )

    if (!userEntry) {
      // Don't reveal if email exists for security
      return { success: true }
    }

    // In production, send email with reset link
    // For demo, we just return success
    return { success: true }
  }, [])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!state.user) {
      return { success: false, error: 'Non autenticato' }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = getStoredUsers()
    const userEntry = users[state.user.id]

    if (!userEntry || userEntry.passwordHash !== simpleHash(currentPassword)) {
      return { success: false, error: 'Password attuale non corretta' }
    }

    userEntry.passwordHash = simpleHash(newPassword)
    saveStoredUsers(users)

    return { success: true }
  }, [state.user])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
