import { useEffect, useState } from 'react'
import { Link } from '../router.jsx'
import { goSection } from '../scroll.js'
import { useStore } from '../store.js'
import Icon from './Icons.jsx'

const LINKS = [['signature', 'Selection'], ['collection', 'Collection'], ['details', 'Details'], ['experience', 'Experience'], ['philosophy', 'Philosophy'], ['contact', 'Contact']]

export default function Nav({ solid }) {
  const bag = useStore('bag', [])
  const wish = useStore('wishlist', [])
  const session = useStore('session', null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const count = bag.reduce((s, l) => s + l.qty, 0)

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const jump = (id) => { setOpen(false); goSection(id) }
  return (
    <>
      <header className={`nav ${solid || scrolled ? 'solid' : ''}`}>
        <Link to="/" className="logo" onClick={() => setOpen(false)}>AUREN</Link>
        <nav className="links" aria-label="Main">
          {LINKS.map(([id, label]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
        </nav>
        <div className="icons">
          <Link to="/wishlist" aria-label="Wishlist" className="ibtn"><Icon n="heart" />{wish.length > 0 && <i>{wish.length}</i>}</Link>
          <Link to="/account" aria-label={session ? 'Account' : 'Sign in'} className={`ibtn ${session ? 'on' : ''}`}><Icon n="user" /></Link>
          <Link to="/bag" aria-label="Shopping bag" className="ibtn"><Icon n="bag" />{count > 0 && <i>{count}</i>}</Link>
          <button className="ibtn burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}><Icon n={open ? 'close' : 'menu'} /></button>
        </div>
      </header>
      <div className={`mmenu ${open ? 'open' : ''}`} data-lenis-prevent>
        {LINKS.map(([id, label]) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
        <Link to="/track" onClick={() => setOpen(false)}>Order Tracking</Link>
        <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
        <Link to="/account" onClick={() => setOpen(false)}>{session ? 'My Account' : 'Sign in'}</Link>
      </div>
    </>
  )
}
