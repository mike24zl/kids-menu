import { useLang } from '../i18n/LangContext'
import DishCard from './DishCard'
import DessertCounter from './DessertCounter'

export default function DessertPool({ desserts, placedDessertIds, dessertCount, overflow }) {
  const { t } = useLang()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-1">
        <span className="text-2xl">🍰</span>
        <span className="font-fredoka text-xl text-pink-600">{t.desserts}</span>
        <DessertCounter count={dessertCount} max={3} overflow={overflow} />
      </div>
      <div className="flex flex-wrap gap-3 overflow-y-auto max-h-44 pb-2">
        {desserts.map(dessert => (
          <DishCard
            key={dessert.id}
            item={dessert}
            type="dessert"
            isPlaced={placedDessertIds.has(dessert.id)}
          />
        ))}
      </div>
    </div>
  )
}
