import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LangContext'

export default function ConfettiOverlay({ show, onDismiss }) {
  const { t } = useLang()

  useEffect(() => {
    if (!show) return
    const end = Date.now() + 2500
    const colors = ['#FFA500', '#FFD700', '#FF69B4', '#00CED1', '#7B68EE']
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [show])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.5, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4"
      >
        <span className="text-7xl">🎉</span>
        <h2 className="font-fredoka text-4xl text-orange-500 text-center">{t.amazing}</h2>
        <p className="font-nunito font-bold text-xl text-gray-600 text-center">{t.weekPlanned}</p>
        <span className="text-5xl">⭐🌟✨</span>
        <p className="font-nunito text-sm text-gray-400">{t.tapToClose}</p>
      </motion.div>
    </motion.div>
  )
}
