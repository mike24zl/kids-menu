import { useState } from 'react'
import { DEFAULT_DISHES, DEFAULT_DESSERTS } from '../data/defaults'
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

export function useDishes() {
  const [dishes, setDishes] = useState(() => load('km_dishes', DEFAULT_DISHES))
  const [desserts, setDesserts] = useState(() => load('km_desserts', DEFAULT_DESSERTS))

  function addDish(dish) {
    const next = [...dishes, { ...dish, id: newId() }]
    setDishes(next)
    save('km_dishes', next)
  }

  function updateDish(id, patch) {
    const next = dishes.map(d => d.id === id ? { ...d, ...patch } : d)
    setDishes(next)
    save('km_dishes', next)
  }

  function deleteDish(id) {
    const next = dishes.filter(d => d.id !== id)
    setDishes(next)
    save('km_dishes', next)
  }

  function addDessert(dessert) {
    const next = [...desserts, { ...dessert, id: newId() }]
    setDesserts(next)
    save('km_desserts', next)
  }

  function updateDessert(id, patch) {
    const next = desserts.map(d => d.id === id ? { ...d, ...patch } : d)
    setDesserts(next)
    save('km_desserts', next)
  }

  function deleteDessert(id) {
    const next = desserts.filter(d => d.id !== id)
    setDesserts(next)
    save('km_desserts', next)
  }

  return { dishes, desserts, addDish, updateDish, deleteDish, addDessert, updateDessert, deleteDessert }
}
