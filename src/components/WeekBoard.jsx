import { getWeekDays, isPast } from '../utils/dates'
import DayColumn from './DayColumn'

export default function WeekBoard({ plan, pools, onClear }) {
  const days = getWeekDays(plan.weekStart)

  function resolveItem(id, pool) {
    return pool.find(x => x.id === id) ?? null
  }

  return (
    <div className="grid grid-cols-7 gap-1.5 px-2 py-2 overflow-x-auto">
      {days.map((date, i) => {
        const day = plan.days[i]
        return (
          <DayColumn
            key={i}
            dayIndex={i}
            date={date}
            locked={isPast(date)}
            slots={{
              main:    resolveItem(day.main,    pools.mains),
              side:    resolveItem(day.side,    pools.sides),
              dessert: resolveItem(day.dessert, pools.desserts),
            }}
            onClear={onClear}
          />
        )
      })}
    </div>
  )
}
