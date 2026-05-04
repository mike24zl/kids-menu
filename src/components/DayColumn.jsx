import { DAY_EMOJIS } from '../utils/dates'
import { useLang } from '../i18n/LangContext'
import MealSlot from './MealSlot'

export default function DayColumn({ dayIndex, date, dinner, dessert, locked, onClear }) {
  const { t } = useLang()
  const dayNum = date.getDate()
  const month = date.toLocaleDateString(t.locale, { month: 'short' })

  return (
    <div className={`flex flex-col gap-2 rounded-3xl p-2 transition-all
      ${locked ? 'opacity-60' : 'bg-white/40 hover:bg-white/60 shadow-sm'}`}
    >
      <div className={`flex flex-col items-center py-2 rounded-2xl
        ${locked ? 'bg-gray-200' : 'bg-white/70'}`}
      >
        <span className="text-2xl">{locked ? '🔒' : DAY_EMOJIS[dayIndex]}</span>
        <span className="font-fredoka text-base text-gray-700">{t.days[dayIndex]}</span>
        <span className="font-nunito text-xs font-bold text-gray-400">{dayNum} {month}</span>
      </div>

      <MealSlot
        id={`${dayIndex}-dinner`}
        type="dinner"
        item={dinner}
        locked={locked}
        onClear={() => onClear(dayIndex, 'dinner')}
      />

      <MealSlot
        id={`${dayIndex}-dessert`}
        type="dessert"
        item={dessert}
        locked={locked}
        onClear={() => onClear(dayIndex, 'dessert')}
      />
    </div>
  )
}
