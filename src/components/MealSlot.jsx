import { useDroppable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LangContext'

export default function MealSlot({ id, type, item, locked, onClear }) {
  const { lang } = useLang()
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked })

  const displayName = item
    ? (lang === 'he' && item.nameHe ? item.nameHe : item.name)
    : null

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-2xl border-4 transition-all flex flex-col items-center justify-center min-h-[90px]
        ${locked ? 'opacity-40 cursor-not-allowed border-gray-300 bg-gray-100' : ''}
        ${!locked && !item
          ? `border-dashed ${type === 'dinner' ? 'border-orange-300 bg-orange-50/50' : 'border-pink-300 bg-pink-50/50'} hover:border-orange-400`
          : ''}
        ${!locked && item
          ? `border-solid ${type === 'dinner' ? 'border-orange-400 bg-orange-100' : 'border-pink-400 bg-pink-100'} shadow-md`
          : ''}
        ${isOver && !locked ? 'scale-105 border-green-400 bg-green-50 shadow-lg' : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {!item ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-3xl opacity-30">{type === 'dinner' ? '🍽️' : '🍰'}</span>
          </motion.div>
        ) : (
          <motion.div
            key={item.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex flex-col items-center gap-1 p-1 w-full"
          >
            <span className="text-3xl leading-none">{item.emoji}</span>
            <span className="font-fredoka text-xs text-center leading-tight text-gray-700 px-1">
              {displayName}
            </span>
            {!locked && (
              <button
                onClick={onClear}
                className="absolute top-1 right-1 text-xs bg-red-400 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center leading-none transition-colors"
                aria-label="Remove"
              >
                ✕
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
