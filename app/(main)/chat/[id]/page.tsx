'use client'

import { useState, useEffect, useRef, use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Phone, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Msg {
  id: number; conversation_id: number; sender_id: number
  content: string; type: string; read_at: string | null; created_at: string
}

interface ConvInfo {
  horse_name: string | null; horse_id: number | null; horse_cover: string | null
  other_name: string; other_username: string; other_avatar: string | null; other_verified: boolean
  seller_id: number
}

function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Msg[]>([])
  const [conv,     setConv]     = useState<ConvInfo | null>(null)
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const [myId,     setMyId]     = useState<number | null>(null)

  useEffect(() => {
    // get current user
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setMyId(d.user.id)
    })
  }, [])

  useEffect(() => {
    // get conversation list to find this conv
    fetch('/api/conversations').then(r => r.json()).then(d => {
      const found = (d.conversations || []).find((c: { id: number } & ConvInfo) => c.id === Number(id))
      if (found) setConv(found)
    })
  }, [id])

  const fetchMessages = () => {
    fetch(`/api/conversations/${id}/messages`)
      .then(r => r.json())
      .then(d => {
        setMessages(d.messages || [])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const send = async () => {
    if (!text.trim() || sending) return
    const content = text.trim()
    setText('')
    setSending(true)
    try {
      await fetch(`/api/conversations/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      fetchMessages()
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  // Group messages by date
  const grouped: { date: string; msgs: Msg[] }[] = []
  messages.forEach(m => {
    const d = new Date(m.created_at).toLocaleDateString('pt-BR')
    const last = grouped[grouped.length - 1]
    if (last?.date === d) last.msgs.push(m)
    else grouped.push({ date: d, msgs: [m] })
  })

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 z-30 shrink-0">
        <div className="flex items-center gap-3 h-14 px-3 max-w-2xl mx-auto">
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => router.back()} className="p-1.5">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </motion.button>

          {conv && (
            <>
              {conv.other_avatar ? (
                <Image src={conv.other_avatar} alt={conv.other_name} width={36} height={36}
                  className="rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center
                               text-emerald-700 font-bold shrink-0">
                  {conv.other_name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/perfil/${conv.other_username}`}
                  className="text-sm font-bold text-slate-800 hover:underline flex items-center gap-1">
                  {conv.other_name}
                  {conv.other_verified && <span className="text-emerald-500 text-xs">✓</span>}
                </Link>
                {conv.horse_name && conv.horse_id && (
                  <Link href={`/cavalo/${conv.horse_id}`} className="text-xs text-emerald-600 hover:underline truncate block">
                    🐴 {conv.horse_name}
                  </Link>
                )}
              </div>
              {conv.horse_cover && conv.horse_id && (
                <Link href={`/cavalo/${conv.horse_id}`}>
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={conv.horse_cover} alt={conv.horse_name || ''} fill className="object-cover" />
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {grouped.map(group => (
          <div key={group.date}>
            <div className="flex justify-center my-3">
              <span className="text-[11px] text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                {group.date}
              </span>
            </div>
            {group.msgs.map(msg => {
              const isMe = msg.sender_id === myId
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-white text-slate-800 shadow-card rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {timeLabel(msg.created_at)}
                      {isMe && msg.read_at && ' ✓✓'}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <span className="text-3xl mb-2">👋</span>
            <p className="text-sm text-slate-500">Inicie a conversa!</p>
            {conv?.horse_name && (
              <p className="text-xs text-slate-400 mt-1">Sobre: {conv.horse_name}</p>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] max-w-2xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2.5 min-h-[44px]">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Mensagem..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={send}
            disabled={!text.trim() || sending}
            className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center
                       shadow-md shadow-emerald-200 disabled:opacity-40 shrink-0"
          >
            <Send className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
