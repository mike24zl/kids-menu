export function getWeekStart(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function getWeekDays(weekStart) {
  const start = new Date(weekStart + 'T00:00:00')
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function isPast(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d < today
}

export function formatWeekLabel(weekStart, locale = 'en-US') {
  const days = getWeekDays(weekStart)
  const opts = { month: 'short', day: 'numeric' }
  return `${days[0].toLocaleDateString(locale, opts)} – ${days[6].toLocaleDateString(locale, opts)}`
}

export const DAY_EMOJIS = ['☀️', '🌙', '⭐', '🌈', '🎈', '🎉', '🌟']
