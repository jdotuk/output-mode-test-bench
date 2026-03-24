import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'bigbean' && password === '2026') {
      sessionStorage.setItem('auth', 'true')
      onLogin()
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  const handleChange = () => {
    if (error) setError(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        {/* Logo / title */}
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Language Learning</p>
          <h1 className="text-2xl font-semibold text-slate-100">Output Mode</h1>
          <p className="text-sm text-slate-500 mt-1">Test Bench</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-4 ${shaking ? 'animate-shake' : ''}`}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); handleChange() }}
              autoComplete="username"
              autoFocus
              className={`bg-slate-900 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-700 focus:outline-none transition-colors ${
                error ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-slate-600'
              }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); handleChange() }}
              autoComplete="current-password"
              className={`bg-slate-900 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-700 focus:outline-none transition-colors ${
                error ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-slate-600'
              }`}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 text-center">Incorrect username or password</p>
          )}

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-3 rounded-lg transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.45s ease; }
      `}</style>
    </div>
  )
}
