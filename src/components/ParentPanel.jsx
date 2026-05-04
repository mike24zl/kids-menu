import { useState } from 'react'
import { motion } from 'framer-motion'
import DishForm from './DishForm'
import { CATEGORY_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'

function ItemRow({ item, onEdit, onDelete, isDessert, categoryLabel }) {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl ${isDessert ? 'bg-pink-50' : 'bg-orange-50'}`}>
      <span className="text-2xl">{item.emoji}</span>
      <span className="font-fredoka text-base flex-1">{item.name}</span>
      {!isDessert && item.category && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-nunito font-bold ${CATEGORY_COLORS[item.category]}`}>
          {categoryLabel}
        </span>
      )}
      <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700 text-sm font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition">✏️</button>
      <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 text-sm font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition">🗑️</button>
    </div>
  )
}

export default function ParentPanel({
  dishes, desserts,
  onAddDish, onUpdateDish, onDeleteDish,
  onAddDessert, onUpdateDessert, onDeleteDessert,
  onResetWeek,
}) {
  const { t } = useLang()
  const [tab, setTab] = useState('dinners')
  const [editing, setEditing] = useState(null)

  function handleSave(data) {
    if (editing === 'new-dish') onAddDish(data)
    else if (editing === 'new-dessert') onAddDessert(data)
    else if (editing?.item && !editing.isDessert) onUpdateDish(editing.item.id, data)
    else if (editing?.item && editing.isDessert) onUpdateDessert(editing.item.id, data)
    setEditing(null)
  }

  const isDessertTab = tab === 'desserts'
  const items = isDessertTab ? desserts : dishes

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-purple-50 border-t-4 border-purple-300 rounded-t-3xl shadow-2xl"
      style={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <div className="sticky top-0 bg-purple-100 rounded-t-3xl px-4 py-3 flex items-center gap-3 border-b-2 border-purple-200">
        <span className="text-2xl">👨‍👩‍👧</span>
        <span className="font-fredoka text-xl text-purple-700 flex-1">{t.parentMode}</span>
        <button
          onClick={onResetWeek}
          className="px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white rounded-xl font-nunito font-bold text-xs transition shadow"
        >
          🔄 {t.resetWeek}
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex gap-2 mb-4">
          {['dinners', 'desserts'].map(tabKey => (
            <button key={tabKey} onClick={() => { setTab(tabKey); setEditing(null) }}
              className={`flex-1 py-2 rounded-xl font-fredoka text-base transition
                ${tab === tabKey ? 'bg-purple-500 text-white shadow' : 'bg-white text-purple-500 border-2 border-purple-200 hover:bg-purple-50'}`}>
              {tabKey === 'dinners' ? `🍽️ ${t.dinners}` : `🍰 ${t.desserts}`}
            </button>
          ))}
        </div>

        {editing ? (
          <DishForm
            initial={editing?.item}
            isDessert={isDessertTab}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-3">
              {items.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isDessert={isDessertTab}
                  categoryLabel={item.category ? t.categories[item.category] : ''}
                  onEdit={item => setEditing({ item, isDessert: isDessertTab })}
                  onDelete={isDessertTab ? onDeleteDessert : onDeleteDish}
                />
              ))}
            </div>
            <button
              onClick={() => setEditing(isDessertTab ? 'new-dessert' : 'new-dish')}
              className="w-full py-2 rounded-xl bg-green-400 hover:bg-green-500 text-white font-fredoka text-base transition shadow"
            >
              ➕ {isDessertTab ? t.addDessert : t.addDish}
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
