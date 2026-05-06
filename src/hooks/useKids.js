import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LIMITS, sanitizeText } from '../utils/validation'

export function useKids(userId) {
  const [kids, setKids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('kids')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')
      .then(({ data }) => {
        setKids(data ?? [])
        setLoading(false)
      })
  }, [userId])

  async function addKid({ name, icon }) {
    const safeName = sanitizeText(name).slice(0, LIMITS.MAX_KID_NAME_LENGTH)
    if (!safeName || kids.length >= LIMITS.MAX_KIDS) return null
    const isFirst = kids.length === 0
    const { data } = await supabase
      .from('kids')
      .insert({ user_id: userId, name: safeName, icon })
      .select()
      .single()
    if (!data) return null
    if (isFirst) {
      // Migrate any plans saved under the 'default' sentinel to this kid
      await supabase
        .from('week_plans')
        .update({ kid_id: data.id })
        .eq('user_id', userId)
        .eq('kid_id', 'default')
    }
    setKids(prev => [...prev, data])
    return data
  }

  async function updateKid(id, patch) {
    const { data } = await supabase
      .from('kids')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (data) setKids(prev => prev.map(k => k.id === id ? data : k))
  }

  async function removeKid(id) {
    await supabase.from('kids').delete().eq('id', id)
    setKids(prev => prev.filter(k => k.id !== id))
  }

  return { kids, addKid, updateKid, removeKid, loading }
}
