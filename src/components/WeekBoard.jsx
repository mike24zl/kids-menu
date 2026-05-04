import { getWeekDays, isPast } from '../utils/dates'
import DayColumn from './DayColumn'

export default function WeekBoard({ plan, dishes, desserts, onClear }) {
  const days = getWeekDays(plan.weekStart)

  function resolveItem(id, pool) {
    return pool.find(x => x.id === id) ?? null
  }

  return (
    <div className="grid grid-cols-7 gap-2 px-2 py-2 overflow-x-auto">
      {days.map((date, i) => (
        <DayColumn
          key={i}
          dayIndex={i}
          date={date}
          locked={isPast(date)}
          dinner={resolveItem(plan.days[i].dinner, dishes)}
          dessert={resolveItem(plan.days[i].dessert, desserts)}
          onClear={onClear}
        />
      ))}
    </div>
  )
}
