import { useState, useEffect } from 'react'
import { defaultPrompts } from './defaultPrompts'
import { scoreDescription, fetchImageAsBase64, MODEL_NAME } from './gemini'
import LevelTabs from './components/LevelTabs'
import ImagePanel from './components/ImagePanel'
import PromptEditor from './components/PromptEditor'
import ChatPanel from './components/ChatPanel'
import LoginPage from './components/LoginPage'

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('auth') === 'true')
  const [level, setLevel] = useState('beginner')
  const [prompts, setPrompts] = useState({ ...defaultPrompts })
  const [savedPrompts, setSavedPrompts] = useState(() => {
    try {
      const stored = localStorage.getItem('savedPrompts')
      return stored ? JSON.parse(stored) : { ...defaultPrompts }
    } catch {
      return { ...defaultPrompts }
    }
  })
  const [activeImage, setActiveImage] = useState({
    url: '/images/beginner_1.png',
    base64: null,
    mimeType: 'image/png',
  })
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)

  // When level changes, reset to first sample image and clear chat
  useEffect(() => {
    setActiveImage({ url: `/images/${level}_1.png`, base64: null, mimeType: 'image/png' })
    setChat([])
  }, [level])

  const handleSelectSampleImage = (index) => {
    setActiveImage({ url: `/images/${level}_${index}.png`, base64: null, mimeType: 'image/png' })
    setChat([])
  }

  const handleUploadImage = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result
      const base64 = dataUrl.split(',')[1]
      setActiveImage({ url: dataUrl, base64, mimeType: file.type })
      setChat([])
    }
    reader.readAsDataURL(file)
  }

  const handleUpdatePrompt = (text) => {
    setPrompts((prev) => ({ ...prev, [level]: text }))
  }

  const handleSavePrompt = () => {
    const updated = { ...savedPrompts, [level]: prompts[level] }
    setSavedPrompts(updated)
    localStorage.setItem('savedPrompts', JSON.stringify(updated))
  }

  const handleRevertPrompt = () => {
    setPrompts((prev) => ({ ...prev, [level]: savedPrompts[level] }))
  }

  const handleScore = async (userInput) => {
    if (!userInput.trim() || loading) return
    setLoading(true)
    const id = Date.now()
    setChat((prev) => [
      ...prev,
      { id, userInput, score: null, correctedVersion: null, originalAnalysis: null, loading: true, error: null },
    ])
    try {
      let { base64, mimeType } = activeImage
      if (!base64) {
        const result = await fetchImageAsBase64(activeImage.url)
        base64 = result.base64
        mimeType = result.mimeType
      }
      const { score, corrected_version, original_analysis } = await scoreDescription(
        base64,
        mimeType,
        prompts[level],
        userInput
      )
      setChat((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, score, correctedVersion: corrected_version, originalAnalysis: original_analysis ?? null, loading: false }
            : item
        )
      )
    } catch (err) {
      setChat((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, loading: false, error: err.message } : item
        )
      )
    } finally {
      setLoading(false)
    }
  }

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <header className="flex items-center px-6 py-3 border-b border-slate-800 shrink-0">
        <span className="text-sm font-semibold text-slate-300 tracking-wide">Output Mode</span>
        <span className="mx-3 text-slate-700">·</span>
        <span className="text-sm text-slate-500">Test Bench</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-slate-500 font-mono">{MODEL_NAME}</span>
        </div>
      </header>
      <LevelTabs level={level} onSelect={setLevel} />
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1 — Image */}
        <div className="w-1/3 flex flex-col border-r border-slate-800 overflow-y-auto">
          <ImagePanel
            level={level}
            activeImage={activeImage}
            onSelectSample={handleSelectSampleImage}
            onUpload={handleUploadImage}
          />
        </div>
        {/* Column 2 — Prompt */}
        <div className="w-1/3 flex flex-col border-r border-slate-800 overflow-y-auto">
          <PromptEditor
            prompt={prompts[level]}
            savedPrompt={savedPrompts[level]}
            onChange={handleUpdatePrompt}
            onSave={handleSavePrompt}
            onRevert={handleRevertPrompt}
          />
        </div>
        {/* Column 3 — Chat */}
        <div className="w-1/3 flex flex-col overflow-hidden">
          <ChatPanel chat={chat} loading={loading} onScore={handleScore} />
        </div>
      </div>
    </div>
  )
}
