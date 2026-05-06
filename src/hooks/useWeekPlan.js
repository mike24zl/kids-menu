import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const EMPTY_DAY = { main: null, side: null, dessert: null }
const AUTOSAVE_DELAY = 5000

function emptyDays() {
  return Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, { ...EMPTY_DAY }]))
}

export function useWeekPlan(userId, weekStart, kidId = 'default') {
  const [plan, setPlan] = useState({ weekStart, days: emptyDays() })
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved'

  // Always-current refs so timer callbacks never read stale state
  const planRef        = useRef(plan)
  const contextRef     = useRef({ userId, weekStart, kidId })
  const timerRef       = useRef(null)
  const savedTimerRef  = useRef(null)
  const hasPendingRef  = useRef(false)

  planRef.current    = plan
  contextRef.current = { userId, weekStart, kidId }

  useEffect(() => {
    if (!userId) return
    // Cancel any pending auto-save for the previous context
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    hasPendingRef.current = false

    setLoading(true)
    setPlan({ weekStart, days: emptyDays() })

    supabase
      .from('week_plans')
      .select('days')
      .eq('user_id', userId)
      .eq('kid_id', kidId)
      .eq('week_start', weekStart)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.days) {
          const days = {}
          for (let i = 0; i < 7; i++) days[i] = data.days[i] ?? { ...EMPTY_DAY }
          setPlan({ weekStart, days })
        }
        setLoading(false)
      })
  }, [userId, weekStart, kidId])

  // Cleanup on unmount
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
  }, [])

  const doSave = useCallback(async () => {
    if (!hasPendingRef.current) return
    hasPendingRef.current = false
    timerRef.current = null
    const { userId, weekStart, kidId } = contextRef.current
    setSaveStatus('saving')
    await supabase.from('week_plans').upsert(
      { user_id: userId, kid_id: kidId, week_start: weekStart, days: planRef.current.days },
      { onConflict: 'user_id,kid_id,week_start' }
    )
    setSaveStatus('saved')
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
  }, [])

  const scheduleAutoSave = useCallback(() => {
    hasPendingRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(doSave, AUTOSAVE_DELAY)
  }, [doSave])

  const flushSave = useCallback(async () => {
    if (!hasPendingRef.current) return
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    await doSave()
  }, [doSave])

  function setSlot(dayIndex, type, itemId) {
    setPlan(prev => ({
      ...prev,
      days: { ...prev.days, [dayIndex]: { ...prev.days[dayIndex], [type]: itemId } },
    }))
    scheduleAutoSave()
  }

  function clearSlot(dayIndex, type) { setSlot(dayIndex, type, null) }

  function resetWeek() {
    setPlan({ weekStart, days: emptyDays() })
    scheduleAutoSave()
  }

  const dessertCount = Object.values(plan.days).filter(d => d.dessert !== null).length
  const mainCount    = Object.values(plan.days).filter(d => d.main !== null).length

  return { plan, setSlot, clearSlot, resetWeek, flushSave, saveStatus, dessertCount, mainCount, loading }
}
