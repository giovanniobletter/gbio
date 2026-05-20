'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  User,
  MapPin,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { Header } from '@/components/layout/Header'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { ShippingAddress } from '@/types'

type TabType = 'profile' | 'addresses' | 'orders' | 'settings'

const provinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno',
  'Asti', 'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento',
  'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari',
  'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti',
  'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara',
  'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia',
  'Grosseto', 'Imperia', 'Isernia', 'L\'Aquila', 'La Spezia', 'Latina', 'Lecce',
  'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata', 'Mantova', 'Massa-Carrara',
  'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza', 'Napoli', 'Novara',
  'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia',
  'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone',
  'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia',
  'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona', 'Siena',
  'Siracusa', 'Sondrio', 'Sud Sardegna', 'Taranto', 'Teramo', 'Terni', 'Torino',
  'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia',
  'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
]

export default function AccountPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('account')
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    changePassword,
  } = useAuth()

  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null)
  const [addressData, setAddressData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Italia',
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
      })
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login?returnUrl=/${locale}/account`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nero flex items-center justify-center">
        <Loader2 size={32} className="text-gold animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const handleProfileSave = async () => {
    setIsSaving(true)
    const result = await updateProfile({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone || undefined,
    })

    if (result.success) {
      setMessage({ type: 'success', text: t('successProfileSaved') })
      setIsEditing(false)
    } else {
      setMessage({ type: 'error', text: result.error || t('errorSaving') })
    }
    setIsSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAddressSave = () => {
    if (editingAddressIndex !== null) {
      updateAddress(editingAddressIndex, addressData)
    } else {
      addAddress(addressData)
    }
    resetAddressForm()
    setMessage({ type: 'success', text: t('successAddressSaved') })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAddressEdit = (index: number) => {
    setAddressData(user.addresses[index])
    setEditingAddressIndex(index)
    setShowAddressForm(true)
  }

  const handleAddressDelete = (index: number) => {
    deleteAddress(index)
    setMessage({ type: 'success', text: t('successAddressDeleted') })
    setTimeout(() => setMessage(null), 3000)
  }

  const resetAddressForm = () => {
    setAddressData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Italia',
    })
    setEditingAddressIndex(null)
    setShowAddressForm(false)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t('errorPasswordMismatch') })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: t('errorPasswordTooShort') })
      return
    }

    setIsSaving(true)
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)

    if (result.success) {
      setMessage({ type: 'success', text: t('successPasswordSaved') })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setMessage({ type: 'error', text: result.error || t('errorPasswordChange') })
    }
    setIsSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}`)
  }

  const inputStyles = `
    w-full bg-transparent border border-gold/30 px-4 py-3
    font-sans text-bianco placeholder:text-bianco/30
    focus:border-gold focus:outline-none transition-colors duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const tabs = [
    { id: 'profile' as const, label: t('tabs.profile'), icon: User },
    { id: 'addresses' as const, label: t('tabs.addresses'), icon: MapPin },
    { id: 'orders' as const, label: t('tabs.orders'), icon: Package },
    { id: 'settings' as const, label: t('tabs.settings'), icon: Settings },
  ]

  return (
    <>
      <CustomCursor />
      <Header />
      <CartDrawer />

      <main className="min-h-screen bg-nero pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl text-bianco mb-2">
              {t('greeting', { name: user.firstName })}
            </h1>
            <p className="font-sans text-bianco/60">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'mb-6 p-4 border text-sm',
                  message.type === 'success'
                    ? 'border-green-400/50 bg-green-400/10 text-green-400'
                    : 'border-red-400/50 bg-red-400/10 text-red-400'
                )}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 font-sans text-sm transition-all',
                      activeTab === tab.id
                        ? 'bg-gold/10 text-gold border-l-2 border-gold'
                        : 'text-bianco/60 hover:text-bianco hover:bg-bianco/5'
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                    <ChevronRight size={16} className="ml-auto opacity-50" />
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 font-sans text-sm text-red-400 hover:bg-red-400/10 transition-all mt-4"
                >
                  <LogOut size={18} />
                  {t('logout')}
                </button>
              </nav>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="border border-gold/20 p-6 lg:p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-2xl text-bianco">
                        {t('profile.title')}
                      </h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                        >
                          <Edit2 size={16} />
                          <span className="text-sm">{t('edit')}</span>
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setIsEditing(false)
                              setProfileData({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                phone: user.phone || '',
                              })
                            }}
                            className="p-2 text-bianco/60 hover:text-bianco transition-colors"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={handleProfileSave}
                            disabled={isSaving}
                            className="p-2 text-gold hover:text-gold-light transition-colors"
                          >
                            {isSaving ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                          {t('profile.firstName')}
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, firstName: e.target.value })
                          }
                          disabled={!isEditing}
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                          {t('profile.lastName')}
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, lastName: e.target.value })
                          }
                          disabled={!isEditing}
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                          {t('profile.email')}
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className={cn(inputStyles, 'opacity-50')}
                        />
                        <p className="text-xs text-bianco/40 mt-1">
                          {t('profile.emailReadOnly')}
                        </p>
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                          {t('profile.phone')}
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({ ...profileData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className={inputStyles}
                          placeholder={t('profile.phonePlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gold/10">
                      <p className="font-sans text-xs text-bianco/40">
                        {t('memberSince', {
                          date: new Date(user.createdAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }),
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-2xl text-bianco">
                        {t('addresses.title')}
                      </h2>
                      {!showAddressForm && (
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                        >
                          <Plus size={16} />
                          <span className="text-sm">{t('addNew')}</span>
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {showAddressForm ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={addressData.firstName}
                              onChange={(e) =>
                                setAddressData({ ...addressData, firstName: e.target.value })
                              }
                              className={inputStyles}
                              placeholder={t('addresses.placeholders.firstName')}
                            />
                            <input
                              type="text"
                              value={addressData.lastName}
                              onChange={(e) =>
                                setAddressData({ ...addressData, lastName: e.target.value })
                              }
                              className={inputStyles}
                              placeholder={t('addresses.placeholders.lastName')}
                            />
                          </div>
                          <input
                            type="text"
                            value={addressData.address}
                            onChange={(e) =>
                              setAddressData({ ...addressData, address: e.target.value })
                            }
                            className={inputStyles}
                            placeholder={t('addresses.placeholders.address')}
                          />
                          <div className="grid md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              value={addressData.city}
                              onChange={(e) =>
                                setAddressData({ ...addressData, city: e.target.value })
                              }
                              className={inputStyles}
                              placeholder={t('addresses.placeholders.city')}
                            />
                            <select
                              value={addressData.province}
                              onChange={(e) =>
                                setAddressData({ ...addressData, province: e.target.value })
                              }
                              className={cn(inputStyles, 'appearance-none')}
                            >
                              <option value="" className="bg-nero">{t('addresses.placeholders.province')}</option>
                              {provinces.map((prov) => (
                                <option key={prov} value={prov} className="bg-nero">
                                  {prov}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={addressData.postalCode}
                              onChange={(e) =>
                                setAddressData({ ...addressData, postalCode: e.target.value })
                              }
                              className={inputStyles}
                              placeholder={t('addresses.placeholders.postalCode')}
                              maxLength={5}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="email"
                              value={addressData.email}
                              onChange={(e) =>
                                setAddressData({ ...addressData, email: e.target.value })
                              }
                              className={inputStyles}
                              placeholder={t('addresses.placeholders.email')}
                            />
                            <input
                              type="tel"
                              value={addressData.phone}
                              onChange={(e) =>
                                setAddressData({ ...addressData, phone: e.target.value })
                              }
                              className={inputStyles}
                              placeholder={t('addresses.placeholders.phone')}
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={resetAddressForm}
                              className="px-6 py-3 border border-gold/30 text-bianco/60 hover:text-bianco transition-colors"
                            >
                              {t('cancel')}
                            </button>
                            <button
                              onClick={handleAddressSave}
                              className="btn-primary"
                            >
                              <span>{t('addresses.saveAddress')}</span>
                            </button>
                          </div>
                        </motion.div>
                      ) : user.addresses.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <MapPin size={48} className="text-gold/30 mx-auto mb-4" />
                          <p className="font-sans text-bianco/60">
                            {t('addresses.empty')}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          {user.addresses.map((addr, index) => (
                            <div
                              key={index}
                              className={cn(
                                'p-4 border transition-colors',
                                user.defaultAddressIndex === index
                                  ? 'border-gold bg-gold/5'
                                  : 'border-gold/20 hover:border-gold/40'
                              )}
                            >
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-sans text-bianco">
                                    {addr.firstName} {addr.lastName}
                                  </p>
                                  <p className="font-sans text-sm text-bianco/60 mt-1">
                                    {addr.address}
                                    <br />
                                    {addr.postalCode} {addr.city} ({addr.province})
                                  </p>
                                  {user.defaultAddressIndex === index && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-gold/20 text-gold text-xs">
                                      {t('addresses.default')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleAddressEdit(index)}
                                    className="p-2 text-bianco/40 hover:text-gold transition-colors"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleAddressDelete(index)}
                                    className="p-2 text-bianco/40 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  {user.defaultAddressIndex !== index && (
                                    <button
                                      onClick={() => setDefaultAddress(index)}
                                      className="p-2 text-bianco/40 hover:text-gold transition-colors"
                                      title={t('addresses.setDefault')}
                                    >
                                      <Check size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-serif text-2xl text-bianco mb-6">
                      {t('orders.title')}
                    </h2>
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="text-gold/30 mx-auto mb-4" />
                      <p className="font-sans text-bianco/60 mb-4">
                        {t('orders.empty')}
                      </p>
                      <Link href={`/${locale}/#prodotti`} className="btn-primary inline-flex">
                        <span>{t('orders.goToProducts')}</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="font-serif text-2xl text-bianco mb-6">
                      {t('settings.title')}
                    </h2>

                    <div className="space-y-8">
                      {/* Change Password */}
                      <div>
                        <h3 className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
                          {t('settings.changePassword')}
                        </h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type={showPasswords ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className={cn(inputStyles, 'pr-12')}
                              placeholder={t('settings.currentPassword')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(!showPasswords)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-bianco/40 hover:text-gold transition-colors"
                            >
                              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className={inputStyles}
                            placeholder={t('settings.newPasswordPlaceholder')}
                          />
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className={inputStyles}
                            placeholder={t('settings.confirmNewPassword')}
                          />
                          <button
                            onClick={handlePasswordChange}
                            disabled={
                              isSaving ||
                              !passwordData.currentPassword ||
                              !passwordData.newPassword
                            }
                            className={cn(
                              'btn-primary',
                              (isSaving ||
                                !passwordData.currentPassword ||
                                !passwordData.newPassword) &&
                                'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {isSaving ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <span>{t('settings.updatePassword')}</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="pt-6 border-t border-gold/10">
                        <h3 className="font-sans text-sm uppercase tracking-[0.2em] text-red-400 mb-4">
                          {t('settings.dangerZone')}
                        </h3>
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirmDeleteAccount'))) {
                              logout()
                              router.push(`/${locale}`)
                            }
                          }}
                          className="px-6 py-3 border border-red-400/50 text-red-400 hover:bg-red-400/10 transition-colors text-sm"
                        >
                          {t('settings.deleteAccount')}
                        </button>
                        <p className="font-sans text-xs text-bianco/40 mt-2">
                          {t('settings.deleteWarning')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}
