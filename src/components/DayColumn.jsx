import { DAY_EMOJIS } from '../utils/dates'
import { useLang } from '../i18n/LangContext'
import MealSlot from './MealSlot'

const SLOT_TYPES = ['main', 'side', 'dessert']

export default function DayColumn({ dayIndex, date, slots, locked, onClear }) {
  const { t } = useLang()
  const dayNum = date.getDate()
  const month = date.toLocaleDateString(t.locale, { month: 'short' })

  return (
    <div className={`flex flex-col gap-1.5 rounded-3xl p-2 transition-all
      ${locked ? 'opacity-60' : 'bg-white/40 hover:bg-white/60 shadow-sm'}`}
    >
      {/* Day header */}
      <div className={`flex flex-col items-center py-1.5 rounded-2xl
        ${locked ? 'bg-gray-200' : 'bg-white/70'}`}
      >
        <span className="text-xl">{locked ? '🔒' : DAY_EMOJIS[dayIndex]}</span>
        <span className="font-fredoka text-sm text-gray-700">{t.days[dayIndex]}</span>
        <span className="font-nunito text-xs font-bold text-gray-400">{dayNum} {month}</span>
      </div>

      <MealSlot
        id={`${dayIndex}-main`}
        type="main"
        item={slots.main}
        locked={locked}
        onClear={() => onClear(dayIndex, 'main')}
      />
      <MealSlot
        id={`${dayIndex}-side`}
        type="side"
        item={slots.side}
        locked={locked}
        onClear={() => onClear(dayIndex, 'side')}
      />

      {/* Hardcoded veggies */}
      <div className="rounded-xl border-2 border-green-200 bg-green-50 flex items-center justify-center gap-1.5 py-1.5 min-h-[40px]">
        <span className="text-xl">🥒</span>
        <span className="text-xl">🍅</span>
      </div>

      <MealSlot
        id={`${dayIndex}-dessert`}
        type="dessert"
        item={slots.dessert}
        locked={locked}
        onClear={() => onClear(dayIndex, 'dessert')}
      />
    </div>
  )
}
