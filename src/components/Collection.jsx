import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '../data.js'
import { bagActions, fmt, mod, toast, toggleWish, useStore } from '../store.js'
import { Link } from '../router.jsx'
import WatchImg from './WatchImg.jsx'
import ArcClock from './ArcClock.jsx'
import Icon from './Icons.jsx'
import useSpinner from './useSpinner.js'

const N = PRODUCTS.length
const VIS = 46 // degrees between neighbours on the cylinder

/** The Collection: a horizontal cylinder. Centre watch is full opacity; the rest sit back at reduced opacity. */
export default function Collection() {
  const [idx, setIdx] = useState(0)
  const sel = mod(idx, N)
  const p = PRODUCTS[sel]
  const wish = useStore('wishlist', [])
  const stage = useRef(null)
  const cyl = useRef(null)
  const items = useRef([])
  const Rz = useRef(420)
  const drag = useRef(null)

  useEffect(() => {
    const measure = () => { Rz.current = Math.max(200, Math.min(520, stage.current.clientWidth * 0.52)) }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  useSpinner(idx, (pos) => {
    const R = Rz.current
    cyl.current.style.transform = `translateZ(${-R}px)`
    items.current.forEach((el, i) => {
      if (!el) return
      const a = (mod(i - pos + N / 2, N) - N / 2) * VIS          // shortest way round the cylinder
      el.style.transform = `rotateY(${a}deg) translateZ(${R}px) rotateY(${-a * 0.75}deg)`   // watches stay readable, just angled
      const ab = Math.abs(a)
      el.style.opacity = ab < 5 ? 1 : ab > 110 ? 0 : Math.max(0.12, 1 - (ab / VIS) * 0.7)
      el.style.pointerEvents = ab > 110 ? 'none' : 'auto'
    })
  })

  const next = () => setIdx((i) => i + 1)
  const prev = () => setIdx((i) => i - 1)
  const pick = (i) => { const d = mod(i - sel + Math.floor(N / 2), N) - Math.floor(N / 2); setIdx((x) => x + d) }
  const onDown = (e) => { drag.current = e.clientX }
  const onMove = (e) => {
    if (drag.current == null) return
    const dx = e.clientX - drag.current
    if (Math.abs(dx) > 70) { dx < 0 ? next() : prev(); drag.current = e.clientX }
  }
  const onUp = () => { drag.current = null }
  const onKey = (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }

  return (
    <section id="collection" className="cylsec">
      <header className="sec-head">
        <p className="eyebrow">The Collection</p>
        <h2 className="display">Five expressions of one idea</h2>
      </header>
      <div className="cyl-grid">
        <div className="cyl-wrap" tabIndex={0} onKeyDown={onKey} aria-label="Collection carousel, use arrow keys">
          <div className="cyl-stage" ref={stage} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
            <div className="cyl" ref={cyl}>
              {PRODUCTS.map((q, i) => (
                <div key={q.id} className="cyl-item" ref={(el) => (items.current[i] = el)} onClick={() => pick(i)} role="button" aria-label={`${q.variant}`}>
                  <WatchImg p={q} />
                </div>
              ))}
            </div>
          </div>
          <div className="cyl-ctrl">
            <button onClick={prev} aria-label="Previous"><Icon n="left" /></button>
            <div className="dots">{PRODUCTS.map((q, i) => <button key={q.id} className={i === sel ? 'on' : ''} onClick={() => pick(i)} aria-label={q.variant} />)}</div>
            <button onClick={next} aria-label="Next"><Icon n="right" /></button>
          </div>
        </div>

        <aside className="cyl-info">
          <ArcClock index={sel} count={N} />
          <div className="swap" key={p.id}>
            <span className="tag">{p.tag}</span>
            <h3>{p.name} <em>{p.variant}</em></h3>
            <p className="lead">{p.blurb}</p>
            <p className="price">{fmt(p.price)}</p>
            <div className="actions">
              <Link to={`/product/${p.id}`} className="btn gold">View details</Link>
              <button className="btn" onClick={() => { bagActions.add(p.id, 'M', 1); toast(`${p.name} ${p.variant} added to your bag`) }}>Add to bag</button>
              <button className={`heart ${wish.includes(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Toggle wishlist"><Icon n="heart" fill={wish.includes(p.id)} /></button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
