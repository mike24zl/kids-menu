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
    const { data } = await supabase
      .from('kids')
      .insert({ user_id: userId, name, icon })
      .select()
      .single()
    if (data) setKids(prev => [...prev, data])
    return data
  }

  async function removeKid(id) {
    await supabase.from('kids').delete().eq('id', id)
    setKids(prev => prev.filter(k => k.id !== id))
  }

  return { kids, addKid, removeKid, loading }
}
