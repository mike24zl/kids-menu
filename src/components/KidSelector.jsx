import { useState, useRef, useEffect } from 'react'
import { useLang } from '../i18n/LangContext'

export default function KidSelector({ kids, selectedKidId, onSelect }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = kids.find(k => k.id === selectedKidId) ?? kids[0]

  useEffect(() => {
    if (!open) return
    function handle(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', handle)
    return () => document.removeEventListener('pointerdown', handle)
  }, [open])

  if (!selected) return null

  const canSwitch = kids.length > 1

  return (
    <div className="relative flex items-center justify-center" ref={ref}>
      <button
        onClick={() => canSwitch && setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-fredoka text-base transition-all shadow-sm
          ${canSwitch
            ? 'bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 cursor-pointer'
            : 'bg-amber-100 border-2 border-amber-300 cursor-default'
          }`}
      >
        <span className="text-xl leading-none">{selected.icon}</span>
        <span className="text-amber-800 font-bold">{selected.name}</span>
        {canSwitch && (
          <span className="text-amber-500 text-sm">{open ? '▲' : '▼'}</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1 z-50 bg-white rounded-2xl shadow-xl border-2 border-amber-200 overflow-hidden min-w-[140px]">
          {kids.map(kid => (
            <button
              key={kid.id}
              onClick={() => { onSelect(kid.id); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-4 py-2 font-fredoka text-base transition-colors hover:bg-amber-50
                ${kid.id === selectedKidId ? 'bg-amber-100 font-bold' : ''}`}
            >
              <span className="text-xl leading-none">{kid.icon}</span>
              <span className="text-amber-800">{kid.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
