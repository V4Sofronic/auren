import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

const CX = 120, CY = 122
const pt = (deg, r) => [CX + r * Math.cos((deg * Math.PI) / 180), CY - r * Math.sin((deg * Math.PI) / 180)]

/** Semi-circular clock: the needle clicks to a new position every time the selection changes. */
export default function ArcClock({ index, count }) {
  const needle = useRef(null)
  const first = useRef(true)
  const angleFor = (i) => (count > 1 ? -72 + (i / (count - 1)) * 144 : 0)   // needle degrees from 12 o'clock
  const ticks = useMemo(() => Array.from({ length: 37 }, (_, k) => 180 - k * 5), [])

  useEffect(() => {
    const to = angleFor(index)
    if (first.current) { gsap.set(needle.current, { rotation: to, svgOrigin: `${CX} ${CY}` }); first.current = false; return }
    // quick mechanical "tick": snap past, then settle back
    gsap.timeline()
      .to(needle.current, { rotation: to + (Math.sign(to - gsap.getProperty(needle.current, 'rotation')) || 1) * 4, svgOrigin: `${CX} ${CY}`, duration: 0.16, ease: 'power3.out' })
      .to(needle.current, { rotation: to, svgOrigin: `${CX} ${CY}`, duration: 0.35, ease: 'elastic.out(1,0.35)' })
  }, [index]) // eslint-disable-line

  return (
    <div className="arcclock" aria-label={`Watch ${index + 1} of ${count}`}>
      <svg viewBox="0 0 240 142">
        <path d={`M ${CX - 104} ${CY} A 104 104 0 0 1 ${CX + 104} ${CY}`} className="arc-line" />
        {ticks.map((d, k) => {
          const major = k % 6 === 0
          const [x1, y1] = pt(d, 98), [x2, y2] = pt(d, major ? 84 : 91)
          return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} className={major ? 'tk major' : 'tk'} />
        })}
        {Array.from({ length: count }, (_, i) => {
          const [x, y] = pt(90 - angleFor(i), 70)
          return <text key={i} x={x} y={y + 4} textAnchor="middle" className={`num-l ${i === index ? 'on' : ''}`}>{i + 1}</text>
        })}
        <g ref={needle}>
          <line x1={CX} y1={CY + 10} x2={CX} y2={CY - 84} className="needle" />
          <circle cx={CX} cy={CY - 84} r="2.6" className="needle-tip" />
        </g>
        <circle cx={CX} cy={CY} r="6" className="hub2" />
        <circle cx={CX} cy={CY} r="2" className="hub3" />
      </svg>
      <div className="readout" key={index}>{String(index + 1).padStart(2, '0')}<small> / {String(count).padStart(2, '0')}</small></div>
    </div>
  )
}
