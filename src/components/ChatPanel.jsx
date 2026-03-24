import { useState, useRef, useEffect } from 'react'

function ScoreBadge({ score }) {
  const color =
    score >= 80
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : score >= 50
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold border ${color}`}
    >
      {score} / 100
    </span>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

function ChatItem({ item }) {
  return (
    <div className="flex flex-col gap-2">
      {/* User bubble — right aligned */}
      <div className="flex justify-end">
        <div className="max-w-sm bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed">
          {item.userInput}
        </div>
      </div>

      {/* Response bubble — left aligned */}
      <div className="flex justify-start">
        {item.loading ? (
          <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
            <span className="text-slate-500">Scoring</span>
            <LoadingDots />
          </div>
        ) : item.error ? (
          <div className="bg-rose-900/30 border border-rose-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-rose-400 max-w-sm">
            <p className="font-medium mb-0.5">Error</p>
            <p className="text-xs opacity-80">{item.error}</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex flex-col gap-2 max-w-sm">
            <ScoreBadge score={item.score} />
            {item.correctedVersion && (
              <p className="text-slate-300 text-sm italic">
                &ldquo;{item.correctedVersion}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPanel({ chat, loading, onScore }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  const handleSubmit = () => {
    if (!input.trim() || loading) return
    onScore(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {chat.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 select-none mt-20">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-sm text-slate-500">Type a description of the image</p>
            <p className="text-xs mt-1 text-slate-700">e.g. &ldquo;a red apple&rdquo; or &ldquo;the dog is running&rdquo;</p>
          </div>
        )}
        {chat.map((item) => (
          <ChatItem key={item.id} item={item} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-800 p-4 shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image..."
            rows={2}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 resize-none focus:outline-none focus:border-slate-500 transition-colors leading-relaxed"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium rounded-xl transition-all shrink-0"
          >
            Score
          </button>
        </div>
        <p className="text-xs text-slate-700 mt-2">Enter to submit &nbsp;·&nbsp; Shift+Enter for newline</p>
      </div>
    </div>
  )
}
