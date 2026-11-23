import { useEffect, useRef } from 'react'
import gsap from 'gsap'
/** Smoothly chases `target` (a number) and calls onFrame(current) every tick. Supports reversing/continuous spins. */
export default function useSpinner(target, onFrame, rate = 0.11) {
  const cur = useRef(target)
  const tgt = useRef(target)
  const cb = useRef(onFrame)
  tgt.current = target
  cb.current = onFrame
  useEffect(() => {
    const tick = () => {
      const d = tgt.current - cur.current
      cur.current = Math.abs(d) < 0.001 ? tgt.current : cur.current + d * rate
      cb.current(cur.current)
    }
    tick()
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [rate])
}
