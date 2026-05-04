import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { POOL_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'

export default function DishCard({ item, isPlaced }) {
  const { lang } = useLang()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `${item.type}-${item.id}` })

  const displayName = lang === 'he' && item.nameHe ? item.nameHe : item.name
  const style = { transform: CSS.Translate.toString(transform), zIndex: isDragging ? 999 : undefined, opacity: isDragging ? 0.7 : 1 }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ rotate: [-2, 2, -2, 0], transition: { duration: 0.4 } }}
      className={`relative flex flex-col items-center justify-center gap-1
        w-24 h-28 rounded-2xl shadow-md cursor-grab active:cursor-grabbing select-none transition-shadow
        ${POOL_COLORS[item.type] ?? 'bg-gray-200 text-gray-900'}
        ${isPlaced ? 'ring-4 ring-green-400 ring-offset-1' : ''}
        ${isDragging ? 'shadow-2xl scale-110' : 'hover:shadow-lg hover:-translate-y-1'}
      `}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={displayName}
          className="w-14 h-14 rounded-xl object-cover"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
      ) : null}
      <span className="text-4xl leading-none emoji" style={item.imageUrl ? { display: 'none' } : {}}>
        {item.emoji}
      </span>
      <span className="font-fredoka text-sm text-center leading-tight px-1">{displayName}</span>
    </motion.div>
  )
}
