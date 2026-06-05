import DishCard from './DishCard'
import DessertCounter from './DessertCounter'
import { useLang } from '../i18n/LangContext'
import { POOL_TABS } from '../i18n/translations'

export default function PoolSection({ pools, placedIds, dessertCount, dessertOverflow, activeTab, onTabChange }) {
  const { t } = useLang()
  const currentPool = pools[activeTab] ?? []

  return (
    <div className="flex flex-col gap-3 mx-2 bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-md">
      {/* Tabs */}
      <div className="flex gap-2">
        {POOL_TABS.map(({ type, emoji }) => (
          <button
            key={type}
            onClick={() => onTabChange(type)}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl font-fredoka text-sm transition-all
              ${activeTab === type
                ? 'bg-white shadow-md scale-105'
                : 'bg-white/40 hover:bg-white/70 opacity-60 hover:opacity-100'
              }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs leading-tight text-center">{t.pools[type].label}</span>
            {type === 'dessert' && (
              <DessertCounter count={dessertCount} max={3} overflow={dessertOverflow} />
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-3 overflow-y-auto max-h-40 pb-1">
        {currentPool.map(item => (
          <DishCard
            key={item.id}
            item={item}
            isPlaced={placedIds[activeTab]?.has(item.id)}
          />
        ))}
      </div>
    </div>
  )
}
