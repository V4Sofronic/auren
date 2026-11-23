import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PRODUCTS } from '../data.js'
import WatchImg from './WatchImg.jsx'

/** The AUREN watch that rises in and follows the cursor. `intensity` lowers the motion (0.4 = subtle). */
export default function TiltWatch({ p = PRODUCTS[0], intensity = 1, spinIn = true, className = '' }) {
  const wrap = useRef(null), rise = useRef(null), tilt = useRef(null), glare = useRef(null)

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const k = reduced ? 0 : intensity
    const m = { tx: 0, ty: 0, x: 0, y: 0, p: 0 }
    const st = ScrollTrigger.create({ trigger: wrap.current, start: 'top 90%', end: 'top 25%', scrub: 0.5, onUpdate: (s) => { m.p = s.progress } })
    const move = (e) => { m.tx = (e.clientX / window.innerWidth) * 2 - 1; m.ty = (e.clientY / window.innerHeight) * 2 - 1 }
    window.addEventListener('pointermove', move, { passive: true })
    const tick = (time) => {
      m.x += (m.tx - m.x) * 0.07
      m.y += (m.ty - m.y) * 0.07
      const e = 1 - Math.pow(1 - m.p, 3)
      rise.current.style.opacity = Math.min(1, e * 1.6)
      rise.current.style.transform = `translateY(${(1 - e) * 26}svh) rotateY(${spinIn ? (1 - e) * 120 : 0}deg) scale(${0.85 + e * 0.15})`
      const ry = m.x * 22 * k + Math.sin(time * 0.5) * 3 * k
      const rx = -m.y * 16 * k
      tilt.current.style.transform = `translate3d(${m.x * 16 * k}px, ${Math.sin(time * 0.9) * 7 * k + m.y * 10 * k}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`
      glare.current.style.setProperty('--gx', `${50 + m.x * 45}%`)
      glare.current.style.setProperty('--gy', `${35 + m.y * 40}%`)
    }
    gsap.ticker.add(tick)
    return () => { st.kill(); gsap.ticker.remove(tick); window.removeEventListener('pointermove', move) }
  }, [intensity, spinIn])

  return (
    <div className={`watch-stage ${className}`} ref={wrap}>
      <div className="rise" ref={rise}>
        <div className="tilt" ref={tilt}>
          <div className="halo" />
          <WatchImg p={p} shadow />
          <div className="glare" ref={glare} />
        </div>
      </div>
    </div>
  )
}
