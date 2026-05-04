import { useState } from 'react'
import { POOL_COLORS } from '../data/defaults'
import { useLang } from '../i18n/LangContext'
import { POOL_TABS } from '../i18n/translations'

const COMMON_EMOJIS = ['🥩','🍗','🍖','🐟','🐠','🧆','🍔','🍳','🍚','🍝','🥔','🍟','🍠','🍞','🫙','🥒','🥕','🍅','🌽','🥗','🍎','🍉','🍌','🍊','🍇','🥦','🥬','🧅','🥑','🫑','🍰','🍦','🍓','🍫','🍧','🍪','🎂','🧁','🍩','🍮']

export default function DishForm({ onSave, onCancel, initial, poolType }) {
  const { t } = useLang()
  const [name, setName]         = useState(initial?.name ?? '')
  const [emoji, setEmoji]       = useState(initial?.emoji ?? '🍽️')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [imgError, setImgError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), emoji, imageUrl: imageUrl.trim() || undefined, type: poolType })
  }

  const previewUrl = imageUrl.trim()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl p-4 shadow">
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="font-nunito font-bold text-sm text-gray-600">{t.name}</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="border-2 border-orange-200 rounded-xl px-3 py-2 font-fredoka text-base focus:outline-none focus:border-orange-400"
          placeholder={t.pools[poolType]?.placeholder ?? ''}
          autoFocus
        />
      </div>

      {/* Image URL */}
      <div className="flex flex-col gap-1">
        <label className="font-nunito font-bold text-sm text-gray-600">{t.imageUrl}</label>
        <input
          value={imageUrl}
          onChange={e => { setImageUrl(e.target.value); setImgError(false) }}
          className="border-2 border-blue-200 rounded-xl px-3 py-2 font-nunito text-sm focus:outline-none focus:border-blue-400"
          placeholder={t.imageUrlPlaceholder}
          type="url"
        />
        {previewUrl && !imgError && (
          <img
            src={previewUrl}
            alt="preview"
            className="mt-1 w-20 h-20 rounded-xl object-cover border-2 border-blue-200"
            onError={() => setImgError(true)}
          />
        )}
        {imgError && (
          <p className="text-xs text-red-400 font-nunito">Could not load image — check the URL</p>
        )}
      </div>

      {/* Emoji (used when no image URL) */}
      <div className="flex flex-col gap-1">
        <label className="font-nunito font-bold text-sm text-gray-600">
          {t.emoji} {previewUrl && !imgError ? '(fallback)' : ''}
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_EMOJIS.map(e => (
            <button key={e} type="button" onClick={() => setEmoji(e)}
              className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition
                ${emoji === e ? 'bg-orange-200 ring-2 ring-orange-400' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {e}
            </button>
          ))}
        </div>
        <div className="font-fredoka text-base mt-1">{t.selected}: <span className="text-2xl">{emoji}</span></div>
      </div>

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
