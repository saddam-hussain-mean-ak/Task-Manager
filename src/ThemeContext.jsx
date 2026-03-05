import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Default to dark mode if no preference saved
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved !== null ? saved === 'dark' : true
  })

  useEffect(() => {
    // dark = true → no data-theme attr (uses :root dark defaults)
    // dark = false → data-theme="light" triggers light overrides
    if (dark) {
      document.body.removeAttribute('data-theme')
    } else {
      document.body.setAttribute('data-theme', 'light')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = () => setDark(d => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
