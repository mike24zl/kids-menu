import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
    const isFirst = kids.length === 0
    const { data } = await supabase
      .from('kids')
      .insert({ user_id: userId, name, icon })
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

  async function removeKid(id) {
    await supabase.from('kids').delete().eq('id', id)
    setKids(prev => prev.filter(k => k.id !== id))
  }

  return { kids, addKid, removeKid, loading }
}
