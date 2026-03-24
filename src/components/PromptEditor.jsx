export default function PromptEditor({ prompt, onChange }) {
  return (
    <div className="flex flex-col flex-1 p-4 gap-3">
      <p className="uppercase tracking-wider text-xs font-medium text-slate-500">Scoring Prompt</p>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 font-mono leading-relaxed resize-none focus:outline-none focus:border-slate-500 transition-colors"
        spellCheck={false}
      />
    </div>
  )
}
