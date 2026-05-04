import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { CATEGORY_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'

export default function DishCard({ item, type, isPlaced }) {
  const { lang } = useLang()
  const draggableId = `${type}-${item.id}`
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: draggableId })

  const displayName = lang === 'he' && item.nameHe ? item.nameHe : item.name

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.7 : 1,
  }

  const categoryStyle = type === 'dish' && item.category
    ? CATEGORY_COLORS[item.category]
    : 'bg-pink-200 text-pink-900'

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ rotate: [-2, 2, -2, 0], transition: { duration: 0.4 } }}
      className={`relative flex flex-col items-center justify-center gap-1
        w-24 h-28 rounded-2xl shadow-md cursor-grab active:cursor-grabbing
        select-none transition-shadow
        ${isPlaced ? 'ring-4 ring-green-400 ring-offset-1' : ''}
        ${isDragging ? 'shadow-2xl scale-110' : 'hover:shadow-lg hover:-translate-y-1'}
        ${categoryStyle}
      `}
    >
      <span className="text-4xl leading-none emoji">{item.emoji}</span>
      <span className="font-fredoka text-sm text-center leading-tight px-1">{displayName}</span>
    </motion.div>
  )
}
