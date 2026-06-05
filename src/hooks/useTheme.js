import { useState, useEffect } from 'react'

export const THEMES = [
  { id: 'sunny',  emoji: '☀️',  gradient: 'linear-gradient(135deg, #FFF9C4, #FFE0B2, #F8BBD9)' },
  { id: 'ocean',  emoji: '🌊',  gradient: 'linear-gradient(135deg, #DBEAFE, #BAE6FD, #A5F3FC)' },
  { id: 'forest', emoji: '🌿',  gradient: 'linear-gradient(135deg, #D1FAE5, #BBF7D0, #ECFCCB)' },
  { id: 'candy',  emoji: '🍬',  gradient: 'linear-gradient(135deg, #FDF2F8, #FCE7F3, #EDE9FE)' },
  { id: 'sunset', emoji: '🌅',  gradient: 'linear-gradient(135deg, #FEF3C7, #FED7AA, #FECACA)' },
]

const STORAGE_KEY = 'km_theme'

export function useTheme() {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'sunny')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function setTheme(id) {
    localStorage.setItem(STORAGE_KEY, id)
    setThemeState(id)
  }

  return { theme, setTheme }
}
