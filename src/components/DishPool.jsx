import { useLang } from '../i18n/LangContext'
import DishCard from './DishCard'

export default function DishPool({ dishes, placedDishIds }) {
  const { t } = useLang()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-2xl">🍽️</span>
        <span className="font-fredoka text-xl text-orange-600">{t.dinners}</span>
      </div>
      <div className="flex flex-wrap gap-3 overflow-y-auto max-h-44 pb-2">
        {dishes.map(dish => (
          <DishCard
            key={dish.id}
            item={dish}
            type="dish"
            isPlaced={placedDishIds.has(dish.id)}
          />
        ))}
      </div>
    </div>
  )
}
