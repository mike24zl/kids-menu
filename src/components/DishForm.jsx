import { useState } from 'react'
import { CATEGORY_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'

const COMMON_EMOJIS = ['🍝','🧀','🫕','🍗','🥩','🍖','🐟','🐠','🥦','🍳','🍲','🍅','🥣','🫘','🍕','🌮','🥗','🍱','🍜','🥘','🍰','🍦','🍓','🍫','🍧','🍪','🎂','🧁','🍮','🍩']

export default function DishForm({ onSave, onCancel, initial, isDessert }) {
  const { t } = useLang()
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🍝')
  const [category, setCategory] = useState(initial?.category ?? 'pasta')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const item = isDessert
      ? { name: name.trim(), emoji }
      : { name: name.trim(), emoji, category }
    onSave(item)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl p-4 shadow">
      <div className="flex flex-col gap-1">
        <label className="font-nunito font-bold text-sm text-gray-600">{t.name}</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="border-2 border-orange-200 rounded-xl px-3 py-2 font-fredoka text-base focus:outline-none focus:border-orange-400"
          placeholder={isDessert ? t.namePlaceholderDessert : t.namePlaceholderDish}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-nunito font-bold text-sm text-gray-600">{t.emoji}</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition
                ${emoji === e ? 'bg-orange-200 ring-2 ring-orange-400' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="font-fredoka text-base mt-1">
          {t.selected}: <span className="text-2xl">{emoji}</span>
        </div>
      </div>

      {!isDessert && (
        <div className="flex flex-col gap-1">
          <label className="font-nunito font-bold text-sm text-gray-600">{t.category}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(t.categories).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`px-3 py-1 rounded-full font-fredoka text-sm transition
                  ${category === key ? 'ring-2 ring-offset-1 ring-gray-500 opacity-100' : 'opacity-60 hover:opacity-100'}
                  ${CATEGORY_COLORS[key]}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end mt-1">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-nunito font-bold text-sm text-gray-600 transition">
          {t.cancel}
        </button>
        <button type="submit"
          className="px-4 py-2 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-nunito font-bold text-sm transition shadow">
          {t.save} ✅
        </button>
      </div>
    </form>
  )
}
