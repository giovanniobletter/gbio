'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Leaf } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  { label: '🛒 Come ordinare?', message: 'Come posso ordinare i vostri prodotti?' },
  { label: '🚚 Spedizioni', message: 'Quali sono i costi e i tempi di spedizione?' },
  { label: '🫒 Quale olio scegliere?', message: 'Che differenza c\'è tra le vostre bottiglie di olio? Quale mi consigliate?' },
  { label: '🍝 Cosa cucino?', message: 'Cosa posso cucinare con i vostri prodotti? Datemi qualche idea!' },
  { label: '🌿 Certificazioni bio', message: 'Quali certificazioni biologiche avete? Come viene prodotto il vostro olio DOP?' },
]

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: 'Benvenuto! Sono Robin, l\'assistente di GBiO — Azienda Agricola Biologica Obletter. 🫒\n\nPosso aiutarti con informazioni sui nostri prodotti biologici, ordini e spedizioni. Scegli una domanda rapida o scrivimi liberamente!'
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      if (!hasOpened) {
        setMessages([WELCOME_MESSAGE])
        setHasOpened(true)
      }
    }
  }, [isOpen, hasOpened])

  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.filter(m => m !== WELCOME_MESSAGE),
        }),
      })

      const data = await res.json()

      if (res.ok && data.response) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Mi dispiace, si è verificato un errore. Riprova tra poco.' },
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Errore di connessione. Verifica la tua connessione e riprova.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickAction = (message: string) => {
    sendMessage(message)
  }

  // Formatta il testo con newline
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 bg-gold text-nero rounded-full flex items-center justify-center shadow-gold hover:bg-gold-light transition-colors duration-300 group"
            aria-label="Apri chat assistente"
          >
            <Leaf size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[9998] w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-3rem)] flex flex-col bg-nero/95 backdrop-blur-md border border-gold/30 shadow-2xl rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20 flex-shrink-0 bg-nero">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center">
                  <Leaf size={16} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-gold">
                    Robin
                  </h3>
                  <p className="font-sans text-[10px] text-bianco/40 uppercase tracking-widest">
                    Assistente GBiO
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bianco/40 hover:text-gold transition-colors duration-300"
                aria-label="Chiudi chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-xl font-sans text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gold/20 text-bianco rounded-br-sm'
                        : 'bg-white/5 text-bianco/80 border border-gold/10 rounded-bl-sm'
                    }`}
                  >
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}

              {/* Quick Actions — solo dopo il messaggio di benvenuto e se nessun messaggio utente */}
              {messages.length === 1 && messages[0].role === 'assistant' && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(action.message)}
                      className="px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-bianco/70 font-sans text-xs hover:bg-gold/15 hover:text-gold hover:border-gold/40 transition-all duration-300"
                    >
                      {action.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-gold/10">
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="text-gold/60 animate-spin" />
                      <span className="font-sans text-xs text-bianco/40">Robin sta scrivendo...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gold/20 px-4 py-3 flex-shrink-0 bg-nero">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 bg-white/5 border border-gold/15 rounded-lg px-3 py-2.5 font-sans text-sm text-bianco placeholder:text-bianco/30 outline-none focus:border-gold/40 transition-colors duration-300"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gold/20 text-gold hover:bg-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  aria-label="Invia messaggio"
                >
                  <Send size={16} />
                </button>
              </div>
              {/* AI Disclaimer */}
              <p className="font-sans text-[9px] text-bianco/20 text-center mt-2">
                Risposte generate da AI · Non inserire dati personali
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
