import { useState } from 'react'
import { motion } from 'framer-motion'
import DishForm from './DishForm'
import { POOL_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'
import { POOL_TABS } from '../i18n/translations'

function ItemRow({ item, onEdit, onDelete, lang }) {
  const displayName = lang === 'he' && item.nameHe ? item.nameHe : item.name
  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl ${POOL_COLORS[item.type] ?? 'bg-gray-100'} bg-opacity-30`}>
      {item.imageUrl
        ? <img src={item.imageUrl} alt={displayName} className="w-9 h-9 rounded-lg object-cover" />
        : <span className="text-2xl">{item.emoji}</span>
      }
      <span className="font-fredoka text-base flex-1">{displayName}</span>
      <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition">✏️</button>
      <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition">🗑️</button>
    </div>
  )
}

export default function ParentPanel({ pools, onResetWeek, onResetFoods }) {
  const { t, lang } = useLang()
  const [tab, setTab] = useState('main')
  const [editing, setEditing] = useState(null) // null | 'new' | { item }
  const [confirmingReset, setConfirmingReset] = useState(false)

  const pool = pools[tab]

  function handleSave(data) {
    if (editing === 'new') pool.add({ ...data, type: tab })
    else pool.update(editing.item.id, data)
    setEditing(null)
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-purple-50 border-t-4 border-purple-300 rounded-t-3xl shadow-2xl"
      style={{ maxHeight: '65vh', overflowY: 'auto' }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-purple-100 rounded-t-3xl px-4 py-3 flex items-center gap-3 border-b-2 border-purple-200">
        <span className="text-2xl">👨‍👩‍👧</span>
        <span className="font-fredoka text-xl text-purple-700 flex-1">{t.parentMode}</span>
        <button onClick={onResetWeek}
          className="px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white rounded-xl font-nunito font-bold text-xs transition shadow">
          🔄 {t.resetWeek}
        </button>

        {confirmingReset ? (
          <div className="flex items-center gap-1.5">
            <span className="font-nunito text-xs text-red-700 font-bold">{t.confirmResetFoods}</span>
            <button
              onClick={() => { onResetFoods(); setConfirmingReset(false) }}
              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-nunito font-bold text-xs transition shadow">
              ✓
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              className="px-2.5 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-nunito font-bold text-xs transition">
              ✕
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmingReset(true)}
            className="px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-nunito font-bold text-xs transition shadow">
            🍽️ {t.resetFoods}
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        {/* Pool tabs */}
        <div className="flex gap-2 mb-4">
          {POOL_TABS.map(({ type, emoji }) => (
            <button key={type} onClick={() => { setTab(type); setEditing(null) }}
              className={`flex-1 py-2 rounded-xl font-fredoka text-sm transition flex flex-col items-center gap-0.5
                ${tab === type ? 'bg-purple-500 text-white shadow' : 'bg-white text-purple-500 border-2 border-purple-200 hover:bg-purple-50'}`}>
              <span className="text-xl">{emoji}</span>
              <span className="text-xs">{t.pools[type].label}</span>
            </button>
          ))}
        </div>

        {editing ? (
          <DishForm
            initial={editing?.item}
            poolType={tab}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-3">
              {pool.items.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  lang={lang}
                  onEdit={item => setEditing({ item })}
                  onDelete={id => pool.remove(id)}
                />
              ))}
              {pool.items.length === 0 && (
                <p className="text-center text-gray-400 font-fredoka py-4">No items yet</p>
              )}
            </div>
            <button onClick={() => setEditing('new')}
              className="w-full py-2 rounded-xl bg-green-400 hover:bg-green-500 text-white font-fredoka text-base transition shadow">
              ➕ {t.pools[tab].label}
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
