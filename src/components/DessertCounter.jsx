import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LangContext'

export default function DessertCounter({ count, max = 3, overflow }) {
  const { t } = useLang()

  return (
    <motion.div
      animate={overflow ? { scale: [1, 1.5, 1], backgroundColor: ['#fce7f3', '#ef4444', '#fce7f3'] } : {}}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 px-3 py-1 bg-pink-100 rounded-full border-2 border-pink-300"
    >
      <span className="text-xl">🍰</span>
      <span className="font-fredoka text-lg text-pink-700">{count} / {max}</span>
      <AnimatePresence>
        {overflow && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="text-sm font-fredoka text-red-500"
          >
            {t.onlyN(max)}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
