'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
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
          {
            role: 'assistant',
            content: 'Mi dispiace, si è verificato un errore. Riprova tra poco.',
          },
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Errore di connessione. Verifica la tua connessione e riprova.',
        },
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
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 bg-gold text-nero rounded-full flex items-center justify-center shadow-gold hover:bg-gold-light transition-colors duration-300"
            aria-label="Apri chat assistente"
          >
            <MessageCircle size={24} />
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
            className="fixed bottom-6 right-6 z-[9998] w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-3rem)] flex flex-col bg-nero/95 backdrop-blur-md border border-gold/30 shadow-2xl rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-medium text-gold">
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
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gold/10 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} className="text-gold/60" />
                  </div>
                  <p className="font-sans text-sm text-bianco/40">
                    Ciao! Sono Robin, il tuo assistente.
                  </p>
                  <p className="font-sans text-xs text-bianco/30 mt-1">
                    Chiedimi dei nostri prodotti, prezzi o spedizioni.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-lg font-sans text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gold/20 text-bianco'
                        : 'bg-white/5 text-bianco/80 border border-gold/10'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-lg bg-white/5 border border-gold/10">
                    <Loader2
                      size={16}
                      className="text-gold/60 animate-spin"
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gold/20 px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 bg-white/5 border border-gold/15 rounded-md px-3 py-2 font-sans text-sm text-bianco placeholder:text-bianco/30 outline-none focus:border-gold/40 transition-colors duration-300"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-gold/20 text-gold hover:bg-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  aria-label="Invia messaggio"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
