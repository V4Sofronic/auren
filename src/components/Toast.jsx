import { useEffect, useState } from 'react'
export default function Toast() {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    let t
    const f = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(''), 2600) }
    window.addEventListener('auren-toast', f)
    return () => { window.removeEventListener('auren-toast', f); clearTimeout(t) }
  }, [])
  return <div className={`toast ${msg ? 'show' : ''}`} role="status" aria-live="polite">{msg}</div>
}
