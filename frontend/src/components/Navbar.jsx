import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mql) return
    const onChange = () => setPrefersDark(mql.matches)
    onChange()
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [])

  return prefersDark
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const prefersDark = usePrefersDark()
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem('lf_theme')
    if (stored === 'dark' || stored === 'light') return stored
    return prefersDark ? 'dark' : 'light'
  })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    window.localStorage.setItem('lf_theme', theme)
  }, [theme])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinkClass = useMemo(
    () =>
      ({ isActive }) =>
        ['navLink', isActive ? 'navLinkActive' : '']
          .filter(Boolean)
          .join(' '),
    [],
  )

  return (
    <motion.header
      className="appNavbar"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="navInner">
        <div className="brand" role="banner">
          <Link to="/" className="brandLink" aria-label="Campus Lost & Found Home">
            <span className="brandIcon" aria-hidden="true">
              ⌁
            </span>
            <span className="brandText">Campus Lost &amp; Found</span>
          </Link>
        </div>

        <button
          type="button"
          className="mobileMenuButton"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <nav className={`navLinks ${menuOpen ? 'navOpen' : ''}`} aria-label="Primary navigation">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/lost" className={navLinkClass}>
            Lost Items
          </NavLink>
          <NavLink to="/found" className={navLinkClass}>
            Found Items
          </NavLink>
          <NavLink to="/report" className={navLinkClass}>
            Report Item
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        </nav>

        <div className="navActions">
          <button
            type="button"
            className="themeToggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle dark mode"
          >
            <span aria-hidden="true">{theme === 'dark' ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

