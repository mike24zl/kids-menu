import { useState } from 'react'
import { DEFAULT_MAINS, DEFAULT_SIDES, DEFAULT_VEGGIES, DEFAULT_DESSERTS } from '../data/defaults'
import { newId } from '../utils/ids'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function makePool(key, defaults) {
  function usePool() {
    const [items, setItems] = useState(() => load(key, defaults))

    function add(item) {
      const next = [...items, { ...item, id: newId(), type: item.type }]
      setItems(next); save(key, next)
    }
    function update(id, patch) {
      const next = items.map(d => d.id === id ? { ...d, ...patch } : d)
      setItems(next); save(key, next)
    }
    function remove(id) {
      const next = items.filter(d => d.id !== id)
      setItems(next); save(key, next)
    }

    return { items, add, update, remove }
  }
  return usePool
}

const useMains    = makePool('km_mains',    DEFAULT_MAINS)
const useSides    = makePool('km_sides',    DEFAULT_SIDES)
const useVeggies  = makePool('km_veggies',  DEFAULT_VEGGIES)
const useDessertsPool = makePool('km_desserts', DEFAULT_DESSERTS)

export function useDishes() {
  const mains    = useMains()
  const sides    = useSides()
  const veggies  = useVeggies()
  const desserts = useDessertsPool()

  return { mains, sides, veggies, desserts }
}
