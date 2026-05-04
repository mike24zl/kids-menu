import { useRef } from 'react'

// Tiny inline base64 WAV sounds so no file fetching is needed
const POP_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
const BOING_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

export function useSound() {
  const popRef = useRef(null)
  const boingRef = useRef(null)

  function playPop() {
    try {
      if (!popRef.current) popRef.current = new Audio(POP_WAV)
      popRef.current.currentTime = 0
      popRef.current.play().catch(() => {})
    } catch {}
  }

  function playBoing() {
    try {
      if (!boingRef.current) boingRef.current = new Audio(BOING_WAV)
      boingRef.current.currentTime = 0
      boingRef.current.play().catch(() => {})
    } catch {}
  }

  return { playPop, playBoing }
}
