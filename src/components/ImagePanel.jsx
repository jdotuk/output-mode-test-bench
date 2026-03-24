import { useRef } from 'react'

export default function ImagePanel({ level, activeImage, onSelectSample, onUpload }) {
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    // Reset input so the same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Main image display */}
      <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
        {activeImage.url ? (
          <img
            src={activeImage.url}
            alt="Selected"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-slate-600 text-sm">No image selected</span>
        )}
      </div>

      {/* Sample image thumbnails */}
      <div>
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">
          Sample images
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const url = `/images/${level}_${n}.png`
            const isActive = activeImage.url === url
            return (
              <button
                key={n}
                onClick={() => onSelectSample(n)}
                className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-transparent hover:border-slate-600'
                }`}
                title={`Sample ${n}`}
              >
                <img
                  src={url}
                  alt={`Sample ${n}`}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Upload */}
      <div>
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-2 text-sm text-slate-400 border border-dashed border-slate-700 rounded-lg hover:border-slate-500 hover:text-slate-300 transition-all"
        >
          + Upload custom image
        </button>
      </div>
    </div>
  )
}
