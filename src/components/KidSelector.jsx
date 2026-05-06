import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function KidSelector({ kids, selectedKidId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef(null)

  const selected = kids.find(k => k.id === selectedKidId) ?? kids[0]
  const canSwitch = kids.length > 1

  useEffect(() => {
    if (!open) return
    function handleOutside(e) {
      if (!buttonRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [open])

  function handleToggle() {
    if (!canSwitch) return
    const rect = buttonRef.current.getBoundingClientRect()
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    setOpen(o => !o)
  }

  if (!selected) return null

  return (
    <div className="relative flex items-center justify-center">
      <button
        ref={buttonRef}
        onClick={handleToggle}
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

      {open && createPortal(
        <div
          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, minWidth: Math.max(dropdownPos.width, 140) }}
          className="z-[200] bg-white rounded-2xl shadow-2xl border-2 border-amber-200 overflow-hidden"
        >
          {kids.map(kid => (
            <button
              key={kid.id}
              onPointerDown={e => e.stopPropagation()}
              onClick={() => { onSelect(kid.id); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-4 py-2 font-fredoka text-base transition-colors hover:bg-amber-50
                ${kid.id === selectedKidId ? 'bg-amber-100 font-bold' : ''}`}
            >
              <span className="text-xl leading-none">{kid.icon}</span>
              <span className="text-amber-800">{kid.name}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
