import { useState } from 'react'
import { motion } from 'framer-motion'
import DishForm from './DishForm'
import { POOL_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'
import { POOL_TABS } from '../i18n/translations'
import { LIMITS, sanitizeText } from '../utils/validation'
import { THEMES } from '../hooks/useTheme'

const KID_ICONS = [
  // Kids
  '🧒','👦','👧','👶',
  // Animals
  '🐱','🐶','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸',
  '🐵','🦆','🦉','🦇','🐺','🦄','🐢','🐍','🦋','🐙','🦈','🐳',
  '🐅','🦓','🦒','🐘','🦔','🐇','🦥','🦦','🐿','🦜','🦩','🐊',
  // K-pop demon hunters
  '✨','💫','🌟','⭐','💥','🔥','❄️','⚡','🌙','🌈',
  '🔮','🗡️','⚔️','🔱','💀','🧿','👑','💜','🖤','🩷',
  '🧙‍♀️','🧝‍♀️','🧚‍♀️','🧜‍♀️','🦸‍♀️','🦹','🧛','🐉','🌸','💎',
]

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

function IconPicker({ selected, onPick }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {KID_ICONS.map(em => (
        <button
          key={em}
          onClick={() => onPick(em)}
          className={`text-xl w-9 h-9 rounded-xl transition ${selected === em ? 'bg-amber-200 ring-2 ring-amber-400' : 'hover:bg-amber-50'}`}
        >{em}</button>
      ))}
    </div>
  )
}

function KidsSection({ kids, onAddKid, onUpdateKid, onRemoveKid, t }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🧒')
  const [editingId, setEditingId] = useState(null)

  const nameTooLong = name.trim().length > LIMITS.MAX_KID_NAME_LENGTH
  const atMaxKids   = kids.length >= LIMITS.MAX_KIDS

  async function handleAdd() {
    const trimmed = sanitizeText(name.trim())
    if (!trimmed || trimmed.length > LIMITS.MAX_KID_NAME_LENGTH || atMaxKids) return
    await onAddKid({ name: trimmed, icon })
    setName('')
    setIcon('🧒')
    setAdding(false)
  }

  async function handleIconPick(kidId, newIcon) {
    await onUpdateKid(kidId, { icon: newIcon })
    setEditingId(null)
  }

  return (
    <div className="mb-4">
      <div className="font-fredoka text-sm text-purple-600 mb-2 flex items-center gap-2">
        <span>👨‍👩‍👧</span> {t.kids}
      </div>

      <div className="flex flex-col gap-2 mb-2">
        {kids.map(kid => (
          <div key={kid.id}>
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-xl border border-amber-200">
              <button
                onClick={() => setEditingId(editingId === kid.id ? null : kid.id)}
                className="text-2xl leading-none hover:scale-110 transition-transform"
                title={t.changeIcon}
              >{kid.icon}</button>
              <span className="font-fredoka text-base flex-1 text-amber-800">{kid.name}</span>
              <button
                onClick={() => onRemoveKid(kid.id)}
                className="text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition"
              >🗑️</button>
            </div>
            {editingId === kid.id && (
              <div className="bg-white rounded-xl border-2 border-amber-200 p-3 mt-1">
                <IconPicker selected={kid.icon} onPick={em => handleIconPick(kid.id, em)} />
              </div>
            )}
          </div>
        ))}
        {kids.length === 0 && (
          <p className="text-center text-gray-400 font-fredoka py-2 text-sm">{t.noKids}</p>
        )}
      </div>

      {adding ? (
        <div className="bg-white rounded-xl border-2 border-amber-200 p-3 flex flex-col gap-2">
          <input
            className={`w-full border-2 rounded-xl px-3 py-1.5 font-fredoka text-base focus:outline-none
              ${nameTooLong ? 'border-red-400' : 'focus:border-amber-400 border-gray-200'}`}
            placeholder={t.kidName}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            maxLength={LIMITS.MAX_KID_NAME_LENGTH + 5}
            autoFocus
          />
          {nameTooLong && (
            <p className="text-xs text-red-400 font-nunito">{t.nameTooLong(LIMITS.MAX_KID_NAME_LENGTH)}</p>
          )}
          <IconPicker selected={icon} onPick={setIcon} />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleAdd}
              disabled={!name.trim() || nameTooLong}
              className="flex-1 py-1.5 bg-green-400 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-fredoka text-sm transition"
            >{t.save}</button>
            <button
              onClick={() => { setAdding(false); setName(''); setIcon('🧒') }}
              className="flex-1 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl font-fredoka text-sm transition"
            >{t.cancel}</button>
          </div>
        </div>
      ) : atMaxKids ? (
        <p className="text-center text-xs text-gray-400 font-nunito py-1">{t.maxKidsReached(LIMITS.MAX_KIDS)}</p>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-fredoka text-sm transition shadow"
        >➕ {t.addKid}</button>
      )}
    </div>
  )
}

export default function ParentPanel({ pools, onResetWeek, onResetFoods, kids, onAddKid, onUpdateKid, onRemoveKid, onClose, theme, onSetTheme }) {
  const { t, lang } = useLang()
  const [tab, setTab] = useState('main')
  const [editing, setEditing] = useState(null)
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
        <button onClick={onClose}
          className="px-3 py-1.5 bg-purple-400 hover:bg-purple-500 text-white rounded-xl font-nunito font-bold text-xs transition shadow">
          ✕
        </button>
      </div>

      <div className="px-4 py-3">
        {/* Theme picker */}
        <div className="mb-4">
          <div className="font-fredoka text-sm text-purple-600 mb-2 flex items-center gap-2">
            <span>🎨</span> Theme
          </div>
          <div className="flex gap-3 justify-center">
            {THEMES.map(({ id, emoji, gradient }) => (
              <button
                key={id}
                onClick={() => onSetTheme(id)}
                title={id}
                className={`w-10 h-10 rounded-full border-4 transition-transform
                  ${theme === id ? 'border-purple-500 scale-110 shadow-md' : 'border-white hover:scale-105'}`}
                style={{ background: gradient }}
              >
                <span className="text-base">{emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-purple-200 mb-3" />

        {/* Kids section */}
        <KidsSection kids={kids} onAddKid={onAddKid} onUpdateKid={onUpdateKid} onRemoveKid={onRemoveKid} t={t} />

        <div className="border-t-2 border-purple-200 mb-3" />

        {/* Pool tabs */}
        <div className="flex gap-2 mb-4">
          {POOL_TABS.map(({ type, emoji }) => (
            <button key={type} onClick={() => { setTab(type); setEditing(null) }}
              className={`flex-1 py-2 rounded-xl font-fredoka text-sm transition flex flex-col items-center gap-0.5
                ${tab === type ? 'bg-purple-500 text-white shadow' : 'bg-white text-purple-500 border-2 border-purple-200 hover:bg-purple-50'}`}>
              <span className="text-xl">{emoji}</span>
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
            {pool.items.length >= LIMITS.MAX_FOODS_PER_TYPE ? (
              <p className="text-center text-xs text-gray-400 font-nunito py-1">
                {t.maxFoodsReached(LIMITS.MAX_FOODS_PER_TYPE)}
              </p>
            ) : (
              <button onClick={() => setEditing('new')}
                className="w-full py-2 rounded-xl bg-green-400 hover:bg-green-500 text-white font-fredoka text-base transition shadow">
                ➕
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
