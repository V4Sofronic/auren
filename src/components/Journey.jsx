import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CLIPS, clipSrc } from '../clips.js'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (x) => x * x * (3 - 2 * x)
let loaderShown = false // the AUREN loader only plays on the first visit
const SCREENS_PER_CLIP = 1.4 // scroll length per clip (in viewport heights)
const COVER_FADE = 0.22      // black cover on the first clip is fully clear after this much scroll (~2-3 wheel clicks). Bigger = slower

/**
 * One sticky stage. Scroll progress -> "g" (0..N). Clip i plays while g is in [i, i+1],
 * and crossfades over the previous clip around g = i. Scrolling back reverses everything.
 */
export default function Journey() {
  const sec = useRef(null)
  const vids = useRef([])
  const layers = useRef([])
  const caps = useRef([])
  const hero = useRef(null)
  const cover = useRef(null)
  const bar = useRef(null)
  const [missing, setMissing] = useState({})
  const [ready, setReady] = useState(loaderShown)

  useLayoutEffect(() => {
    const N = CLIPS.length
    const s = { g: 0, target: 0 }

    const render = (g) => {
      CLIPS.forEach((_, i) => {
        const local = clamp(g - i)
        // crossfade in around the boundary (clip 0 is always the base layer)
        const op = i === 0 ? 1 : smooth(clamp((g - i + 0.12) / 0.24))
        const layer = layers.current[i]
        if (layer) layer.style.opacity = op
        const v = vids.current[i]
        if (v && Math.abs(g - (i + 0.5)) < 0.75 && v.readyState >= 1 && v.duration) {
          const t = local * (v.duration - 0.05)
          if (Math.abs(v.currentTime - t) > 0.015) v.currentTime = t
        }
        const c = caps.current[i]
        if (c) {
          const a = smooth(clamp((g - i - 0.08) / 0.18)) * (1 - smooth(clamp((g - i - 0.72) / 0.2)))
          c.style.opacity = a
          c.style.transform = `translateY(${(1 - a) * 18}px)`
        }
      })
      if (cover.current) cover.current.style.opacity = 1 - smooth(clamp(g / COVER_FADE))
      if (hero.current) hero.current.style.opacity = 1 - clamp(g / (COVER_FADE * 0.9))
      if (bar.current) bar.current.style.transform = `scaleX(${clamp(g / N)})`
    }

    const st = ScrollTrigger.create({
      trigger: sec.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { s.target = self.progress * N },
    })
    const tick = () => {
      s.g += (s.target - s.g) * 0.14
      if (Math.abs(s.target - s.g) < 0.0005) s.g = s.target
      render(s.g)
    }
    gsap.ticker.add(tick)

    // iOS/Safari: "unlock" video seeking by briefly playing, then pausing
    const unlock = () => vids.current.forEach((v) => v && v.play().then(() => v.pause()).catch(() => {}))
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
    window.addEventListener('pointerdown', unlock, { once: true })
    render(0)
    const t = setTimeout(() => { loaderShown = true; setReady(true) }, loaderShown ? 0 : 900)
    return () => {
      clearTimeout(t); st.kill(); gsap.ticker.remove(tick)
      window.removeEventListener('touchstart', unlock); window.removeEventListener('pointerdown', unlock)
    }
  }, [])

  return (
    <section
      ref={sec}
      className="journey"
      style={{ height: `${CLIPS.length * SCREENS_PER_CLIP * 100}svh` }}
    >
      <div className="stage">
        {CLIPS.map((c, i) => (
          <div className="layer" key={i} ref={(el) => (layers.current[i] = el)} style={{ zIndex: i, opacity: i === 0 ? 1 : 0 }}>
            {missing[i] ? (
              <div className="placeholder">
                <span>Clip {String(c.n).padStart(2, '0')} — {c.title}</span>
                <small>Add public/clips/clip-{String(c.n).padStart(2, '0')}.mp4</small>
              </div>
            ) : (
              <video
                ref={(el) => (vids.current[i] = el)}
                src={clipSrc(c)}
                muted playsInline preload="auto"
                onError={() => setMissing((m) => ({ ...m, [i]: true }))}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget
                  v.dataset.orient = v.videoHeight > v.videoWidth ? 'portrait' : 'landscape'
                  ScrollTrigger.refresh()
                }}
              />
            )}
          </div>
        ))}

        <div className="cover" ref={cover} />
        <div className="vignette" />
        <div className="grain" />

        <div className="hero" ref={hero}>
          <p className="eyebrow">AUREN ONE</p>
          <h1>ENGINEERED<br />BEYOND TIME</h1>
          <p className="cue">Scroll to begin</p>
        </div>

        {CLIPS.map((c, i) => (
          <div className="caption" key={i} ref={(el) => (caps.current[i] = el)}>
            <span className="num">{String(i + 1).padStart(2, '0')} / {String(CLIPS.length).padStart(2, '0')}</span>
            <h2>{c.title}</h2>
            <p>{c.caption}</p>
          </div>
        ))}

        <div className="progress"><i ref={bar} /></div>
      </div>
      <div className={`loader ${ready ? 'done' : ''}`}><span>AUREN</span></div>
    </section>
  )
}
