import { useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '../data.js'
import { bagActions, fmt, mod, toast, toggleWish, useStore } from '../store.js'
import { Link } from '../router.jsx'
import WatchImg from './WatchImg.jsx'
import Icon from './Icons.jsx'
import useSpinner from './useSpinner.js'

const N = PRODUCTS.length
const STEP = 360 / N
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5)

/** The Signature Selection: a vertical Ferris wheel. The wheel turns, the chosen watch rests at 3 o'clock. */
export default function Signature() {
  const [idx, setIdx] = useState(0)            // unbounded so the wheel can keep turning either way
  const sel = mod(idx, N)
  const p = PRODUCTS[sel]
  const wish = useStore('wishlist', [])
  const stage = useRef(null)
  const ring = useRef(null)
  const rim = useRef(null)
  const cabins = useRef([])
  const geo = useRef({ R: 300, cx: 300, cy: 300 })
  const drag = useRef(null)

  useEffect(() => {
    const measure = () => {
      const W = stage.current.clientWidth, H = stage.current.clientHeight
      const R = Math.max(150, Math.min(H * 0.4, W * 0.5 - 70))
      geo.current = { R, cx: W - R - 140, cy: H / 2 }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  useSpinner(idx * STEP, (spin) => {
    const { R, cx, cy } = geo.current
    if (ring.current) {
      ring.current.style.cssText = `left:${cx - R}px;top:${cy - R}px;width:${2 * R}px;height:${2 * R}px`
      rim.current.style.transform = `rotate(${-spin}deg)`
    }
    cabins.current.forEach((el, i) => {
      if (!el) return
      const a = mod(i * STEP - spin + 180, 360) - 180      // -180..180, 0 = selected (3 o'clock)
      const r = (a * Math.PI) / 180
      const near = Math.max(0, 1 - Math.abs(a) / 100)
      const s = 0.62 + 0.5 * near
      el.style.transform = `translate(${cx + R * Math.cos(r)}px,${cy + R * Math.sin(r)}px) scale(${s})`
      el.style.opacity = Math.abs(a) > 112 ? 0 : 0.28 + 0.72 * near
      el.style.zIndex = Math.round(near * 10)
      el.style.pointerEvents = Math.abs(a) > 112 ? 'none' : 'auto'
    })
  })

  const next = () => setIdx((i) => i + 1)
  const prev = () => setIdx((i) => i - 1)
  const pick = (i) => { let d = mod(i - sel + Math.floor(N / 2), N) - Math.floor(N / 2); setIdx((x) => x + d) }

  const onDown = (e) => { if (e.pointerType === 'mouse') drag.current = e.clientY }
  const onMove = (e) => {
    if (drag.current == null) return
    const dy = e.clientY - drag.current
    if (Math.abs(dy) > 60) { dy < 0 ? next() : prev(); drag.current = e.clientY }
  }
  const onUp = () => { drag.current = null }

  return (
    <section id="signature" className="sel">
      <div className="wheel-stage" ref={stage}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        <div className="wheel-ring" ref={ring}>
          <svg viewBox="-104 -104 208 208" aria-hidden="true">
            <g ref={rim}>
              <circle r="100" className="rim" />
              <circle r="84" className="rim thin" />
              <circle r="5" className="hub" />
              {Array.from({ length: N }, (_, i) => <line key={i} x2={100 * Math.cos((i * STEP * Math.PI) / 180)} y2={100 * Math.sin((i * STEP * Math.PI) / 180)} className="spoke" />)}
              {TICKS.map((t) => <line key={t} className="tick" x1={Math.cos((t * Math.PI) / 180) * 100} y1={Math.sin((t * Math.PI) / 180) * 100} x2={Math.cos((t * Math.PI) / 180) * (t % 30 ? 96 : 92)} y2={Math.sin((t * Math.PI) / 180) * (t % 30 ? 96 : 92)} />)}
            </g>
            <path d="M107 0 L116 -5 L116 5 Z" className="pointer" />
          </svg>
        </div>
        {PRODUCTS.map((q, i) => (
          <button key={q.id} className={`cabin ${i === sel ? 'on' : ''}`} ref={(el) => (cabins.current[i] = el)}
            onClick={() => pick(i)} aria-label={`${q.name} ${q.variant}`}>
            <span className="disc" />
            <WatchImg p={q} />
          </button>
        ))}
        <div className="wheel-ctrl">
          <button onClick={prev} aria-label="Previous watch"><Icon n="up" /></button>
          <span>{String(sel + 1).padStart(2, '0')}<small>/{String(N).padStart(2, '0')}</small></span>
          <button onClick={next} aria-label="Next watch"><Icon n="down" /></button>
        </div>
      </div>

      <div className="sel-info">
        <p className="eyebrow">The Signature Selection</p>
        <div className="swap" key={p.id}>
          <span className="tag">{p.tag}</span>
          <h2>{p.name}<em>{p.variant}</em></h2>
          <p className="lead">{p.blurb}</p>
          <p className="price">{fmt(p.price)}</p>
          <div className="actions">
            <Link to={`/product/${p.id}`} className="btn gold">View details</Link>
            <button className="btn" onClick={() => { bagActions.add(p.id, 'M', 1); toast(`${p.name} ${p.variant} added to your bag`) }}>Add to bag</button>
            <button className={`heart ${wish.includes(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Toggle wishlist"><Icon n="heart" fill={wish.includes(p.id)} /></button>
          </div>
        </div>
        <p className="hint-s">Turn the wheel — drag, tap a watch, or use the arrows</p>
      </div>
    </section>
  )
}
