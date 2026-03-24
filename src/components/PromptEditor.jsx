export default function PromptEditor({ prompt, savedPrompt, onChange, onSave, onRevert }) {
  const isDirty = prompt !== savedPrompt

  return (
    <div className="flex flex-col flex-1 p-4 gap-3">
      <p className="uppercase tracking-wider text-xs font-medium text-slate-500">Scoring Prompt</p>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 font-mono leading-relaxed resize-none focus:outline-none focus:border-slate-500 transition-colors"
        spellCheck={false}
      />
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onSave}
          disabled={!isDirty}
          className="flex-1 py-2 text-xs font-medium rounded-lg transition-all bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white"
        >
          Save
        </button>
        <button
          onClick={onRevert}
          disabled={!isDirty}
          className="flex-1 py-2 text-xs font-medium rounded-lg transition-all border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Revert
        </button>
      </div>
    </div>
  )
}
