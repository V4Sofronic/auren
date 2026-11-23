import { useState } from 'react'
import { getStore, setStore } from '../store.js'

export default function FinalWord() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ ok: false, msg: '' })
  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState({ ok: false, msg: 'Please enter a valid email address.' })
    const list = getStore('subscribers', [])
    if (!list.includes(email.toLowerCase())) setStore('subscribers', [...list, email.toLowerCase()])
    setState({ ok: true, msg: 'Welcome to the house of AUREN. (Demo — saved on this device only.)' }); setEmail('')
  }
  return (
    <section id="final" className="final">
      <p className="eyebrow">The Final Word</p>
      <h2 className="display">Engineered beyond time</h2>
      <p className="lead center">Private previews, limited editions and the occasional story from the bench — delivered rarely, and never carelessly.</p>
      <form className="news" onSubmit={submit} noValidate>
        <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
        <button className="btn gold" type="submit">Subscribe</button>
      </form>
      <p className={`news-msg ${state.ok ? 'ok' : ''}`} role="status">{state.msg}</p>
    </section>
  )
}
