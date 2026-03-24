const LEVELS = ['beginner', 'intermediate', 'advanced']

const ACTIVE_STYLES = {
  beginner: 'text-emerald-400 border-emerald-400',
  intermediate: 'text-amber-400 border-amber-400',
  advanced: 'text-rose-400 border-rose-400',
}

export default function LevelTabs({ level, onSelect }) {
  return (
    <div className="flex gap-1 px-4 py-2 border-b border-slate-800 shrink-0 bg-slate-900">
      {LEVELS.map((l) => (
        <button
          key={l}
          onClick={() => onSelect(l)}
          className={`px-4 py-1.5 text-sm font-medium rounded capitalize transition-all border-b-2 ${
            level === l
              ? `${ACTIVE_STYLES[l]} bg-slate-800`
              : 'text-slate-500 hover:text-slate-300 border-transparent'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
