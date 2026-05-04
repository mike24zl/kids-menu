import { useDroppable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { SLOT_STYLES } from '../data/defaults'
import { useLang } from '../i18n/LangContext'

export default function MealSlot({ id, type, item, locked, onClear }) {
  const { lang } = useLang()
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked })
  const styles = SLOT_STYLES[type]
  const displayName = item ? (lang === 'he' && item.nameHe ? item.nameHe : item.name) : null

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-xl border-4 transition-all flex flex-col items-center justify-center min-h-[72px]
        ${locked ? 'opacity-40 cursor-not-allowed border-gray-300 bg-gray-100' : ''}
        ${!locked && !item ? `border-dashed ${styles.empty} hover:opacity-80` : ''}
        ${!locked && item ? `border-solid ${styles.filled} shadow-md` : ''}
        ${isOver && !locked ? 'scale-105 border-green-400 bg-green-50 shadow-lg' : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {!item ? (
          <motion.span key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-2xl opacity-30">
            {styles.placeholder}
          </motion.span>
        ) : (
          <motion.div
            key={item.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex flex-col items-center gap-0.5 p-1 w-full"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={displayName}
                className="w-10 h-10 rounded-lg object-cover"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} />
            ) : null}
            <span className="text-2xl leading-none" style={item.imageUrl ? { display: 'none' } : {}}>{item.emoji}</span>
            <span className="font-fredoka text-xs text-center leading-tight text-gray-700 px-1">{displayName}</span>
            {!locked && (
              <button onClick={onClear}
                className="absolute top-0.5 right-0.5 text-xs bg-red-400 hover:bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none transition-colors"
                aria-label="Remove">
                ✕
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
