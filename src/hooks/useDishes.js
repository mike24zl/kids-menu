import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_MAINS, DEFAULT_SIDES, DEFAULT_DESSERTS } from '../data/defaults'

const ALL_DEFAULTS = [...DEFAULT_MAINS, ...DEFAULT_SIDES, ...DEFAULT_DESSERTS]

function toDb({ id: _id, nameHe, imageUrl, ...rest }) {
  return {
    ...rest,
    ...(nameHe !== undefined && { name_he: nameHe }),
    ...(imageUrl !== undefined && { image_url: imageUrl }),
  }
}

function fromDb({ name_he, image_url, ...rest }) {
  return {
    ...rest,
    ...(name_he !== undefined && { nameHe: name_he }),
    ...(image_url !== undefined && { imageUrl: image_url }),
  }
}

export function useDishes(userId) {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase
      .from('user_dishes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          setDishes(data.map(fromDb))
        } else {
          // First login: seed defaults
          const rows = ALL_DEFAULTS.map(d => ({ ...toDb(d), user_id: userId }))
          const { data: inserted } = await supabase
            .from('user_dishes')
            .insert(rows)
            .select()
          setDishes((inserted ?? []).map(fromDb))
        }
        setLoading(false)
      })
  }, [userId])

  async function add(item) {
    const { data } = await supabase
      .from('user_dishes')
      .insert({ ...toDb(item), user_id: userId })
      .select()
      .single()
    if (data) setDishes(prev => [...prev, fromDb(data)])
  }

  async function update(id, patch) {
    const { data } = await supabase
      .from('user_dishes')
      .update(toDb(patch))
      .eq('id', id)
      .select()
      .single()
    if (data) setDishes(prev => prev.map(d => d.id === id ? fromDb(data) : d))
  }

  async function remove(id) {
    await supabase.from('user_dishes').delete().eq('id', id)
    setDishes(prev => prev.filter(d => d.id !== id))
  }

  function makePool(type) {
    return {
      items: dishes.filter(d => d.type === type),
      add: (item) => add({ ...item, type }),
      update,
      remove,
    }
  }

  return {
    mains:    makePool('main'),
    sides:    makePool('side'),
    desserts: makePool('dessert'),
    loading,
  }
}
