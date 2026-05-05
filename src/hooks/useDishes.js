import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_MAINS, DEFAULT_SIDES, DEFAULT_DESSERTS } from '../data/defaults'

const ALL_DEFAULTS = [...DEFAULT_MAINS, ...DEFAULT_SIDES, ...DEFAULT_DESSERTS]

// Map type:name → imageUrl so existing DB rows (seeded before icons existed)
// get their icon applied in memory without needing a DB migration.
const DEFAULT_IMAGE_MAP = Object.fromEntries(
  ALL_DEFAULTS
    .filter(d => d.imageUrl)
    .map(d => [`${d.type}:${d.name}`, d.imageUrl])
)

function enrichWithIcon(dish) {
  if (dish.imageUrl) return dish
  const url = DEFAULT_IMAGE_MAP[`${dish.type}:${dish.name}`]
  return url ? { ...dish, imageUrl: url } : dish
}

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
          const existing = data.map(d => enrichWithIcon(fromDb(d)))
          const existingKeys = new Set(existing.map(d => `${d.type}:${d.name}`))
          const missing = ALL_DEFAULTS.filter(d => !existingKeys.has(`${d.type}:${d.name}`))
          if (missing.length > 0) {
            const rows = missing.map(d => ({ ...toDb(d), user_id: userId }))
            const { data: inserted } = await supabase
              .from('user_dishes')
              .insert(rows)
              .select()
            setDishes([...existing, ...(inserted ?? []).map(fromDb)])
          } else {
            setDishes(existing)
          }
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

  async function resetToDefaults() {
    await supabase.from('user_dishes').delete().eq('user_id', userId)
    const rows = ALL_DEFAULTS.map(d => ({ ...toDb(d), user_id: userId }))
    const { data: inserted } = await supabase.from('user_dishes').insert(rows).select()
    setDishes((inserted ?? []).map(fromDb))
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
    resetToDefaults,
    loading,
  }
}
